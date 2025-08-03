-- Debug Data Fetching Issues
-- This script will help identify why profiles are not appearing on the frontend

-- Step 1: Check if profiles table exists and has data
SELECT 
  'Profiles Table Check' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_profiles
FROM public.profiles;

-- Step 2: Check for teachers specifically
SELECT 
  'Teachers Check' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete,
  created_at
FROM public.profiles 
WHERE role = 'teacher'
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: Check for schools specifically
SELECT 
  'Schools Check' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete,
  created_at
FROM public.profiles 
WHERE role = 'school'
ORDER BY created_at DESC
LIMIT 10;

-- Step 4: Check RLS policies
SELECT 
  'RLS Policies' as info,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- Step 5: Test the exact query that the frontend uses for teachers
SELECT 
  'Frontend Teachers Query Test' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  created_at
FROM public.profiles 
WHERE role = 'teacher' 
  AND is_published = TRUE 
  AND is_active = TRUE
ORDER BY created_at DESC
LIMIT 5;

-- Step 6: Test the exact query that the frontend uses for schools
SELECT 
  'Frontend Schools Query Test' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  created_at
FROM public.profiles 
WHERE role = 'school' 
  AND is_published = TRUE 
  AND is_active = TRUE
ORDER BY created_at DESC
LIMIT 5;

-- Step 7: Check if there are any profiles that should be visible but aren't
SELECT 
  'Potentially Hidden Profiles' as info,
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
  (is_active IS NULL OR is_active = FALSE) OR
  (is_published IS NULL OR is_published = FALSE) OR
  (full_name IS NULL OR full_name = '' OR full_name = 'null')
ORDER BY created_at DESC; 