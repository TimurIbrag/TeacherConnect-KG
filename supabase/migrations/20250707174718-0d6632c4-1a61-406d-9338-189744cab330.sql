-- Fix OAuth role selection issue
-- Update handle_new_user function to NOT set a default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only create basic profile without role, let user choose role later
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    NULL  -- No default role - user will choose
  );
  
  -- DO NOT create role-specific profiles here
  -- They will be created when user selects role in UserTypeSelectionPage
  
  RETURN new;
END;
$$;

-- Also update the profiles table to allow NULL role temporarily during registration
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;