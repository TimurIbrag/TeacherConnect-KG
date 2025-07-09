-- First create a temporary function to convert text[] to JSONB
CREATE OR REPLACE FUNCTION convert_languages_to_jsonb(languages_array text[])
RETURNS JSONB AS $$
BEGIN
  IF languages_array IS NULL OR array_length(languages_array, 1) IS NULL THEN
    RETURN '[]'::JSONB;
  END IF;
  
  RETURN (
    SELECT JSONB_AGG(
      JSONB_BUILD_OBJECT('language', lang, 'level', 'Intermediate')
    )
    FROM UNNEST(languages_array) AS lang
  );
END;
$$ LANGUAGE plpgsql;

-- Update the column type using the function
ALTER TABLE teacher_profiles 
ALTER COLUMN languages TYPE JSONB USING convert_languages_to_jsonb(languages);

-- Drop the temporary function
DROP FUNCTION convert_languages_to_jsonb(text[]);