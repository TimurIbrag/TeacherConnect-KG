import { Teacher, School, Vacancy } from './types';

// Remove all default teacher profiles - teachers data will only come from Supabase and localStorage now
export const teachersData: Teacher[] = [];

// No mock school data - schools will only come from Supabase and localStorage now
export const schoolsData: School[] = [];

// No mock vacancy data - vacancies will only come from Supabase now  
export const vacanciesData: Vacancy[] = [];