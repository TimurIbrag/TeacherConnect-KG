-- Update teacher_profiles.languages column to support structured language data
-- This will store language with proficiency levels as JSONB objects

ALTER TABLE teacher_profiles 
ALTER COLUMN languages TYPE JSONB USING 
CASE 
  WHEN languages IS NULL THEN NULL
  WHEN array_length(languages, 1) IS NULL THEN '[]'::JSONB
  ELSE (
    SELECT JSONB_AGG(
      JSONB_BUILD_OBJECT('language', lang, 'level', 'Intermediate')
    )
    FROM UNNEST(languages) AS lang
  )
END;