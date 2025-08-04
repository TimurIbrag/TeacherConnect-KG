-- FINAL FIX FOR REMAINING ISSUES

-- Step 1: Fix the verification_status type issue by casting it properly
-- First, let's see what the verification_status enum values are
SELECT unnest(enum_range(NULL::verification_status)) as verification_status_values;

-- Step 2: Drop ALL policies from profiles table to fix infinite recursion
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- Step 3: Temporarily disable RLS on profiles table to break the recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Create a simple, non-recursive policy for profiles
CREATE POLICY "profiles_public_select" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_auth_insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_auth_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_auth_delete" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Step 5: Re-enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Fix the data migration with proper type casting
-- Update teacher_profiles with proper verification_status casting
UPDATE public.teacher_profiles 
SET verification_status = CASE 
    WHEN verification_status::text = 'pending' THEN 'pending'::verification_status
    WHEN verification_status::text = 'verified' THEN 'verified'::verification_status
    WHEN verification_status::text = 'rejected' THEN 'rejected'::verification_status
    ELSE 'pending'::verification_status
END
WHERE verification_status IS NOT NULL;

-- Update school_profiles with proper verification_status casting
UPDATE public.school_profiles 
SET verification_status = CASE 
    WHEN verification_status::text = 'pending' THEN 'pending'::verification_status
    WHEN verification_status::text = 'verified' THEN 'verified'::verification_status
    WHEN verification_status::text = 'rejected' THEN 'rejected'::verification_status
    ELSE 'pending'::verification_status
END
WHERE verification_status IS NOT NULL;

-- Step 7: Ensure all profiles have proper data
UPDATE public.teacher_profiles 
SET 
    is_published = true,
    is_profile_complete = true,
    is_active = true,
    full_name = COALESCE(full_name, 'Teacher ' || id),
    specialization = COALESCE(specialization, 'General'),
    experience_years = COALESCE(experience_years, 0)
WHERE is_published IS NULL OR is_profile_complete IS NULL OR is_active IS NULL;

UPDATE public.school_profiles 
SET 
    is_published = true,
    is_profile_complete = true,
    is_active = true,
    school_name = COALESCE(school_name, 'School ' || id),
    school_type = COALESCE(school_type, 'General')
WHERE is_published IS NULL OR is_profile_complete IS NULL OR is_active IS NULL;

-- Step 8: Test the fix
SELECT '✅ Profiles table accessible' as test, COUNT(*) as count FROM public.profiles;

SELECT '✅ Teacher profiles with data' as test, COUNT(*) as total,
       COUNT(CASE WHEN is_published = true THEN 1 END) as published,
       COUNT(CASE WHEN is_profile_complete = true THEN 1 END) as complete
FROM public.teacher_profiles;

SELECT '✅ School profiles with data' as test, COUNT(*) as total,
       COUNT(CASE WHEN is_published = true THEN 1 END) as published,
       COUNT(CASE WHEN is_profile_complete = true THEN 1 END) as complete
FROM public.school_profiles;

-- Step 9: Show sample data to verify it's working
SELECT '📋 Sample teacher data' as test, id, full_name, specialization, experience_years, is_published, is_profile_complete
FROM public.teacher_profiles 
LIMIT 3;

SELECT '📋 Sample school data' as test, id, school_name, school_type, description, is_published, is_profile_complete
FROM public.school_profiles 
LIMIT 3; 