-- Comprehensive Diagnostic and Fix for User Profile Display Issues
-- This script will identify why users are not appearing after Supabase changes

-- Step 1: Check current state of profiles table
SELECT 
  'Current Profiles State' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools,
  COUNT(CASE WHEN full_name IS NOT NULL AND full_name != '' THEN 1 END) as named_profiles
FROM public.profiles;

-- Step 2: Check for problematic data
SELECT 
  'Problematic Profiles' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete,
  created_at
FROM public.profiles 
WHERE 
  full_name IS NULL OR 
  full_name = '' OR 
  full_name = 'null' OR
  role IS NULL OR
  is_active IS NULL OR
  is_published IS NULL
ORDER BY created_at DESC;

-- Step 3: Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Step 4: Fix data issues
-- Fix NULL or empty full_names
UPDATE public.profiles 
SET full_name = COALESCE(full_name, email, 'Unknown User')
WHERE full_name IS NULL OR full_name = '' OR full_name = 'null';

-- Fix NULL roles
UPDATE public.profiles 
SET role = COALESCE(role, 'teacher')
WHERE role IS NULL;

-- Fix NULL is_active
UPDATE public.profiles 
SET is_active = TRUE
WHERE is_active IS NULL;

-- Fix NULL is_published (set to true if profile is complete)
UPDATE public.profiles 
SET is_published = CASE 
  WHEN full_name IS NOT NULL AND full_name != '' AND role IS NOT NULL THEN TRUE
  ELSE FALSE
END
WHERE is_published IS NULL;

-- Fix NULL is_profile_complete
UPDATE public.profiles 
SET is_profile_complete = CASE 
  WHEN full_name IS NOT NULL AND full_name != '' AND role IS NOT NULL THEN TRUE
  ELSE FALSE
END
WHERE is_profile_complete IS NULL;

-- Step 5: Ensure all required fields have default values
UPDATE public.profiles 
SET 
  last_seen_at = COALESCE(last_seen_at, created_at),
  updated_at = COALESCE(updated_at, created_at)
WHERE last_seen_at IS NULL OR updated_at IS NULL;

-- Step 6: Drop and recreate RLS policies to ensure proper access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create comprehensive policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (is_published = TRUE AND is_active = TRUE);

CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

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

-- Step 7: Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 8: Check final state
SELECT 
  'Final State After Fix' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools,
  COUNT(CASE WHEN full_name IS NOT NULL AND full_name != '' THEN 1 END) as named_profiles
FROM public.profiles;

-- Step 9: Show sample of fixed profiles
SELECT 
  'Sample Fixed Profiles' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete,
  created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 10; 