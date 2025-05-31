
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Teacher = Database['public']['Tables']['teacher_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type School = Database['public']['Tables']['school_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type Vacancy = Database['public']['Tables']['vacancies']['Row'] & {
  school_profiles: School;
};

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          profiles (*)
        `)
        .eq('available', true);

      if (error) throw error;
      return data as Teacher[];
    },
  });
};

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`
          *,
          profiles (*)
        `);

      if (error) throw error;
      return data as School[];
    },
  });
};

export const useVacancies = () => {
  return useQuery({
    queryKey: ['vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles (
            *,
            profiles (*)
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vacancy[];
    },
  });
};

export const useTeacher = (id: string) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          profiles (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Teacher;
    },
    enabled: !!id,
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
