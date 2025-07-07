-- Fix Problem 2: Prevent automatic creation of role-specific profiles
-- Update handle_new_user function to only create basic profile, no role-specific profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only create basic profile, let user choose role later
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'teacher'::user_role  -- Default to teacher, will be updated when user selects role
  );
  
  -- DO NOT create role-specific profiles here anymore
  -- They will be created when user selects role in UserTypeSelectionPage
  
  RETURN new;
END;
$$;

-- Fix Problem 1: Remove any existing default photos from school profiles
UPDATE public.school_profiles 
SET photo_urls = NULL 
WHERE photo_urls IS NOT NULL 
AND (
  photo_urls::text ILIKE '%lovable-uploads%' OR
  array_length(photo_urls, 1) >= 1
);

-- Ensure all school profiles are unpublished by default
UPDATE public.school_profiles 
SET is_published = FALSE 
WHERE is_published = TRUE;