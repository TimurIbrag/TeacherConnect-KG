-- Add is_published field to teacher_profiles table
ALTER TABLE public.teacher_profiles 
ADD COLUMN is_published boolean DEFAULT false;

-- Update the default value for available field to match the publishing pattern
ALTER TABLE public.teacher_profiles 
ALTER COLUMN available SET DEFAULT false;