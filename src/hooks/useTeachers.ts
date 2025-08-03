
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
      console.log('Fetching teachers from profiles table...');
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Fetch from teacher_profiles table with profiles data
      const { data, error, count } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          profiles:profiles(*)
        `, { count: 'exact' })
        .range(from, to);

      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }
      
      console.log('Teachers fetched from profiles:', data?.length || 0);
      console.log('Raw teachers data:', data);
      
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
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'teacher')
        .maybeSingle();

      if (error) throw error;
      return data as Teacher | null;
    },
    enabled: !!id,
  });
};
