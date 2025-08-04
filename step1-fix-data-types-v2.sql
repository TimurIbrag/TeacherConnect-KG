-- STEP 1: FIX DATA TYPES AND ADD MISSING COLUMNS (VERSION 2)
-- This handles mixed data types - some jsonb, some text[]

-- Step 1a: Add missing columns to school_profiles table
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT true;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;

-- Step 1b: Add missing columns to teacher_profiles table
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

-- Step 1c: Set all existing profiles as published and complete (with correct data types)
UPDATE public.teacher_profiles 
SET 
    is_published = true, 
    is_profile_complete = true, 
    is_active = true,
    full_name = COALESCE(full_name, 'Teacher ' || id),
    specialization = COALESCE(specialization, 'General'),
    experience_years = COALESCE(experience_years, 0),
    education = COALESCE(education, 'Not specified'),
    languages = COALESCE(languages, '["Russian", "Kyrgyz"]'::jsonb),
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

-- Step 1d: Verification
SELECT '=== STEP 1 COMPLETED ===' as info;
SELECT 'Teacher profiles updated' as status, COUNT(*) as count FROM public.teacher_profiles WHERE is_published = true;
SELECT 'School profiles updated' as status, COUNT(*) as count FROM public.school_profiles WHERE is_published = true; 