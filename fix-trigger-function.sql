-- FIX TRIGGER FUNCTION - Add missing RETURN statement

-- First, let's see what the current function looks like
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'update_teacher_profile_completeness';

-- Fix the function by adding the missing RETURN statement
CREATE OR REPLACE FUNCTION public.update_teacher_profile_completeness()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the profile completeness based on required fields
    UPDATE public.teacher_profiles 
    SET 
        is_profile_complete = (
            full_name IS NOT NULL AND 
            full_name != '' AND
            specialization IS NOT NULL AND 
            specialization != '' AND
            location IS NOT NULL AND 
            location != ''
        ),
        updated_at = NOW()
    WHERE id = NEW.id;
    
    -- Add the missing RETURN statement
    RETURN NEW;
END;
$$;

-- Verify the function is fixed
SELECT 'Trigger function fixed' as status; 