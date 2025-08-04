-- COMPREHENSIVE DIAGNOSTIC FOR REGISTRATION AND PROFILE ISSUES

-- Step 1: Check current database state
SELECT '=== DATABASE STATE CHECK ===' as info;

-- Check if tables exist and have data
SELECT 'Profiles table' as table_name, COUNT(*) as count FROM public.profiles;
SELECT 'Teacher profiles table' as table_name, COUNT(*) as count FROM public.teacher_profiles;
SELECT 'School profiles table' as table_name, COUNT(*) as count FROM public.school_profiles;

-- Step 2: Check RLS policies
SELECT '=== RLS POLICIES CHECK ===' as info;

-- Check profiles table policies
SELECT 'Profiles table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- Check teacher_profiles table policies
SELECT 'Teacher profiles table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'teacher_profiles' AND schemaname = 'public';

-- Check school_profiles table policies
SELECT 'School profiles table policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'school_profiles' AND schemaname = 'public';

-- Step 3: Check if RLS is enabled
SELECT '=== RLS ENABLED CHECK ===' as info;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'teacher_profiles', 'school_profiles') 
AND schemaname = 'public';

-- Step 4: Check trigger function
SELECT '=== TRIGGER FUNCTION CHECK ===' as info;
SELECT routine_name, routine_type, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
AND routine_schema = 'public';

-- Check if trigger exists
SELECT '=== TRIGGER CHECK ===' as info;
SELECT trigger_name, event_manipulation, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created' 
AND event_object_schema = 'auth';

-- Step 5: Check recent user registrations
SELECT '=== RECENT USER REGISTRATIONS ===' as info;
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Step 6: Check profile creation issues
SELECT '=== PROFILE CREATION ISSUES ===' as info;
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.is_active,
    p.is_published,
    p.is_profile_complete,
    p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC 
LIMIT 10;

-- Step 7: Check role-specific profile issues
SELECT '=== TEACHER PROFILE ISSUES ===' as info;
SELECT 
    tp.id,
    tp.full_name,
    tp.specialization,
    tp.experience_years,
    tp.is_published,
    tp.is_profile_complete,
    tp.is_active
FROM public.teacher_profiles tp
ORDER BY tp.id;

SELECT '=== SCHOOL PROFILE ISSUES ===' as info;
SELECT 
    sp.id,
    sp.school_name,
    sp.school_type,
    sp.description,
    sp.is_published,
    sp.is_profile_complete,
    sp.is_active
FROM public.school_profiles sp
ORDER BY sp.id;

-- Step 8: Test public access
SELECT '=== PUBLIC ACCESS TEST ===' as info;

-- Test profiles table access
SELECT 'Profiles table public access test:' as test, COUNT(*) as count FROM public.profiles;

-- Test teacher_profiles table access
SELECT 'Teacher profiles table public access test:' as test, COUNT(*) as count FROM public.teacher_profiles;

-- Test school_profiles table access
SELECT 'School profiles table public access test:' as test, COUNT(*) as count FROM public.school_profiles;

-- Step 9: Check for missing data
SELECT '=== MISSING DATA CHECK ===' as info;

-- Check profiles without role-specific profiles
SELECT 'Profiles without teacher_profiles:' as issue, COUNT(*) as count
FROM public.profiles p
LEFT JOIN public.teacher_profiles tp ON p.id = tp.id
WHERE p.role = 'teacher' AND tp.id IS NULL;

SELECT 'Profiles without school_profiles:' as issue, COUNT(*) as count
FROM public.profiles p
LEFT JOIN public.school_profiles sp ON p.id = sp.id
WHERE p.role = 'school' AND sp.id IS NULL;

-- Check unpublished profiles
SELECT 'Unpublished teacher profiles:' as issue, COUNT(*) as count
FROM public.teacher_profiles WHERE is_published = false;

SELECT 'Unpublished school profiles:' as issue, COUNT(*) as count
FROM public.school_profiles WHERE is_published = false; 