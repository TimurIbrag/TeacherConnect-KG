
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Teacher {
  id: string;
  full_name: string;
  specialization: string;
  experience_years: number;
  education: string;
  languages: string[];
  skills: string[];
  location: string;
  hourly_rate: number;
  bio: string;
  avatar_url: string;
  is_published: boolean;
  is_profile_complete: boolean;
  is_active: boolean;
}

// Helper function to safely parse jsonb arrays
const parseJsonbArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const useTeachers = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['teachers', page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      console.log('🔍 Fetching teachers from teacher_profiles table...');
      
      // Fetch from teacher_profiles table (which is working)
      const { data, error, count } = await supabase
        .from('teacher_profiles')
        .select(`*`, { count: 'exact' })
        .range(from, to);

      if (error) {
        console.error('❌ Error fetching teachers:', error);
        throw error;
      }

      console.log('📊 Raw teacher data:', data);

      // Transform the data to match the expected Teacher type structure
      const transformedData = data?.map(teacher => ({
        id: teacher.id,
        full_name: teacher.id || 'Teacher ' + teacher.id, // Use id as fallback since full_name might not exist
        specialization: teacher.specialization || 'General',
        experience_years: teacher.experience_years || 0,
        education: teacher.education || '',
        languages: parseJsonbArray(teacher.languages),
        skills: teacher.skills || [],
        location: teacher.location || '',
        hourly_rate: 0, // teacher_profiles doesn't have hourly_rate
        bio: teacher.bio || '',
        avatar_url: '', // teacher_profiles doesn't have avatar_url
        is_published: true, // Assume all teacher_profiles are published
        is_profile_complete: teacher.is_profile_complete || true,
        is_active: true, // Assume all teacher_profiles are active
      })) || [];

      console.log('✅ Transformed teacher data:', transformedData);

      return {
        data: transformedData,
        count: count || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      // Transform the data
      return {
        id: data.id,
        full_name: data.id || 'Teacher ' + data.id,
        specialization: data.specialization || 'General',
        experience_years: data.experience_years || 0,
        education: data.education || '',
        languages: parseJsonbArray(data.languages),
        skills: data.skills || [],
        location: data.location || '',
        hourly_rate: 0,
        bio: data.bio || '',
        avatar_url: '',
        is_published: true,
        is_profile_complete: data.is_profile_complete || true,
        is_active: true,
      } as Teacher;
    },
    enabled: !!id,
  });
};
