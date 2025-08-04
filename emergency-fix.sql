-- EMERGENCY FIX - SIMPLE AND DIRECT

-- Step 1: Completely disable RLS on all tables to break recursion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies to clean slate
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
DROP POLICY IF EXISTS "profiles_public_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_auth_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_auth_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_auth_delete" ON public.profiles;

DROP POLICY IF EXISTS "teacher_profiles_select_policy" ON public.teacher_profiles;
DROP POLICY IF EXISTS "school_profiles_select_policy" ON public.school_profiles;

-- Step 3: Add missing columns to teacher_profiles (simple approach)
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT true;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC;
ALTER TABLE public.teacher_profiles ADD COLUMN IF NOT EXISTS availability TEXT;

-- Step 4: Add missing columns to school_profiles (simple approach)
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.school_profiles ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT true;

-- Step 5: Set all profiles as published and complete
UPDATE public.teacher_profiles SET 
    is_published = true, 
    is_profile_complete = true, 
    is_active = true,
    full_name = COALESCE(full_name, 'Teacher ' || id),
    specialization = COALESCE(specialization, 'General'),
    experience_years = COALESCE(experience_years, 0);

UPDATE public.school_profiles SET 
    is_published = true, 
    is_profile_complete = true, 
    is_active = true,
    school_name = COALESCE(school_name, 'School ' || id),
    school_type = COALESCE(school_type, 'General');

-- Step 6: Copy data from profiles table to teacher_profiles and school_profiles (simple approach)
INSERT INTO public.teacher_profiles (id, email, full_name, specialization, experience_years, education, languages, skills, is_published, is_profile_complete, is_active)
SELECT 
    p.id,
    p.email,
    COALESCE(p.full_name, 'Teacher ' || p.id),
    COALESCE(p.specialization, 'General'),
    COALESCE(p.experience_years, 0),
    p.education,
    p.languages,
    p.skills,
    true,
    true,
    true
FROM public.profiles p
WHERE p.role = 'teacher'
AND NOT EXISTS (SELECT 1 FROM public.teacher_profiles tp WHERE tp.id = p.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.school_profiles (id, email, full_name, school_name, school_type, description, is_published, is_profile_complete, is_active)
SELECT 
    p.id,
    p.email,
    COALESCE(p.full_name, p.school_name, 'School ' || p.id),
    COALESCE(p.school_name, 'School ' || p.id),
    COALESCE(p.school_type, 'General'),
    p.school_description,
    true,
    true,
    true
FROM public.profiles p
WHERE p.role = 'school'
AND NOT EXISTS (SELECT 1 FROM public.school_profiles sp WHERE sp.id = p.id)
ON CONFLICT (id) DO NOTHING;

-- Step 7: Create simple policies (only after data is set up)
CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "teacher_profiles_public_read" ON public.teacher_profiles FOR SELECT USING (true);
CREATE POLICY "school_profiles_public_read" ON public.school_profiles FOR SELECT USING (true);

-- Step 8: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

-- Step 9: Test the fix
SELECT '✅ Profiles accessible' as test, COUNT(*) as count FROM public.profiles;
SELECT '✅ Teacher profiles accessible' as test, COUNT(*) as count FROM public.teacher_profiles;
SELECT '✅ School profiles accessible' as test, COUNT(*) as count FROM public.school_profiles; 