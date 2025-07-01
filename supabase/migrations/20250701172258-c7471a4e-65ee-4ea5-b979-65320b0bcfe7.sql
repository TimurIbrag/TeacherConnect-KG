-- Add missing contact fields and salary currency to vacancies table
ALTER TABLE public.vacancies 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS salary_currency TEXT DEFAULT 'rub';