
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
      console.log('Fetching schools from profiles table...');
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`*`); // Simplified - no filters

      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      
      console.log('Schools fetched from profiles:', data?.length || 0);
      console.log('Raw schools data:', data);
      
      return data as School[];
    },
  });
};

export const useSchool = (id: string) => {
  return useQuery({
    queryKey: ['school', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'school')
        .single();

      if (error) throw error;
      return data as School;
    },
    enabled: !!id,
  });
};
