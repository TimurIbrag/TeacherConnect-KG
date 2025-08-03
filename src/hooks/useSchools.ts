
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';
import { School } from './types';

export const useSchools = () => {
  const queryClient = useQueryClient();

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
        .from('profiles')
        .select('*')
        .eq('role', 'school')
        .eq('is_published', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      
      console.log('Schools fetched from profiles:', data?.length || 0);
      console.log('Raw schools data:', data);
      
      // Transform profiles data to School format
      const schools = (data || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name || '',
        email: profile.email || '',
        school_name: profile.school_name || '',
        school_type: profile.school_type || '',
        school_address: profile.school_address || '',
        school_website: profile.school_website || '',
        school_description: profile.school_description || '',
        school_size: profile.school_size || 0,
        school_levels: profile.school_levels || [],
        facilities: profile.facilities || [],
        founded_year: profile.founded_year || 0,
        housing_provided: profile.housing_provided || false,
        latitude: profile.latitude || 0,
        longitude: profile.longitude || 0,
        location_verified: profile.location_verified || false,
        photo_urls: profile.photo_urls || [],
        student_count: profile.student_count || 0,
        website_url: profile.website_url || '',
        avatar_url: profile.avatar_url || '',
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        is_active: profile.is_active ?? true,
        is_published: profile.is_published ?? true,
        verification_status: profile.verification_status || 'pending'
      }));
      
      return schools as School[];
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
