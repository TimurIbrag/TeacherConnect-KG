-- SIMPLE TEST - Check what data exists and what we can access

-- Test 1: Check if we can access any data at all
SELECT 'Can we access profiles table?' as test, COUNT(*) as count FROM public.profiles;

-- Test 2: Check if we can access teacher_profiles table
SELECT 'Can we access teacher_profiles table?' as test, COUNT(*) as count FROM public.teacher_profiles;

-- Test 3: Check if we can access school_profiles table
SELECT 'Can we access school_profiles table?' as test, COUNT(*) as count FROM public.school_profiles;

-- Test 4: Show what's actually in the profiles table
SELECT 'What is in profiles table?' as test, id, email, full_name, role FROM public.profiles LIMIT 5;

-- Test 5: Show what's actually in teacher_profiles table
SELECT 'What is in teacher_profiles table?' as test, id, email, full_name FROM public.teacher_profiles LIMIT 5;

-- Test 6: Show what's actually in school_profiles table
SELECT 'What is in school_profiles table?' as test, id, email, full_name, school_name FROM public.school_profiles LIMIT 5;

-- Test 7: Check if RLS is blocking us
SELECT 'RLS status on profiles' as test, rowsecurity FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public';

-- Test 8: Try to disable RLS temporarily to see if that's the issue
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles DISABLE ROW LEVEL SECURITY;

-- Test 9: Now check again with RLS disabled
SELECT 'After disabling RLS - profiles count' as test, COUNT(*) as count FROM public.profiles;
SELECT 'After disabling RLS - teacher_profiles count' as test, COUNT(*) as count FROM public.teacher_profiles;
SELECT 'After disabling RLS - school_profiles count' as test, COUNT(*) as count FROM public.school_profiles; 