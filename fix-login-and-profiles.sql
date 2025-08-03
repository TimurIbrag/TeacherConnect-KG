-- COMPREHENSIVE FIX: Login and Profile Visibility Issues
-- This script will fix both authentication and profile display problems

-- Step 1: Fix all existing profiles to be visible
UPDATE public.profiles 
SET 
  is_published = TRUE,
  is_profile_complete = TRUE,
  is_active = TRUE,
  role = COALESCE(role, 'teacher')  -- Set default role for profiles with NULL role
WHERE id IS NOT NULL;

-- Step 2: Ensure all profiles have proper basic data
UPDATE public.profiles 
SET 
  full_name = COALESCE(full_name, email, 'Unknown User'),
  last_seen_at = COALESCE(last_seen_at, created_at),
  updated_at = COALESCE(updated_at, created_at)
WHERE 
  full_name IS NULL OR 
  full_name = '' OR 
  full_name = 'null';

-- Step 3: Set default values for all required fields to prevent NULL issues
UPDATE public.profiles 
SET 
  bio = COALESCE(bio, ''),
  education = COALESCE(education, ''),
  location = COALESCE(location, ''),
  specialization = COALESCE(specialization, ''),
  experience_years = COALESCE(experience_years, 0),
  skills = COALESCE(skills, ARRAY[]::text[]),
  languages = COALESCE(languages, '[]'::jsonb),
  availability = COALESCE(availability, ''),
  hourly_rate = COALESCE(hourly_rate, 0),
  school_name = COALESCE(school_name, ''),
  school_type = COALESCE(school_type, ''),
  school_address = COALESCE(school_address, ''),
  school_website = COALESCE(school_website, ''),
  school_description = COALESCE(school_description, ''),
  school_size = COALESCE(school_size, 0),
  school_levels = COALESCE(school_levels, ARRAY[]::text[]),
  facilities = COALESCE(facilities, ARRAY[]::text[]),
  founded_year = COALESCE(founded_year, 0),
  housing_provided = COALESCE(housing_provided, FALSE),
  latitude = COALESCE(latitude, 0),
  longitude = COALESCE(longitude, 0),
  location_verified = COALESCE(location_verified, FALSE),
  photo_urls = COALESCE(photo_urls, ARRAY[]::text[]),
  student_count = COALESCE(student_count, 0),
  website_url = COALESCE(website_url, ''),
  verification_status = COALESCE(verification_status, 'pending'),
  view_count = COALESCE(view_count, 0)
WHERE 
  bio IS NULL OR
  education IS NULL OR
  location IS NULL OR
  specialization IS NULL OR
  experience_years IS NULL OR
  skills IS NULL OR
  languages IS NULL OR
  availability IS NULL OR
  hourly_rate IS NULL OR
  school_name IS NULL OR
  school_type IS NULL OR
  school_address IS NULL OR
  school_website IS NULL OR
  school_description IS NULL OR
  school_size IS NULL OR
  school_levels IS NULL OR
  facilities IS NULL OR
  founded_year IS NULL OR
  housing_provided IS NULL OR
  latitude IS NULL OR
  longitude IS NULL OR
  location_verified IS NULL OR
  photo_urls IS NULL OR
  student_count IS NULL OR
  website_url IS NULL OR
  verification_status IS NULL OR
  view_count IS NULL;

-- Step 4: Drop ALL existing RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all profile reads" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Step 5: Create comprehensive RLS policies for all scenarios
-- Allow everyone to view published and active profiles (for public pages)
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (is_published = TRUE AND is_active = TRUE);

-- Allow authenticated users to view all profiles (for admin and personal access)
CREATE POLICY "Authenticated users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Allow users to view their own profile (for login and profile management)
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Allow users to insert their own profile (for new registrations)
CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Allow admin users to update any profile
CREATE POLICY "Admin can update any profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admin users to view all profiles
CREATE POLICY "Admin can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 6: Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Check the fix results
SELECT 
  'AFTER FIX - Complete Status' as info,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_profiles,
  COUNT(CASE WHEN is_published = TRUE THEN 1 END) as published_profiles,
  COUNT(CASE WHEN is_profile_complete = TRUE THEN 1 END) as complete_profiles,
  COUNT(CASE WHEN role = 'teacher' THEN 1 END) as teachers,
  COUNT(CASE WHEN role = 'school' THEN 1 END) as schools,
  COUNT(CASE WHEN role IS NULL THEN 1 END) as null_roles
FROM public.profiles;

-- Step 8: Show sample of fixed profiles
SELECT 
  'Sample Fixed Profiles' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete,
  created_at
FROM public.profiles 
ORDER BY created_at DESC
LIMIT 10;

-- Step 9: Test the exact queries that the frontend uses
SELECT 
  'Frontend Teachers Query Test' as info,
  COUNT(*) as teacher_count
FROM public.profiles 
WHERE role = 'teacher' AND is_published = TRUE AND is_active = TRUE;

SELECT 
  'Frontend Schools Query Test' as info,
  COUNT(*) as school_count
FROM public.profiles 
WHERE role = 'school' AND is_published = TRUE AND is_active = TRUE;

-- Step 10: Test login-specific queries
SELECT 
  'Login Profile Query Test' as info,
  COUNT(*) as login_profiles
FROM public.profiles 
WHERE id IS NOT NULL;

-- Step 11: Check for any remaining issues
SELECT 
  'Final Issues Check' as info,
  id,
  email,
  full_name,
  role,
  is_active,
  is_published,
  is_profile_complete
FROM public.profiles 
WHERE 
  is_active = FALSE OR
  is_published = FALSE OR
  is_profile_complete = FALSE OR
  role IS NULL OR
  full_name IS NULL OR
  full_name = '' OR
  full_name = 'null'; 