-- Fix User Profile Visibility Issues
-- This script will diagnose and fix problems with user profiles not appearing

-- Step 1: Check current profiles data
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  is_active,
  is_profile_complete
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Check for any NULL or empty full_names that might be causing issues
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles 
WHERE full_name IS NULL OR full_name = '' OR full_name = 'null'
ORDER BY created_at DESC;

-- Step 3: Fix any NULL or empty full_names
UPDATE public.profiles 
SET full_name = COALESCE(full_name, email, 'Unknown User')
WHERE full_name IS NULL OR full_name = '' OR full_name = 'null';

-- Step 4: Ensure all profiles have proper role values
UPDATE public.profiles 
SET role = COALESCE(role, 'teacher')
WHERE role IS NULL;

-- Step 5: Ensure all profiles are active
UPDATE public.profiles 
SET is_active = TRUE
WHERE is_active IS NULL;

-- Step 6: Update profile completeness based on available data
UPDATE public.profiles 
SET is_profile_complete = (
  full_name IS NOT NULL AND 
  full_name != '' AND 
  full_name != 'Unknown User' AND
  role IS NOT NULL
)
WHERE is_profile_complete IS NULL;

-- Step 7: Check RLS policies and ensure they're working correctly
-- Drop and recreate the policies to ensure they work properly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

-- Create new policies that ensure visibility
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);  -- Allow everyone to view profiles

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admin can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 8: Ensure the table has proper RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 9: Check final state of profiles
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools
FROM public.profiles;

-- Step 10: Show sample of fixed profiles
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  is_profile_complete,
  created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 5; 