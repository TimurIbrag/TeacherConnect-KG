
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { Teacher } from './types';

export const useTeachers = (page: number = 1, pageSize: number = 12) => {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
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
      
      // Fetch from profiles table where role = 'teacher' and is_published = true
      // Also include profiles that are active but might not be published yet
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'teacher')
        .eq('is_active', true)
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }
      
      console.log('Teachers fetched from profiles:', data?.length || 0);
      console.log('Raw teachers data:', data);
      
      // Transform profiles data to Teacher format
      const teachers = (data || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        experience_years: profile.experience_years || 0,
        education: profile.education || '',
        skills: profile.skills || [],
        languages: profile.languages || [],
        availability: profile.availability || '',
        hourly_rate: profile.hourly_rate || 0,
        location: profile.location || '',
        specialization: profile.specialization || '',
        avatar_url: profile.avatar_url || '',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        is_active: profile.is_active ?? true,
        is_published: profile.is_published ?? true,
        verification_status: profile.verification_status || 'pending'
      }));
      
      return { data: teachers as Teacher[], count };
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
