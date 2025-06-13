
-- Create proper chat database tables with security
CREATE TABLE public.chat_rooms (
  id TEXT NOT NULL PRIMARY KEY,
  participant_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant_a, participant_b)
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id TEXT NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on chat tables
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_rooms - users can only see rooms they participate in
CREATE POLICY "Users can view their own chat rooms" 
  ON public.chat_rooms 
  FOR SELECT 
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

CREATE POLICY "Users can create chat rooms where they are a participant" 
  ON public.chat_rooms 
  FOR INSERT 
  WITH CHECK (auth.uid() = participant_a OR auth.uid() = participant_b);

CREATE POLICY "Users can update their own chat rooms" 
  ON public.chat_rooms 
  FOR UPDATE 
  USING (auth.uid() = participant_a OR auth.uid() = participant_b);

-- RLS policies for chat_messages
CREATE POLICY "Users can view messages in their chat rooms" 
  ON public.chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_rooms 
      WHERE chat_rooms.id = chat_messages.chat_room_id 
      AND (chat_rooms.participant_a = auth.uid() OR chat_rooms.participant_b = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their chat rooms" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chat_rooms 
      WHERE chat_rooms.id = chat_messages.chat_room_id 
      AND (chat_rooms.participant_a = auth.uid() OR chat_rooms.participant_b = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages" 
  ON public.chat_messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- Add indexes for performance and security
CREATE INDEX idx_chat_rooms_participants ON public.chat_rooms(participant_a, participant_b);
CREATE INDEX idx_chat_messages_room_id ON public.chat_messages(chat_room_id);
CREATE INDEX idx_chat_messages_sender ON public.chat_messages(sender_id);

-- Add updated_at trigger for chat_rooms
CREATE TRIGGER chat_rooms_updated_at 
  BEFORE UPDATE ON public.chat_rooms 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Security function to validate chat participants (only teachers and schools can chat)
CREATE OR REPLACE FUNCTION public.validate_chat_participants()
RETURNS TRIGGER AS $$
BEGIN
  -- Check that participants have different roles (teacher <-> school only)
  IF (
    SELECT COUNT(DISTINCT role) 
    FROM public.profiles 
    WHERE id IN (NEW.participant_a, NEW.participant_b)
  ) != 2 THEN
    RAISE EXCEPTION 'Chat participants must have different roles (teacher and school)';
  END IF;
  
  -- Ensure both participants exist and have valid roles
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.participant_a AND role IN ('teacher', 'school')
  ) OR NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.participant_b AND role IN ('teacher', 'school')
  ) THEN
    RAISE EXCEPTION 'Invalid chat participants';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger
CREATE TRIGGER validate_chat_participants_trigger
  BEFORE INSERT OR UPDATE ON public.chat_rooms
  FOR EACH ROW EXECUTE FUNCTION public.validate_chat_participants();

-- Clean up duplicate RLS policies (remove conflicting ones from migration file)
DROP POLICY IF EXISTS "Teachers can view all active teacher vacancies" ON public.teacher_vacancies;
DROP POLICY IF EXISTS "Teachers can manage their own vacancies" ON public.teacher_vacancies;

-- Recreate clean teacher_vacancies policies
CREATE POLICY "Users can view active teacher vacancies" 
  ON public.teacher_vacancies 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Teachers can manage their own teacher vacancies" 
  ON public.teacher_vacancies 
  FOR ALL 
  USING (auth.uid() = teacher_id);

-- Enhanced message content validation function
CREATE OR REPLACE FUNCTION public.validate_message_content()
RETURNS TRIGGER AS $$
BEGIN
  -- Basic content validation
  IF LENGTH(TRIM(NEW.text)) = 0 THEN
    RAISE EXCEPTION 'Message content cannot be empty';
  END IF;
  
  IF LENGTH(NEW.text) > 5000 THEN
    RAISE EXCEPTION 'Message content too long (max 5000 characters)';
  END IF;
  
  -- Basic XSS prevention (remove script tags)
  NEW.text := REGEXP_REPLACE(NEW.text, '<script[^>]*>.*?</script>', '', 'gi');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply message validation trigger
CREATE TRIGGER validate_message_content_trigger
  BEFORE INSERT OR UPDATE ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.validate_message_content();
