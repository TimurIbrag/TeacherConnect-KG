
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface School {
  id: string;
  school_name: string;
  school_type: string;
  description: string;
  address: string;
  facilities: string[];
  founded_year: number;
  housing_provided: boolean;
  latitude: number;
  longitude: number;
  location_verified: boolean;
  photo_urls: string[];
  student_count: number;
  website_url: string;
  is_published: boolean;
  is_profile_complete: boolean;
  is_active: boolean;
}

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`*`); // Fetch directly without join to avoid recursion

      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }

      // Transform the data to match the expected School type structure
      const transformedData = data?.map(school => ({
        id: school.id,
        school_name: school.school_name || 'School ' + school.id,
        school_type: school.school_type || 'General',
        description: school.description || '',
        address: school.address || '',
        facilities: school.facilities || [],
        founded_year: school.founded_year || 2020,
        housing_provided: school.housing_provided || false,
        latitude: school.latitude || 0,
        longitude: school.longitude || 0,
        location_verified: school.location_verified || false,
        photo_urls: school.photo_urls || [],
        student_count: school.student_count || 0,
        website_url: school.website_url || '',
        is_published: school.is_published || true,
        is_profile_complete: school.is_profile_complete || true,
        is_active: school.is_active || true,
      })) || [];

      return transformedData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
