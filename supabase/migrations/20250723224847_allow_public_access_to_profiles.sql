-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies for profiles table
CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Also ensure teacher_profiles and school_profiles are publicly viewable
DROP POLICY IF EXISTS "Anyone can view teacher profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Anyone can view school profiles" ON public.school_profiles;

CREATE POLICY "Anyone can view teacher profiles"
  ON public.teacher_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view school profiles"
  ON public.school_profiles
  FOR SELECT
  USING (true);
