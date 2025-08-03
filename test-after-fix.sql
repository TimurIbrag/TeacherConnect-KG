-- TEST SCRIPT TO VERIFY THE FIX WORKED

-- Test 1: Check if we can access all tables without errors
SELECT '✅ Can access profiles table' as test, COUNT(*) as count FROM public.profiles;

-- Test 2: Check if teacher_profiles has data and required columns
SELECT '✅ Teacher profiles data' as test, COUNT(*) as total, 
       COUNT(CASE WHEN is_published = true THEN 1 END) as published,
       COUNT(CASE WHEN is_profile_complete = true THEN 1 END) as complete
FROM public.teacher_profiles;

-- Test 3: Check if school_profiles has data and required columns
SELECT '✅ School profiles data' as test, COUNT(*) as total,
       COUNT(CASE WHEN is_published = true THEN 1 END) as published,
       COUNT(CASE WHEN is_profile_complete = true THEN 1 END) as complete
FROM public.school_profiles;

-- Test 4: Check if we can fetch teacher data with profiles join
SELECT '✅ Teacher profiles with join' as test, COUNT(*) as count 
FROM public.teacher_profiles tp
LEFT JOIN public.profiles p ON tp.id = p.id
LIMIT 5;

-- Test 5: Check if we can fetch school data with profiles join
SELECT '✅ School profiles with join' as test, COUNT(*) as count 
FROM public.school_profiles sp
LEFT JOIN public.profiles p ON sp.id = p.id
LIMIT 5;

-- Test 6: Show sample teacher data
SELECT '📋 Sample teacher data' as test, id, full_name, specialization, experience_years, is_published, is_profile_complete
FROM public.teacher_profiles 
LIMIT 3;

-- Test 7: Show sample school data
SELECT '📋 Sample school data' as test, id, school_name, school_type, description, is_published, is_profile_complete
FROM public.school_profiles 
LIMIT 3; 