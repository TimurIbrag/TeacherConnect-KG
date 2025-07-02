-- Remove any default photo URLs from existing school profiles that might contain the unwanted default image
UPDATE public.school_profiles 
SET photo_urls = NULL 
WHERE photo_urls IS NOT NULL 
AND (
  photo_urls::text ILIKE '%173e63e9-e4ce-4c87-908e-1d66de517d82%' OR
  photo_urls::text ILIKE '%lovable-uploads%' OR
  array_length(photo_urls, 1) = 1 AND photo_urls[1] ILIKE '%placeholder%'
);

-- Ensure new school profiles created via handle_new_user function don't get any default photos
-- Update the function to explicitly set photo_urls to NULL (empty array)
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
  
  -- If the user is a school, create a basic school profile with no default photos
  IF COALESCE((new.raw_user_meta_data->>'role')::user_role, 'teacher'::user_role) = 'school' THEN
    INSERT INTO public.school_profiles (id, school_name, photo_urls)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'full_name', 'Новая школа'),
      NULL  -- Explicitly set to NULL so no default photos appear
    );
  END IF;
  
  RETURN new;
END;
$$;