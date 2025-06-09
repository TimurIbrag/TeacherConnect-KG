
-- Create teacher_vacancies table for teachers to post their services
CREATE TABLE public.teacher_vacancies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  hourly_rate INTEGER,
  group_rate INTEGER,
  location TEXT,
  availability TEXT[] DEFAULT '{}',
  employment_type TEXT DEFAULT 'part-time',
  experience_required INTEGER DEFAULT 0,
  languages TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.teacher_vacancies ENABLE ROW LEVEL SECURITY;

-- Teachers can view all active vacancies
CREATE POLICY "Teachers can view all active teacher vacancies" 
  ON public.teacher_vacancies 
  FOR SELECT 
  USING (is_active = true);

-- Teachers can manage their own vacancies
CREATE POLICY "Teachers can manage their own vacancies" 
  ON public.teacher_vacancies 
  FOR ALL 
  USING (auth.uid() = teacher_id);

-- Add updated_at trigger
CREATE TRIGGER teacher_vacancies_updated_at 
  BEFORE UPDATE ON public.teacher_vacancies 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_teacher_vacancies_teacher_id ON public.teacher_vacancies(teacher_id);
CREATE INDEX idx_teacher_vacancies_active ON public.teacher_vacancies(is_active);
