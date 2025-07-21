
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view school profiles" ON public.school_profiles;
DROP POLICY IF EXISTS "Schools can manage their own profile" ON public.school_profiles;
DROP POLICY IF EXISTS "Anyone can view active vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Schools can manage their own vacancies" ON public.vacancies;

-- RLS policies for school_profiles
CREATE POLICY "Anyone can view published school profiles"
  ON public.school_profiles
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Schools can manage their own profile"
  ON public.school_profiles
  FOR ALL
  USING (auth.uid() = id);

-- RLS policies for vacancies
CREATE POLICY "Anyone can view active vacancies from published schools"
  ON public.vacancies
  FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1
      FROM public.school_profiles
      WHERE school_profiles.id = vacancies.school_id
        AND school_profiles.is_published = true
    )
  );

CREATE POLICY "Schools can manage their own vacancies"
  ON public.vacancies
  FOR ALL
  USING (auth.uid() = school_id);
