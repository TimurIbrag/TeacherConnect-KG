import { Database } from '@/integrations/supabase/types';

export type Teacher = Database['public']['Tables']['teacher_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export type School = Database['public']['Tables']['school_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export type Vacancy = Database['public']['Tables']['vacancies']['Row'] & {
  school_profiles: School;
};

export type TeacherVacancy = Database['public']['Tables']['teacher_vacancies']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};