
-- Add missing fields to teacher_profiles table
ALTER TABLE public.teacher_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS certificates TEXT[],
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS schedule_details JSONB,
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;

-- Add missing field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a function to check if teacher profile is complete
CREATE OR REPLACE FUNCTION public.update_teacher_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all required fields are filled
  NEW.is_profile_complete := (
    NEW.specialization IS NOT NULL AND NEW.specialization != '' AND
    NEW.education IS NOT NULL AND NEW.education != '' AND
    NEW.experience_years IS NOT NULL AND
    NEW.location IS NOT NULL AND NEW.location != '' AND
    NEW.bio IS NOT NULL AND NEW.bio != '' AND
    NEW.date_of_birth IS NOT NULL
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update completeness status
DROP TRIGGER IF EXISTS trigger_update_teacher_profile_completeness ON public.teacher_profiles;
CREATE TRIGGER trigger_update_teacher_profile_completeness
  BEFORE INSERT OR UPDATE ON public.teacher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teacher_profile_completeness();
