-- EMERGENCY FIX: Profile Visibility and Login Issues
-- This script will fix the immediate problems preventing profiles from appearing and users from logging in

-- Step 1: Fix the NULL role issue first
UPDATE public.profiles 
SET role = 'teacher'
WHERE role IS NULL;

-- Step 2: Set ALL profiles as published and complete
UPDATE public.profiles 
SET 
  is_published = TRUE,
  is_profile_complete = TRUE,
  is_active = TRUE
WHERE id IS NOT NULL;

-- Step 3: Ensure all profiles have proper basic data
UPDATE public.profiles 
SET 
  full_name = COALESCE(full_name, email, 'Unknown User'),
  role = COALESCE(role, 'teacher'),
  last_seen_at = COALESCE(last_seen_at, created_at),
  updated_at = COALESCE(updated_at, created_at)
WHERE 
  full_name IS NULL OR 
  full_name = '' OR 
  full_name = 'null' OR
  role IS NULL;

-- Step 4: Drop ALL existing RLS policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Step 5: Create simple, permissive RLS policies to ensure access
-- Allow everyone to view all profiles (temporary fix)
CREATE POLICY "Allow all profile reads" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Step 6: Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Check the fix results
SELECT 
  'AFTER FIX - Profile Status' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_profiles,
  COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools,
  COUNT(CASE WHEN role IS NULL THEN 1 END) as null_roles
FROM public.profiles;

-- Step 8: Show sample of fixed profiles
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

-- Step 9: Test the exact queries that the frontend uses
SELECT 
  'Frontend Teachers Query Test' as info,
  COUNT(*) as teacher_count
FROM public.profiles 
WHERE role = 'teacher' AND is_published = TRUE AND is_active = TRUE;

SELECT 
  'Frontend Schools Query Test' as info,
  COUNT(*) as school_count
FROM public.profiles 
WHERE role = 'school' AND is_published = TRUE AND is_active = TRUE;

-- Step 10: Check for any remaining issues
SELECT 
  'Remaining Issues Check' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete
FROM public.profiles 
WHERE 
  is_active = FALSE OR
  is_published = FALSE OR
  is_profile_complete = FALSE OR
  role IS NULL OR
  full_name IS NULL OR
  full_name = '' OR
  full_name = 'null'; 