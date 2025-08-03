import { Database } from '@/integrations/supabase/types';

export type Teacher = Database['public']['Tables']['profiles']['Row'] & {
  // Additional fields that might be needed for backward compatibility
  available?: boolean;
  certificates?: string[];
  cv_url?: string;
  date_of_birth?: string;
  is_profile_complete?: boolean;
  resume_url?: string;
  schedule_details?: any;
  verification_documents?: string[];
  view_count?: number;
};

export type School = Database['public']['Tables']['profiles']['Row'] & {
  // Additional fields that might be needed for backward compatibility
  address?: string;
  description?: string;
  verification_documents?: string[];
  view_count?: number;
};

export type Vacancy = Database['public']['Tables']['vacancies']['Row'] & {
  school_profiles: School;
};

export type TeacherVacancy = Database['public']['Tables']['teacher_vacancies']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};