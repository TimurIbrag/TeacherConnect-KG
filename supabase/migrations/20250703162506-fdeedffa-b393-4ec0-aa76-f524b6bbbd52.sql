-- Add is_published field to school_profiles table to control profile visibility
ALTER TABLE public.school_profiles 
ADD COLUMN is_published BOOLEAN DEFAULT FALSE;

-- Create index for better performance when filtering published profiles
CREATE INDEX idx_school_profiles_published ON public.school_profiles(is_published);

-- Update RLS policy to only show published profiles to public
DROP POLICY IF EXISTS "Anyone can view school profiles" ON public.school_profiles;

CREATE POLICY "Anyone can view published school profiles" 
ON public.school_profiles 
FOR SELECT 
USING (is_published = true OR auth.uid() = id);