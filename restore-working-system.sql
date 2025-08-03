-- RESTORE WORKING SYSTEM
-- This script will restore the original working structure with separate tables

-- Step 1: Check if the original tables exist
SELECT 'Checking existing tables' as info;

-- Step 2: Create teacher_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    bio TEXT,
    experience_years INTEGER,
    education TEXT,
    skills TEXT[],
    languages JSONB,
    availability TEXT,
    hourly_rate INTEGER,
    location TEXT,
    specialization TEXT,
    available BOOLEAN DEFAULT TRUE,
    date_of_birth DATE,
    certificates TEXT[],
    cv_url TEXT,
    resume_url TEXT,
    schedule_details JSONB,
    is_profile_complete BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[],
    verification_status TEXT DEFAULT 'pending',
    view_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create school_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.school_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    school_name TEXT,
    school_type TEXT,
    address TEXT,
    website_url TEXT,
    description TEXT,
    school_size INTEGER,
    school_levels TEXT[],
    facilities TEXT[],
    founded_year INTEGER,
    housing_provided BOOLEAN,
    latitude NUMERIC,
    longitude NUMERIC,
    location_verified BOOLEAN DEFAULT FALSE,
    photo_urls TEXT[],
    student_count INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    verification_documents TEXT[],
    verification_status TEXT DEFAULT 'pending',
    view_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Migrate data from profiles table to separate tables
INSERT INTO public.teacher_profiles (
    id, full_name, email, bio, experience_years, education, skills, languages,
    availability, hourly_rate, location, specialization, available, date_of_birth,
    certificates, cv_url, resume_url, schedule_details, is_profile_complete,
    is_published, verification_documents, verification_status, view_count,
    avatar_url, phone, created_at, updated_at, last_seen_at
)
SELECT 
    id, full_name, email, bio, experience_years, education, skills, languages,
    available, date_of_birth, certificates, cv_url, resume_url, schedule_details,
    is_profile_complete, is_published, verification_documents, verification_status, view_count,
    avatar_url, phone, created_at, updated_at, last_seen_at
FROM public.profiles 
WHERE role = 'teacher'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.school_profiles (
    id, full_name, email, school_name, school_type, address, website_url,
    description, school_size, school_levels, facilities, founded_year,
    housing_provided, latitude, longitude, location_verified, photo_urls,
    student_count, is_published, verification_documents, verification_status,
    view_count, avatar_url, phone, created_at, updated_at, last_seen_at
)
SELECT 
    id, full_name, email, school_name, school_type, school_address, school_website,
    school_description, school_size, school_levels, facilities, founded_year,
    housing_provided, latitude, longitude, location_verified, photo_urls,
    student_count, is_published, verification_documents, verification_status,
    view_count, avatar_url, phone, created_at, updated_at, last_seen_at
FROM public.profiles 
WHERE role = 'school'
ON CONFLICT (id) DO NOTHING;

-- Step 5: Set all profiles as published and complete
UPDATE public.teacher_profiles 
SET 
    is_published = TRUE,
    is_profile_complete = TRUE
WHERE id IS NOT NULL;

UPDATE public.school_profiles 
SET 
    is_published = TRUE,
    is_profile_complete = TRUE
WHERE id IS NOT NULL;

-- Step 6: Create RLS policies for teacher_profiles
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public teacher profiles are viewable by everyone" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Users can update their own teacher profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Users can insert their own teacher profile" ON public.teacher_profiles;

CREATE POLICY "Public teacher profiles are viewable by everyone" 
    ON public.teacher_profiles 
    FOR SELECT 
    USING (is_published = TRUE);

CREATE POLICY "Users can update their own teacher profile" 
    ON public.teacher_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own teacher profile" 
    ON public.teacher_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Step 7: Create RLS policies for school_profiles
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public school profiles are viewable by everyone" ON public.school_profiles;
DROP POLICY IF EXISTS "Users can update their own school profile" ON public.school_profiles;
DROP POLICY IF EXISTS "Users can insert their own school profile" ON public.school_profiles;

CREATE POLICY "Public school profiles are viewable by everyone" 
    ON public.school_profiles 
    FOR SELECT 
    USING (is_published = TRUE);

CREATE POLICY "Users can update their own school profile" 
    ON public.school_profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own school profile" 
    ON public.school_profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Step 8: Check the results
SELECT 
    'Teacher Profiles Status' as info,
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_teachers,
    COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_teachers
FROM public.teacher_profiles;

SELECT 
    'School Profiles Status' as info,
    COUNT(*) as total_schools,
    COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_schools,
    COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_schools
FROM public.school_profiles;

-- Step 9: Show sample data
SELECT 
    'Sample Teacher Profiles' as info,
    id,
    full_name,
    email,
    is_published,
    is_profile_complete,
    created_at
FROM public.teacher_profiles 
ORDER BY created_at DESC
LIMIT 5;

SELECT 
    'Sample School Profiles' as info,
    id,
    full_name,
    school_name,
    is_published,
    is_profile_complete,
    created_at
FROM public.school_profiles 
ORDER BY created_at DESC
LIMIT 5; 