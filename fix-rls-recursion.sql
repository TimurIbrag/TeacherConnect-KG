-- FIX RLS RECURSION AND PROFILE ACCESS ISSUES

-- Step 1: Drop all existing RLS policies that might be causing recursion
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.profiles;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.profiles;

-- Step 2: Create simple, non-recursive RLS policies for profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
    FOR DELETE USING (auth.uid() = id);

-- Step 3: Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Fix teacher_profiles table - ensure all required columns exist
DO $$ 
BEGIN
    -- Add missing columns to teacher_profiles if they don't exist
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
END $$;

-- Step 5: Fix school_profiles table - ensure all required columns exist
DO $$ 
BEGIN
    -- Add missing columns to school_profiles if they don't exist
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

-- Step 6: Set all existing profiles as published and complete
UPDATE public.teacher_profiles SET is_published = true, is_profile_complete = true WHERE is_published IS NULL OR is_profile_complete IS NULL;
UPDATE public.school_profiles SET is_published = true, is_profile_complete = true WHERE is_published IS NULL OR is_profile_complete IS NULL;

-- Step 7: Create simple RLS policies for teacher_profiles and school_profiles
DROP POLICY IF EXISTS "teacher_profiles_select_policy" ON public.teacher_profiles;
DROP POLICY IF EXISTS "school_profiles_select_policy" ON public.school_profiles;

CREATE POLICY "teacher_profiles_select_policy" ON public.teacher_profiles
    FOR SELECT USING (true);

CREATE POLICY "school_profiles_select_policy" ON public.school_profiles
    FOR SELECT USING (true);

-- Step 8: Ensure RLS is enabled on both tables
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

-- Step 9: Migrate data from profiles to teacher_profiles and school_profiles if needed
INSERT INTO public.teacher_profiles (id, email, full_name, specialization, experience_years, education, languages, skills, is_published, is_profile_complete)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.specialization,
    p.experience_years,
    p.education,
    p.languages,
    p.skills,
    true as is_published,
    true as is_profile_complete
FROM public.profiles p
WHERE p.role = 'teacher'
AND NOT EXISTS (SELECT 1 FROM public.teacher_profiles tp WHERE tp.id = p.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.school_profiles (id, email, full_name, school_name, school_type, description, is_published, is_profile_complete)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.school_name,
    p.school_type,
    p.description,
    true as is_published,
    true as is_profile_complete
FROM public.profiles p
WHERE p.role = 'school'
AND NOT EXISTS (SELECT 1 FROM public.school_profiles sp WHERE sp.id = p.id)
ON CONFLICT (id) DO NOTHING;

-- Step 10: Verify the fix
SELECT 'Profiles count' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Teacher profiles count', COUNT(*) FROM public.teacher_profiles
UNION ALL
SELECT 'School profiles count', COUNT(*) FROM public.school_profiles; 