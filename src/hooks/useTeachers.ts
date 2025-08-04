
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

export const useTeachers = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ['teachers', page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Fetch from teacher_profiles table directly (no join to avoid recursion)
      const { data, error, count } = await supabase
        .from('teacher_profiles')
        .select(`*`, { count: 'exact' })
        .range(from, to);

      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }

      // Transform the data to match the expected Teacher type structure
      const transformedData = data?.map(teacher => ({
        id: teacher.id,
        full_name: teacher.full_name || 'Teacher ' + teacher.id,
        specialization: teacher.specialization || 'General',
        experience_years: teacher.experience_years || 0,
        education: teacher.education || '',
        languages: teacher.languages || [],
        skills: teacher.skills || [],
        location: teacher.location || '',
        hourly_rate: teacher.hourly_rate || 0,
        bio: teacher.bio || '',
        avatar_url: teacher.avatar_url || '',
        is_published: teacher.is_published || true,
        is_profile_complete: teacher.is_profile_complete || true,
        is_active: teacher.is_active || true,
      })) || [];

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
        .maybeSingle();

      if (error) throw error;
      return data as Teacher | null;
    },
    enabled: !!id,
  });
};
