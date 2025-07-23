-- Publish all existing teacher profiles so they become visible
UPDATE public.teacher_profiles 
SET is_published = true 
WHERE is_published = false OR is_published IS NULL;

-- Also publish all existing school profiles
UPDATE public.school_profiles 
SET is_published = true 
WHERE is_published = false OR is_published IS NULL;

-- Update the RLS policy for teacher_profiles to show all profiles regardless of is_published status
DROP POLICY IF EXISTS "Anyone can view teacher profiles" ON public.teacher_profiles;

CREATE POLICY "Anyone can view teacher profiles"
  ON public.teacher_profiles
  FOR SELECT
  USING (true);

-- Update the RLS policy for school_profiles to show all profiles regardless of is_published status
DROP POLICY IF EXISTS "Anyone can view school profiles" ON public.school_profiles;

CREATE POLICY "Anyone can view school profiles"
  ON public.school_profiles
  FOR SELECT
  USING (true);
