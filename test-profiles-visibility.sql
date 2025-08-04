-- SIMPLE TEST - Check if profiles are visible
-- Run this after the main fix to verify everything works

-- Test 1: Check total profiles
SELECT 'Total profiles in database' as test, COUNT(*) as count FROM public.profiles;

-- Test 2: Check teacher profiles
SELECT 'Teacher profiles' as test, COUNT(*) as count FROM public.profiles WHERE role = 'teacher';

-- Test 3: Check school profiles  
SELECT 'School profiles' as test, COUNT(*) as count FROM public.profiles WHERE role = 'school';

-- Test 4: Check published teacher profiles
SELECT 'Published teacher profiles' as test, COUNT(*) as count 
FROM public.profiles 
WHERE role = 'teacher' AND is_published = true AND is_profile_complete = true;

-- Test 5: Check published school profiles
SELECT 'Published school profiles' as test, COUNT(*) as count 
FROM public.profiles 
WHERE role = 'school' AND is_published = true AND is_profile_complete = true;

-- Test 6: Show sample teacher data
SELECT 'Sample teacher data' as test, id, full_name, specialization, location 
FROM public.profiles 
WHERE role = 'teacher' AND is_published = true 
LIMIT 3;

-- Test 7: Show sample school data
SELECT 'Sample school data' as test, id, school_name, school_type, school_address 
FROM public.profiles 
WHERE role = 'school' AND is_published = true 
LIMIT 3;

-- Test 8: Check RLS policies
SELECT 'RLS policies on profiles' as test, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public'; 