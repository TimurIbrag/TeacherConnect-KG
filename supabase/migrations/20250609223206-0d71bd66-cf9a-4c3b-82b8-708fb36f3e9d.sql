
-- Drop existing policies before creating new ones to avoid conflicts
DROP POLICY IF EXISTS "Teachers can view all active teacher vacancies" ON public.teacher_vacancies;
DROP POLICY IF EXISTS "Teachers can manage their own vacancies" ON public.teacher_vacancies;

-- Add missing RLS policies for applications table
DROP POLICY IF EXISTS "Teachers can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Teachers can delete their own applications" ON public.applications;
DROP POLICY IF EXISTS "Schools can view applications for their vacancies" ON public.applications;
DROP POLICY IF EXISTS "Schools can update applications for their vacancies" ON public.applications;

CREATE POLICY "Teachers can update their own applications" 
  ON public.applications 
  FOR UPDATE 
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own applications" 
  ON public.applications 
  FOR DELETE 
  USING (auth.uid() = teacher_id);

CREATE POLICY "Schools can view applications for their vacancies" 
  ON public.applications 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.vacancies 
      WHERE vacancies.id = applications.vacancy_id 
      AND vacancies.school_id = auth.uid()
    )
  );

CREATE POLICY "Schools can update applications for their vacancies" 
  ON public.applications 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.vacancies 
      WHERE vacancies.id = applications.vacancy_id 
      AND vacancies.school_id = auth.uid()
    )
  );

-- Add specific RLS policies for teacher_vacancies
CREATE POLICY "Teachers can view all active teacher vacancies" 
  ON public.teacher_vacancies 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Teachers can insert their own vacancies" 
  ON public.teacher_vacancies 
  FOR INSERT 
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own vacancies" 
  ON public.teacher_vacancies 
  FOR UPDATE 
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own vacancies" 
  ON public.teacher_vacancies 
  FOR DELETE 
  USING (auth.uid() = teacher_id);

-- Enable RLS and add policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Enable RLS and add policies for teacher_profiles table
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view teacher profiles" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can update their own profile" ON public.teacher_profiles;
DROP POLICY IF EXISTS "Teachers can insert their own profile" ON public.teacher_profiles;

CREATE POLICY "Anyone can view teacher profiles" 
  ON public.teacher_profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Teachers can update their own profile" 
  ON public.teacher_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Teachers can insert their own profile" 
  ON public.teacher_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Enable RLS and add policies for school_profiles table
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view school profiles" ON public.school_profiles;
DROP POLICY IF EXISTS "Schools can update their own profile" ON public.school_profiles;
DROP POLICY IF EXISTS "Schools can insert their own profile" ON public.school_profiles;

CREATE POLICY "Anyone can view school profiles" 
  ON public.school_profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Schools can update their own profile" 
  ON public.school_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Schools can insert their own profile" 
  ON public.school_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Enable RLS and add policies for vacancies table
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active vacancies" ON public.vacancies;
DROP POLICY IF EXISTS "Schools can manage their own vacancies" ON public.vacancies;

CREATE POLICY "Anyone can view active vacancies" 
  ON public.vacancies 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Schools can manage their own vacancies" 
  ON public.vacancies 
  FOR ALL 
  USING (auth.uid() = school_id);

-- Enable RLS and add policies for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update their sent messages" ON public.messages;

CREATE POLICY "Users can view their own messages" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- Enable RLS and add policies for notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add foreign key constraints (skip if they already exist)
DO $$ 
BEGIN
    -- Add foreign keys only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_applications_teacher') THEN
        ALTER TABLE public.applications 
        ADD CONSTRAINT fk_applications_teacher 
        FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_applications_vacancy') THEN
        ALTER TABLE public.applications 
        ADD CONSTRAINT fk_applications_vacancy 
        FOREIGN KEY (vacancy_id) REFERENCES public.vacancies(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_messages_sender') THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT fk_messages_sender 
        FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_messages_recipient') THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT fk_messages_recipient 
        FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_messages_application') THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT fk_messages_application 
        FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_vacancies_school') THEN
        ALTER TABLE public.vacancies 
        ADD CONSTRAINT fk_vacancies_school 
        FOREIGN KEY (school_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_teacher_vacancies_teacher') THEN
        ALTER TABLE public.teacher_vacancies 
        ADD CONSTRAINT fk_teacher_vacancies_teacher 
        FOREIGN KEY (teacher_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_notifications_user') THEN
        ALTER TABLE public.notifications 
        ADD CONSTRAINT fk_notifications_user 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;
