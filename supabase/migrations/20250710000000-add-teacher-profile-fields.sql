-- Add new fields to teacher_profiles table for enhanced teacher dashboard
ALTER TABLE teacher_profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS certificates TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS schedule_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT false;

-- Create a function to check if teacher profile is complete
CREATE OR REPLACE FUNCTION check_teacher_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all required fields are filled
  NEW.is_profile_complete = (
    NEW.specialization IS NOT NULL AND 
    NEW.specialization != '' AND
    NEW.bio IS NOT NULL AND 
    NEW.bio != '' AND
    NEW.education IS NOT NULL AND 
    NEW.education != '' AND
    NEW.experience_years IS NOT NULL AND
    NEW.location IS NOT NULL AND 
    NEW.location != ''
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update profile completeness
DROP TRIGGER IF EXISTS teacher_profile_completeness_trigger ON teacher_profiles;
CREATE TRIGGER teacher_profile_completeness_trigger
  BEFORE INSERT OR UPDATE ON teacher_profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_teacher_profile_completeness();

-- Add constraint to ensure teachers cannot publish incomplete profiles
ALTER TABLE teacher_profiles 
ADD CONSTRAINT teacher_profile_publish_check 
CHECK (
  (is_published = false) OR 
  (is_published = true AND is_profile_complete = true)
);

-- Create storage bucket for teacher documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('teacher-documents', 'teacher-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for teacher documents
CREATE POLICY "Teachers can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'teacher-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Teachers can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'teacher-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Teachers can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'teacher-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Teachers can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'teacher-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_complete ON teacher_profiles(is_profile_complete);
CREATE INDEX IF NOT EXISTS idx_teacher_profiles_published ON teacher_profiles(is_published); 