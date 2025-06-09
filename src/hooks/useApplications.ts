
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'] & {
  vacancies?: Database['public']['Tables']['vacancies']['Row'] & {
    school_profiles?: Database['public']['Tables']['school_profiles']['Row'];
  };
};

export const useTeacherApplications = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return useQuery({
    queryKey: ['teacher-applications', user?.id],
    queryFn: async (): Promise<Application[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          vacancies!applications_vacancy_id_fkey (
            *,
            school_profiles!vacancies_school_id_fkey (
              school_name
            )
          )
        `)
        .eq('teacher_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching teacher applications:', error);
        throw error;
      }

      return (data || []) as Application[];
    },
    enabled: !!user?.id,
  });
};

export const useSchoolApplications = () => {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  return useQuery({
    queryKey: ['school-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles!applications_teacher_id_fkey (
            full_name,
            avatar_url
          ),
          vacancies!applications_vacancy_id_fkey (
            title,
            subject
          )
        `)
        .eq('vacancies.school_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching school applications:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};
