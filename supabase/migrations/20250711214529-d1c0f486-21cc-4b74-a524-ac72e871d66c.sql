
-- Update RLS policy to allow anyone to view published teacher profiles with their basic info
DROP POLICY IF EXISTS "Anyone can view teacher profiles" ON public.teacher_profiles;

CREATE POLICY "Anyone can view published teacher profiles"
ON public.teacher_profiles
FOR SELECT
USING (is_published = true OR available = true);

-- Ensure profiles table allows public read access for basic info like name and avatar
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Anyone can view basic profile info"
ON public.profiles
FOR SELECT
USING (true);
