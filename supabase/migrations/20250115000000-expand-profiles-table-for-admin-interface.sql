-- Expand profiles table to include all fields needed for admin interface
-- This migration adds fields that are currently only in teacher_profiles and school_profiles tables

-- Add teacher-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS languages JSONB,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate INTEGER,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS certificates TEXT[],
ADD COLUMN IF NOT EXISTS cv_url TEXT,
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS schedule_details JSONB,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_documents TEXT[],
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Add school-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS school_name TEXT,
ADD COLUMN IF NOT EXISTS school_type TEXT,
ADD COLUMN IF NOT EXISTS school_address TEXT,
ADD COLUMN IF NOT EXISTS school_website TEXT,
ADD COLUMN IF NOT EXISTS school_description TEXT,
ADD COLUMN IF NOT EXISTS school_size INTEGER,
ADD COLUMN IF NOT EXISTS school_levels TEXT[],
ADD COLUMN IF NOT EXISTS facilities TEXT[],
ADD COLUMN IF NOT EXISTS founded_year INTEGER,
ADD COLUMN IF NOT EXISTS housing_provided BOOLEAN,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS location_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS photo_urls TEXT[],
ADD COLUMN IF NOT EXISTS student_count INTEGER,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add is_active field for admin suspension functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create a function to update profile completeness based on role
CREATE OR REPLACE FUNCTION public.update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
  -- For teachers
  IF NEW.role = 'teacher' THEN
    NEW.is_profile_complete := (
      NEW.full_name IS NOT NULL AND NEW.full_name != '' AND
      NEW.specialization IS NOT NULL AND NEW.specialization != '' AND
      NEW.education IS NOT NULL AND NEW.education != '' AND
      NEW.experience_years IS NOT NULL AND
      NEW.location IS NOT NULL AND NEW.location != '' AND
      NEW.bio IS NOT NULL AND NEW.bio != ''
    );
  -- For schools
  ELSIF NEW.role = 'school' THEN
    NEW.is_profile_complete := (
      NEW.full_name IS NOT NULL AND NEW.full_name != '' AND
      NEW.school_name IS NOT NULL AND NEW.school_name != '' AND
      NEW.school_type IS NOT NULL AND NEW.school_type != '' AND
      NEW.school_address IS NOT NULL AND NEW.school_address != ''
    );
  ELSE
    NEW.is_profile_complete := FALSE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update completeness status
DROP TRIGGER IF EXISTS trigger_update_profile_completeness ON public.profiles;
CREATE TRIGGER trigger_update_profile_completeness
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_completeness();

-- Update RLS policies to allow admin access
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
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

-- Add policy for admin to view all profiles
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen_at ON public.profiles(last_seen_at);

-- Add comments to document the new fields
COMMENT ON COLUMN public.profiles.bio IS 'Teacher biography/description';
COMMENT ON COLUMN public.profiles.experience_years IS 'Years of teaching experience';
COMMENT ON COLUMN public.profiles.education IS 'Educational background';
COMMENT ON COLUMN public.profiles.skills IS 'Array of teacher skills';
COMMENT ON COLUMN public.profiles.languages IS 'Languages the teacher can teach';
COMMENT ON COLUMN public.profiles.availability IS 'Teacher availability schedule';
COMMENT ON COLUMN public.profiles.hourly_rate IS 'Hourly rate in USD';
COMMENT ON COLUMN public.profiles.specialization IS 'Teaching specialization';
COMMENT ON COLUMN public.profiles.school_name IS 'Name of the school';
COMMENT ON COLUMN public.profiles.school_type IS 'Type of school (public/private/international)';
COMMENT ON COLUMN public.profiles.school_address IS 'School address';
COMMENT ON COLUMN public.profiles.school_website IS 'School website URL';
COMMENT ON COLUMN public.profiles.school_description IS 'School description';
COMMENT ON COLUMN public.profiles.school_size IS 'Number of students';
COMMENT ON COLUMN public.profiles.is_active IS 'Whether the user account is active (for admin suspension)'; 