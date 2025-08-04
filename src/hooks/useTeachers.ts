
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
      
      console.log('🔍 Fetching teachers from profiles table...');
      
      // Fetch from profiles table with role filtering
      const { data, error, count } = await supabase
        .from('profiles')
        .select(`*`, { count: 'exact' })
        .eq('role', 'teacher')
        .eq('is_published', true)
        .eq('is_profile_complete', true)
        .eq('is_active', true)
        .range(from, to);

      if (error) {
        console.error('❌ Error fetching teachers:', error);
        throw error;
      }

      console.log('📊 Raw teacher data:', data);

      // Transform the data to match the expected Teacher type structure
      const transformedData = data?.map(teacher => ({
        id: teacher.id,
        full_name: teacher.full_name || 'Teacher ' + teacher.id,
        specialization: teacher.specialization || 'General',
        experience_years: teacher.experience_years || 0,
        education: teacher.education || '',
        languages: parseJsonbArray(teacher.languages),
        skills: teacher.skills || [],
        location: teacher.location || '',
        hourly_rate: teacher.hourly_rate || 0,
        bio: teacher.bio || '',
        avatar_url: teacher.avatar_url || '',
        is_published: teacher.is_published || true,
        is_profile_complete: teacher.is_profile_complete || true,
        is_active: teacher.is_active || true,
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
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'teacher')
        .eq('is_published', true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) return null;
      
      // Transform the data
      return {
        id: data.id,
        full_name: data.full_name || 'Teacher ' + data.id,
        specialization: data.specialization || 'General',
        experience_years: data.experience_years || 0,
        education: data.education || '',
        languages: parseJsonbArray(data.languages),
        skills: data.skills || [],
        location: data.location || '',
        hourly_rate: data.hourly_rate || 0,
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        is_published: data.is_published || true,
        is_profile_complete: data.is_profile_complete || true,
        is_active: data.is_active || true,
      } as Teacher;
    },
    enabled: !!id,
  });
};
