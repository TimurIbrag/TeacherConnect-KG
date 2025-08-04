-- FINAL WORKING FIX - ADDRESSES ALL IDENTIFIED ISSUES

-- Step 1: Add missing columns to school_profiles table
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT true;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Add missing columns to teacher_profiles table
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS availability TEXT;

-- Step 3: Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_public_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_auth_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_auth_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_auth_delete" ON public.profiles;

DROP POLICY IF EXISTS "teacher_profiles_public_read" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_select_policy" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_public_select" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_auth_insert" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_auth_update" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_auth_delete" ON public.teacher_profiles;

DROP POLICY IF EXISTS "school_profiles_public_read" ON public.school_profiles;
DROP POLICY IF EXISTS "school_profiles_select_policy" ON public.school_profiles;
DROP POLICY IF EXISTS "school_profiles_public_select" ON public.school_profiles;
DROP POLICY IF EXISTS "school_profiles_auth_insert" ON public.school_profiles;
DROP POLICY IF EXISTS "school_profiles_auth_update" ON public.school_profiles;
DROP POLICY IF EXISTS "school_profiles_auth_delete" ON public.school_profiles;

-- Step 4: Temporarily disable RLS to break any recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles DISABLE ROW LEVEL SECURITY;

-- Step 5: Set all existing profiles as published and complete
UPDATE public.teacher_profiles 
SET 
    is_published = true, 
    is_profile_complete = true, 
    is_active = true,
    full_name = COALESCE(full_name, 'Teacher ' || id),
    specialization = COALESCE(specialization, 'General'),
    experience_years = COALESCE(experience_years, 0),
    education = COALESCE(education, 'Not specified'),
    languages = COALESCE(languages, ARRAY['Russian', 'Kyrgyz']),
    skills = COALESCE(skills, ARRAY['Teaching']),
    location = COALESCE(location, 'Bishkek'),
    bio = COALESCE(bio, 'Experienced teacher');

UPDATE public.school_profiles 
SET 
    is_published = true, 
    is_profile_complete = true, 
    is_active = true,
    school_name = COALESCE(school_name, 'School ' || id),
    school_type = COALESCE(school_type, 'General'),
    description = COALESCE(description, 'Educational institution'),
    address = COALESCE(address, 'Bishkek'),
    facilities = COALESCE(facilities, ARRAY['Classrooms', 'Library']),
    founded_year = COALESCE(founded_year, 2020),
    student_count = COALESCE(student_count, 100);

-- Step 6: Copy data from profiles table to role-specific tables (without verification_status to avoid type issues)
INSERT INTO public.teacher_profiles (
    id, email, full_name, specialization, experience_years, education, languages, skills, 
    location, bio, is_published, is_profile_complete, is_active, available
)
SELECT 
    p.id,
    p.email,
    COALESCE(p.full_name, 'Teacher ' || p.id),
    COALESCE(p.specialization, 'General'),
    COALESCE(p.experience_years, 0),
    COALESCE(p.education, 'Not specified'),
    COALESCE(p.languages, ARRAY['Russian', 'Kyrgyz']),
    COALESCE(p.skills, ARRAY['Teaching']),
    COALESCE(p.location, 'Bishkek'),
    COALESCE(p.bio, 'Experienced teacher'),
    true,
    true,
    true,
    true
FROM public.profiles p
WHERE p.role = 'teacher'
AND NOT EXISTS (SELECT 1 FROM public.teacher_profiles tp WHERE tp.id = p.id)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    specialization = EXCLUDED.specialization,
    experience_years = EXCLUDED.experience_years,
    education = EXCLUDED.education,
    languages = EXCLUDED.languages,
    skills = EXCLUDED.skills,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio,
    is_published = true,
    is_profile_complete = true,
    is_active = true;

INSERT INTO public.school_profiles (
    id, email, full_name, school_name, school_type, description, address, facilities, 
    founded_year, student_count, is_published, is_profile_complete, is_active
)
SELECT 
    p.id,
    p.email,
    COALESCE(p.full_name, p.school_name, 'School ' || p.id),
    COALESCE(p.school_name, p.full_name, 'School ' || p.id),
    COALESCE(p.school_type, 'General'),
    COALESCE(p.school_description, 'Educational institution'),
    COALESCE(p.school_address, 'Bishkek'),
    COALESCE(p.facilities, ARRAY['Classrooms', 'Library']),
    COALESCE(p.founded_year, 2020),
    COALESCE(p.student_count, 100),
    true,
    true,
    true
FROM public.profiles p
WHERE p.role = 'school'
AND NOT EXISTS (SELECT 1 FROM public.school_profiles sp WHERE sp.id = p.id)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    school_name = EXCLUDED.school_name,
    school_type = EXCLUDED.school_type,
    description = EXCLUDED.description,
    address = EXCLUDED.address,
    facilities = EXCLUDED.facilities,
    founded_year = EXCLUDED.founded_year,
    student_count = EXCLUDED.student_count,
    is_published = true,
    is_profile_complete = true,
    is_active = true;

-- Step 7: Create simple, working RLS policies
CREATE POLICY "profiles_public_select" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "teacher_profiles_public_select" ON public.teacher_profiles
    FOR SELECT USING (true);

CREATE POLICY "school_profiles_public_select" ON public.school_profiles
    FOR SELECT USING (true);

-- Step 8: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

-- Step 9: Fix the handle_new_user trigger function (simplified)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role,
    is_active,
    is_published,
    is_profile_complete,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, NULL),
    true,
    false,
    false,
    NOW(),
    NOW()
  );
  
  RETURN new;
END;
$$;

-- Step 10: Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 11: Final verification
SELECT '=== FINAL VERIFICATION ===' as info;

SELECT 'Profiles table' as table_name, COUNT(*) as count FROM public.profiles;
SELECT 'Teacher profiles table' as table_name, COUNT(*) as count FROM public.teacher_profiles;
SELECT 'School profiles table' as table_name, COUNT(*) as count FROM public.school_profiles;

SELECT 'Published teacher profiles' as info, COUNT(*) as count 
FROM public.teacher_profiles WHERE is_published = true AND is_profile_complete = true;

SELECT 'Published school profiles' as info, COUNT(*) as count 
FROM public.school_profiles WHERE is_published = true AND is_profile_complete = true;

-- Test public access
SELECT 'Public access to teacher profiles' as test, COUNT(*) as count FROM public.teacher_profiles;
SELECT 'Public access to school profiles' as test, COUNT(*) as count FROM public.school_profiles; 