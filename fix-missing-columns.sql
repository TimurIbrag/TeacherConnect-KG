-- FIX MISSING COLUMNS
-- This script will check what columns exist and add missing ones

-- Step 1: Check what columns exist in school_profiles table
SELECT 
  'School Profiles Columns' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'school_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Check what columns exist in teacher_profiles table
SELECT 
  'Teacher Profiles Columns' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'teacher_profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Add missing columns to school_profiles table
ALTER TABLE public.school_profiles 
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_documents TEXT[],
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 4: Add missing columns to teacher_profiles table
ALTER TABLE public.teacher_profiles 
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_documents TEXT[],
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 5: Set all existing profiles as published and complete
UPDATE public.school_profiles 
SET 
  is_published = TRUE,
  is_profile_complete = TRUE
WHERE id IS NOT NULL;

UPDATE public.teacher_profiles 
SET 
  is_published = TRUE,
  is_profile_complete = TRUE
WHERE id IS NOT NULL;

-- Step 6: Create RLS policies for school_profiles
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

-- Step 7: Create RLS policies for teacher_profiles
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

-- Step 9: Test the exact queries that the frontend uses
SELECT 
  'Frontend Teachers Query Test' as info,
  COUNT(*) as teacher_count
FROM public.teacher_profiles 
WHERE is_published = TRUE;

SELECT 
  'Frontend Schools Query Test' as info,
  COUNT(*) as school_count
FROM public.school_profiles 
WHERE is_published = TRUE;

-- Step 10: Show sample data
SELECT 
  'Sample Teacher Profiles' as info,
  id,
  email,
  full_name,
  is_published,
  is_profile_complete,
  created_at
FROM public.teacher_profiles 
ORDER BY created_at DESC
LIMIT 5;

SELECT 
  'Sample School Profiles' as info,
  id,
  email,
  full_name,
  school_name,
  is_published,
  is_profile_complete,
  created_at
FROM public.school_profiles 
ORDER BY created_at DESC
LIMIT 5; 