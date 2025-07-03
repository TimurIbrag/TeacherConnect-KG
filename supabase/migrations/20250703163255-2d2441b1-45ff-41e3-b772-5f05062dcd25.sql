-- Remove all existing default photos from school profiles
UPDATE public.school_profiles 
SET photo_urls = NULL 
WHERE photo_urls IS NOT NULL;

-- Update the handle_new_user function to ensure no photos are ever set
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'teacher'::user_role)
  );
  
  -- If the user is a school, create a basic school profile with absolutely no photos
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'teacher'::user_role) = 'school' THEN
    INSERT INTO public.school_profiles (id, school_name, photo_urls, is_published)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', 'Новая школа'),
      NULL,  -- Explicitly NULL - no default photos
      FALSE  -- Unpublished by default
    );
  END IF;
  
  RETURN new;
END;
$$;