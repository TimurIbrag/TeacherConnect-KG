-- COMPREHENSIVE FIX FOR ALL PROFILE ISSUES

-- Step 1: Drop ALL existing policies to avoid conflicts
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

-- Step 2: Drop policies from teacher_profiles and school_profiles
DROP POLICY IF EXISTS "teacher_profiles_select_policy" ON public.teacher_profiles;
DROP POLICY IF EXISTS "school_profiles_select_policy" ON public.school_profiles;

-- Step 3: Add missing columns to teacher_profiles table
DO $$ 
BEGIN
    -- Add missing columns to teacher_profiles if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'email') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'phone') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'created_at') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'last_seen_at') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN last_seen_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'is_active') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'specialization') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN specialization TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'experience_years') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN experience_years INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'education') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN education TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'languages') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN languages TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'skills') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN skills TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'is_published') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'is_profile_complete') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN is_profile_complete BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'hourly_rate') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN hourly_rate NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'availability') THEN
        ALTER TABLE public.teacher_profiles ADD COLUMN availability TEXT;
    END IF;
END $$;

-- Step 4: Add missing columns to school_profiles table
DO $$ 
BEGIN
    -- Add missing columns to school_profiles if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'email') THEN
        ALTER TABLE public.school_profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'full_name') THEN
        ALTER TABLE public.school_profiles ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'avatar_url') THEN
        ALTER TABLE public.school_profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'phone') THEN
        ALTER TABLE public.school_profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'created_at') THEN
        ALTER TABLE public.school_profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'updated_at') THEN
        ALTER TABLE public.school_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'last_seen_at') THEN
        ALTER TABLE public.school_profiles ADD COLUMN last_seen_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'is_active') THEN
        ALTER TABLE public.school_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'school_name') THEN
        ALTER TABLE public.school_profiles ADD COLUMN school_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'school_type') THEN
        ALTER TABLE public.school_profiles ADD COLUMN school_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'description') THEN
        ALTER TABLE public.school_profiles ADD COLUMN description TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'is_published') THEN
        ALTER TABLE public.school_profiles ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'school_profiles' AND column_name = 'is_profile_complete') THEN
        ALTER TABLE public.school_profiles ADD COLUMN is_profile_complete BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Step 5: Set all existing profiles as published and complete
UPDATE public.teacher_profiles SET is_published = true, is_profile_complete = true, is_active = true WHERE is_published IS NULL OR is_profile_complete IS NULL OR is_active IS NULL;
UPDATE public.school_profiles SET is_published = true, is_profile_complete = true, is_active = true WHERE is_published IS NULL OR is_profile_complete IS NULL OR is_active IS NULL;

-- Step 6: Migrate data from profiles to teacher_profiles and school_profiles
INSERT INTO public.teacher_profiles (
    id, email, full_name, avatar_url, phone, created_at, updated_at, last_seen_at, is_active,
    specialization, experience_years, education, languages, skills, is_published, is_profile_complete,
    hourly_rate, availability, bio, certificates, cv_url, resume_url, schedule_details,
    verification_documents, verification_status, view_count, location, available, date_of_birth
)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.phone,
    p.created_at,
    p.updated_at,
    p.last_seen_at,
    COALESCE(p.is_active, true) as is_active,
    p.specialization,
    p.experience_years,
    p.education,
    p.languages,
    p.skills,
    true as is_published,
    true as is_profile_complete,
    p.hourly_rate,
    p.availability,
    p.bio,
    p.certificates,
    p.cv_url,
    p.resume_url,
    p.schedule_details,
    p.verification_documents,
    p.verification_status,
    p.view_count,
    p.location,
    p.available,
    p.date_of_birth
FROM public.profiles p
WHERE p.role = 'teacher'
AND NOT EXISTS (SELECT 1 FROM public.teacher_profiles tp WHERE tp.id = p.id)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    specialization = EXCLUDED.specialization,
    experience_years = EXCLUDED.experience_years,
    education = EXCLUDED.education,
    languages = EXCLUDED.languages,
    skills = EXCLUDED.skills,
    is_published = true,
    is_profile_complete = true,
    is_active = true;

INSERT INTO public.school_profiles (
    id, email, full_name, avatar_url, phone, created_at, updated_at, last_seen_at, is_active,
    school_name, school_type, description, is_published, is_profile_complete,
    address, facilities, founded_year, housing_provided, latitude, longitude, location_verified,
    photo_urls, student_count, website_url, verification_documents, verification_status, view_count
)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.avatar_url,
    p.phone,
    p.created_at,
    p.updated_at,
    p.last_seen_at,
    COALESCE(p.is_active, true) as is_active,
    p.school_name,
    p.school_type,
    p.school_description,
    true as is_published,
    true as is_profile_complete,
    p.school_address,
    p.facilities,
    p.founded_year,
    p.housing_provided,
    p.latitude,
    p.longitude,
    p.location_verified,
    p.photo_urls,
    p.student_count,
    p.website_url,
    p.verification_documents,
    p.verification_status,
    p.view_count
FROM public.profiles p
WHERE p.role = 'school'
AND NOT EXISTS (SELECT 1 FROM public.school_profiles sp WHERE sp.id = p.id)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    phone = EXCLUDED.phone,
    school_name = EXCLUDED.school_name,
    school_type = EXCLUDED.school_type,
    description = EXCLUDED.description,
    is_published = true,
    is_profile_complete = true,
    is_active = true;

-- Step 7: Create simple, non-recursive RLS policies
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

CREATE POLICY "teacher_profiles_select_policy" ON public.teacher_profiles
    FOR SELECT USING (true);

CREATE POLICY "school_profiles_select_policy" ON public.school_profiles
    FOR SELECT USING (true);

-- Step 8: Ensure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

-- Step 9: Verify the fix
SELECT 'Profiles count' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Teacher profiles count', COUNT(*) FROM public.teacher_profiles
UNION ALL
SELECT 'School profiles count', COUNT(*) FROM public.school_profiles
UNION ALL
SELECT 'Published teachers', COUNT(*) FROM public.teacher_profiles WHERE is_published = true
UNION ALL
SELECT 'Published schools', COUNT(*) FROM public.school_profiles WHERE is_published = true; 