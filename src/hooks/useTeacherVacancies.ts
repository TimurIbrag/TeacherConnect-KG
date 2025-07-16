import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';

// Teacher vacancies hooks with real-time updates
export const useTeacherVacancies = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('teacher-vacancies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_vacancies'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['teacher-vacancies'],
    queryFn: async () => {
      // First get published teacher IDs
      const { data: publishedTeachers, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('id')
        .eq('is_published', true); // Only published teachers, regardless of availability

      if (teacherError) {
        console.error('Error fetching published teachers:', teacherError);
        throw teacherError;
      }

      const publishedTeacherIds = (publishedTeachers || []).map(t => t.id);

      if (publishedTeacherIds.length === 0) {
        return []; // No published teachers
      }

      // Then get vacancies from those teachers
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .select(`
          *,
          profiles!fk_teacher_vacancies_teacher (
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .in('teacher_id', publishedTeacherIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teacher vacancies:', error);
        throw error;
      }
      
      return (data || []) as any[];
    },
  });
};

export const useMyTeacherVacancies = (teacherId: string) => {
  return useQuery({
    queryKey: ['my-teacher-vacancies', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!teacherId,
  });
};

export const useCreateTeacherVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacancyData: Database['public']['Tables']['teacher_vacancies']['Insert']) => {
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .insert(vacancyData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
    },
  });
};