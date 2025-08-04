
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

// Helper function to generate a readable school name from ID
const generateSchoolName = (id: string, schoolName?: string): string => {
  if (schoolName) {
    return schoolName;
  }
  // Extract a short identifier from the UUID
  const shortId = id.substring(0, 8);
  return `Школа ${shortId}`;
};

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      console.log('🔍 Fetching schools from school_profiles table...');
      
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`*`);

      if (error) {
        console.error('❌ Error fetching schools:', error);
        throw error;
      }

      console.log('📊 Raw school data:', data);

      // Transform the data to match the expected School type structure
      const transformedData = data?.map(school => ({
        id: school.id,
        school_name: generateSchoolName(school.id, school.school_name),
        school_type: school.school_type || 'Общеобразовательная школа',
        description: school.description || 'Качественное образование для всех',
        address: school.address || 'Бишкек',
        facilities: school.facilities || ['Классы', 'Библиотека'],
        founded_year: school.founded_year || 2020,
        housing_provided: school.housing_provided || false,
        latitude: school.latitude || 0,
        longitude: school.longitude || 0,
        location_verified: school.location_verified || false,
        photo_urls: school.photo_urls || [],
        student_count: school.student_count || 100,
        website_url: school.website_url || '',
        is_published: school.is_published || true,
        is_profile_complete: true, // Assume all school_profiles are complete
        is_active: true, // Assume all school_profiles are active
      })) || [];

      console.log('✅ Transformed school data:', transformedData);

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
        .from('school_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform the data
      return {
        id: data.id,
        school_name: generateSchoolName(data.id, data.school_name),
        school_type: data.school_type || 'Общеобразовательная школа',
        description: data.description || 'Качественное образование для всех',
        address: data.address || 'Бишкек',
        facilities: data.facilities || ['Классы', 'Библиотека'],
        founded_year: data.founded_year || 2020,
        housing_provided: data.housing_provided || false,
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        location_verified: data.location_verified || false,
        photo_urls: data.photo_urls || [],
        student_count: data.student_count || 100,
        website_url: data.website_url || '',
        is_published: data.is_published || true,
        is_profile_complete: true,
        is_active: true,
      } as School;
    },
    enabled: !!id,
  });
};
