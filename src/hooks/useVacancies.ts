import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';
import { Vacancy } from './types';

export const useVacancies = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('vacancies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vacancies'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vacancies'] });
          queryClient.invalidateQueries({ queryKey: ['public-vacancies'] });
          queryClient.invalidateQueries({ queryKey: ['active-vacancies'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles!inner (
            *,
            profiles (*)
          )
        `)
        .eq('is_active', true)
        .eq('school_profiles.is_published', true)  // Only show vacancies from published schools
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vacancy[];
    },
  });
};

// New hook to get vacancies for the homepage
export const useActiveVacancies = (limit?: number) => {
  return useQuery({
    queryKey: ['active-vacancies', limit],
    queryFn: async () => {
      console.log('Fetching active vacancies...');
      let query = supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles!inner (
            school_name,
            address,
            profiles (
              full_name
            )
          )
        `)
        .eq('is_active', true)
        .eq('school_profiles.is_published', true)  // Only show vacancies from published schools
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching active vacancies:', error);
        throw error;
      }
      
      console.log('Active vacancies fetched:', data?.length || 0);
      return data;
    },
  });
};

// Updated hook specifically for public vacancies
export const usePublicVacancies = (limit?: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('public-vacancies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vacancies'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['public-vacancies'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['public-vacancies', limit],
    queryFn: async () => {
      let query = supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles!inner (
            school_name,
            address,
            profiles (
              full_name
            )
          )
        `)
        .eq('is_active', true)
        .eq('school_profiles.is_published', true)  // Only show vacancies from published schools
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
};

// New mutations for creating/updating data
export const useCreateVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacancyData: Database['public']['Tables']['vacancies']['Insert']) => {
      const { data, error } = await supabase
        .from('vacancies')
        .insert(vacancyData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['active-vacancies'] });
    },
  });
};