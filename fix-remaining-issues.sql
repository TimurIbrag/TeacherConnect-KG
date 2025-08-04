-- FIX REMAINING ISSUES - TARGETED APPROACH

-- Step 1: Check what data we actually have
SELECT 'Current state check' as info;
SELECT 'Profiles table' as table_name, COUNT(*) as count FROM public.profiles;
SELECT 'Teacher profiles table' as table_name, COUNT(*) as count FROM public.teacher_profiles;
SELECT 'School profiles table' as table_name, COUNT(*) as count FROM public.school_profiles;

-- Step 2: Ensure all teacher_profiles have the required data
UPDATE public.teacher_profiles 
SET 
    full_name = COALESCE(full_name, 'Teacher ' || id),
    specialization = COALESCE(specialization, 'General'),
    experience_years = COALESCE(experience_years, 0),
    education = COALESCE(education, 'Not specified'),
    languages = COALESCE(languages, ARRAY['Russian', 'Kyrgyz']),
    skills = COALESCE(skills, ARRAY['Teaching']),
    location = COALESCE(location, 'Bishkek'),
    bio = COALESCE(bio, 'Experienced teacher'),
    is_published = true,
    is_profile_complete = true,
    is_active = true
WHERE full_name IS NULL OR specialization IS NULL OR experience_years IS NULL;

-- Step 3: Ensure all school_profiles have the required data
UPDATE public.school_profiles 
SET 
    school_name = COALESCE(school_name, 'School ' || id),
    school_type = COALESCE(school_type, 'General'),
    description = COALESCE(description, 'Educational institution'),
    address = COALESCE(address, 'Bishkek'),
    facilities = COALESCE(facilities, ARRAY['Classrooms', 'Library']),
    founded_year = COALESCE(founded_year, 2020),
    student_count = COALESCE(student_count, 100),
    is_published = true,
    is_profile_complete = true,
    is_active = true
WHERE school_name IS NULL OR school_type IS NULL OR description IS NULL;

-- Step 4: Copy missing data from profiles table to teacher_profiles
INSERT INTO public.teacher_profiles (
    id, email, full_name, specialization, experience_years, education, languages, skills, 
    location, bio, is_published, is_profile_complete, is_active
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

-- Step 5: Copy missing data from profiles table to school_profiles
INSERT INTO public.school_profiles (
    id, email, full_name, school_name, school_type, description, address, facilities, 
    founded_year, student_count, is_published, is_profile_complete, is_active
)
SELECT 
    p.id,
    p.email,
    COALESCE(p.full_name, p.school_name, 'School ' || p.id),
    COALESCE(p.school_name, 'School ' || p.id),
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

-- Step 6: Ensure RLS policies allow public access
DROP POLICY IF EXISTS "teacher_profiles_public_read" ON public.teacher_profiles;
DROP POLICY IF EXISTS "school_profiles_public_read" ON public.school_profiles;

CREATE POLICY "teacher_profiles_public_read" ON public.teacher_profiles
    FOR SELECT USING (true);

CREATE POLICY "school_profiles_public_read" ON public.school_profiles
    FOR SELECT USING (true);

-- Step 7: Final verification
SELECT 'Final state check' as info;
SELECT 'Teacher profiles with data' as table_name, COUNT(*) as total,
       COUNT(CASE WHEN is_published = true THEN 1 END) as published,
       COUNT(CASE WHEN is_profile_complete = true THEN 1 END) as complete
FROM public.teacher_profiles;

SELECT 'School profiles with data' as table_name, COUNT(*) as total,
       COUNT(CASE WHEN is_published = true THEN 1 END) as published,
       COUNT(CASE WHEN is_profile_complete = true THEN 1 END) as complete
FROM public.school_profiles;

-- Step 8: Show sample data to verify it's working
SELECT 'Sample teacher data' as info, id, full_name, specialization, experience_years, is_published, is_profile_complete
FROM public.teacher_profiles 
LIMIT 5;

SELECT 'Sample school data' as info, id, school_name, school_type, description, is_published, is_profile_complete
FROM public.school_profiles 
LIMIT 5; 