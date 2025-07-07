import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';
import { School } from './types';

export const useSchools = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('school-profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'school_profiles'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['schools'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`
          *,
          profiles (*)
        `)
        .eq('is_published', true); // Only show published schools

      if (error) throw error;
      return data as School[];
    },
  });
};

export const useSchool = (id: string) => {
  return useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`
          *,
          profiles (*),
          vacancies (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as School & { vacancies: Database['public']['Tables']['vacancies']['Row'][] };
    },
    enabled: !!id,
  });
};