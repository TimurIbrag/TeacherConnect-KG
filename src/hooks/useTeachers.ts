
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { Teacher } from './types';

export const useTeachers = (page: number = 1, pageSize: number = 12) => {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('teacher-profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_profiles'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['teachers', page, pageSize] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, page, pageSize]);

  return useQuery({
    queryKey: ['teachers', page, pageSize],
    queryFn: async () => {
      console.log('Fetching teachers...');
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const { data, error, count } = await supabase
        .from('teacher_profiles')
        .select(`*, profiles (*)`, { count: 'exact' })
        .range(from, to);

      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }
      
      console.log('Teachers fetched:', data?.length || 0);
      return { data: data as Teacher[], count };
    },
    placeholderData: keepPreviousData,
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`*, profiles (*)`)
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Teacher | null;
    },
    enabled: !!id,
  });
};
