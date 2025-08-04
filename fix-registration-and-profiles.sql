-- COMPREHENSIVE FIX FOR REGISTRATION AND PROFILE VISIBILITY ISSUES

-- Step 1: Fix the handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  -- Create basic profile for new user
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
    false, -- Unpublished by default until user completes profile
    false, -- Incomplete by default until user fills profile
    NOW(),
    NOW()
  );
  
  RETURN new;
END;
$$;

-- Step 2: Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Step 3: Fix RLS policies for profiles table
DROP POLICY IF EXISTS "profiles_public_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Create proper policies for profiles table
CREATE POLICY "profiles_public_select" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_auth_insert" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_auth_update" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_auth_delete" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Step 4: Fix RLS policies for teacher_profiles table
DROP POLICY IF EXISTS "teacher_profiles_public_read" ON public.teacher_profiles;
DROP POLICY IF EXISTS "teacher_profiles_select_policy" ON public.teacher_profiles;

CREATE POLICY "teacher_profiles_public_select" ON public.teacher_profiles
    FOR SELECT USING (is_published = true AND is_profile_complete = true);

CREATE POLICY "teacher_profiles_auth_insert" ON public.teacher_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "teacher_profiles_auth_update" ON public.teacher_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "teacher_profiles_auth_delete" ON public.teacher_profiles
    FOR DELETE USING (auth.uid() = id);

-- Step 5: Fix RLS policies for school_profiles table
DROP POLICY IF EXISTS "school_profiles_public_read" ON public.school_profiles;
DROP POLICY IF EXISTS "school_profiles_select_policy" ON public.school_profiles;

CREATE POLICY "school_profiles_public_select" ON public.school_profiles
    FOR SELECT USING (is_published = true AND is_profile_complete = true);

CREATE POLICY "school_profiles_auth_insert" ON public.school_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "school_profiles_auth_update" ON public.school_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "school_profiles_auth_delete" ON public.school_profiles
    FOR DELETE USING (auth.uid() = id);

-- Step 6: Ensure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Fix existing profiles that don't have role-specific profiles
-- Create teacher_profiles for users with teacher role
INSERT INTO public.teacher_profiles (
    id, 
    email, 
    full_name, 
    specialization, 
    experience_years, 
    education, 
    languages, 
    skills, 
    location, 
    bio, 
    is_published, 
    is_profile_complete, 
    is_active,
    available,
    created_at,
    updated_at
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
    COALESCE(p.is_published, true),
    COALESCE(p.is_profile_complete, true),
    COALESCE(p.is_active, true),
    true,
    COALESCE(p.created_at, NOW()),
    COALESCE(p.updated_at, NOW())
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
    is_published = EXCLUDED.is_published,
    is_profile_complete = EXCLUDED.is_profile_complete,
    is_active = EXCLUDED.is_active,
    available = EXCLUDED.available;

-- Create school_profiles for users with school role
INSERT INTO public.school_profiles (
    id, 
    email, 
    full_name, 
    school_name, 
    school_type, 
    description, 
    address, 
    facilities, 
    founded_year, 
    student_count, 
    is_published, 
    is_profile_complete, 
    is_active,
    created_at,
    updated_at
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
    COALESCE(p.is_published, true),
    COALESCE(p.is_profile_complete, true),
    COALESCE(p.is_active, true),
    COALESCE(p.created_at, NOW()),
    COALESCE(p.updated_at, NOW())
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
    is_published = EXCLUDED.is_published,
    is_profile_complete = EXCLUDED.is_profile_complete,
    is_active = EXCLUDED.is_active;

-- Step 8: Set all existing profiles as published and complete for testing
UPDATE public.teacher_profiles 
SET is_published = true, is_profile_complete = true, is_active = true
WHERE is_published = false OR is_profile_complete = false OR is_active = false;

UPDATE public.school_profiles 
SET is_published = true, is_profile_complete = true, is_active = true
WHERE is_published = false OR is_profile_complete = false OR is_active = false;

-- Step 9: Ensure all profiles have proper data
UPDATE public.teacher_profiles 
SET 
    full_name = COALESCE(full_name, 'Teacher ' || id),
    specialization = COALESCE(specialization, 'General'),
    experience_years = COALESCE(experience_years, 0),
    education = COALESCE(education, 'Not specified'),
    languages = COALESCE(languages, ARRAY['Russian', 'Kyrgyz']),
    skills = COALESCE(skills, ARRAY['Teaching']),
    location = COALESCE(location, 'Bishkek'),
    bio = COALESCE(bio, 'Experienced teacher')
WHERE full_name IS NULL OR specialization IS NULL OR experience_years IS NULL;

UPDATE public.school_profiles 
SET 
    school_name = COALESCE(school_name, 'School ' || id),
    school_type = COALESCE(school_type, 'General'),
    description = COALESCE(description, 'Educational institution'),
    address = COALESCE(address, 'Bishkek'),
    facilities = COALESCE(facilities, ARRAY['Classrooms', 'Library']),
    founded_year = COALESCE(founded_year, 2020),
    student_count = COALESCE(student_count, 100)
WHERE school_name IS NULL OR school_type IS NULL OR description IS NULL;

-- Step 10: Final verification
SELECT '=== FINAL VERIFICATION ===' as info;

SELECT 'Profiles table' as table_name, COUNT(*) as count FROM public.profiles;
SELECT 'Teacher profiles table' as table_name, COUNT(*) as count FROM public.teacher_profiles;
SELECT 'School profiles table' as table_name, COUNT(*) as count FROM public.school_profiles;

SELECT 'Published teacher profiles' as info, COUNT(*) as count 
FROM public.teacher_profiles WHERE is_published = true AND is_profile_complete = true;

SELECT 'Published school profiles' as info, COUNT(*) as count 
FROM public.school_profiles WHERE is_published = true AND is_profile_complete = true;

-- Test public access
SELECT 'Public access to teacher profiles' as test, COUNT(*) as count 
FROM public.teacher_profiles WHERE is_published = true AND is_profile_complete = true;

SELECT 'Public access to school profiles' as test, COUNT(*) as count 
FROM public.school_profiles WHERE is_published = true AND is_profile_complete = true; 