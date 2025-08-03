-- DEBUG CURRENT STATE
-- This script will check what data exists and why profiles aren't displaying

-- Step 1: Check what tables exist
SELECT 
  'Existing Tables' as info,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'teacher_profiles', 'school_profiles')
ORDER BY table_name;

-- Step 2: Check if profiles table has data
SELECT 
  'Profiles Table Data' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_profiles
FROM public.profiles;

-- Step 3: Check if teacher_profiles table has data
SELECT 
  'Teacher Profiles Table Data' as info,
  COUNT(*) as total_teachers,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_teachers,
  COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_teachers
FROM public.teacher_profiles;

-- Step 4: Check if school_profiles table has data
SELECT 
  'School Profiles Table Data' as info,
  COUNT(*) as total_schools,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_schools,
  COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_schools
FROM public.school_profiles;

-- Step 5: Check RLS policies on profiles table
SELECT 
  'RLS Policies on Profiles' as info,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- Step 6: Check RLS policies on teacher_profiles table
SELECT 
  'RLS Policies on Teacher Profiles' as info,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'teacher_profiles';

-- Step 7: Check RLS policies on school_profiles table
SELECT 
  'RLS Policies on School Profiles' as info,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'school_profiles';

-- Step 8: Test the exact queries that the frontend uses
-- Test teacher_profiles query
SELECT 
  'Frontend Teacher Query Test' as info,
  COUNT(*) as teacher_count
FROM public.teacher_profiles 
WHERE is_published = TRUE;

-- Test school_profiles query
SELECT 
  'Frontend School Query Test' as info,
  COUNT(*) as school_count
FROM public.school_profiles 
WHERE is_published = TRUE;

-- Test profiles query (if frontend is still using profiles table)
SELECT 
  'Frontend Profiles Query Test' as info,
  COUNT(*) as profile_count
FROM public.profiles 
WHERE role = 'teacher' AND is_published = TRUE AND is_active = TRUE;

-- Step 9: Show sample data from each table
SELECT 
  'Sample Profiles Data' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 5;

SELECT 
  'Sample Teacher Profiles Data' as info,
  id,
  email,
  full_name,
  is_published,
  is_profile_complete,
  created_at
FROM public.teacher_profiles 
ORDER BY created_at DESC
LIMIT 5;

SELECT 
  'Sample School Profiles Data' as info,
  id,
  email,
  full_name,
  school_name,
  is_published,
  is_profile_complete,
  created_at
FROM public.school_profiles 
ORDER BY created_at DESC
LIMIT 5;

-- Step 10: Check if RLS is enabled on tables
SELECT 
  'RLS Status' as info,
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'teacher_profiles', 'school_profiles')
  AND schemaname = 'public'; 