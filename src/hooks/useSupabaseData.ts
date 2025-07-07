import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { useEffect } from 'react';

type Teacher = Database['public']['Tables']['teacher_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type School = Database['public']['Tables']['school_profiles']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

type Vacancy = Database['public']['Tables']['vacancies']['Row'] & {
  school_profiles: School;
};

type TeacherVacancy = Database['public']['Tables']['teacher_vacancies']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row'];
};

export const useTeachers = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('teacher-profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_profiles'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['teachers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select(`
          *,
          profiles (*)
        `)
        .eq('is_published', true)  // Only show published teachers
        .eq('available', true);

      if (error) throw error;
      return data as Teacher[];
    },
  });
};

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
      const { data, error } = await supabase
        .from('school_profiles')
        .select(`
          *,
          profiles (*)
        `)
        .eq('is_published', true); // Only show published schools

      if (error) throw error;
      return data as School[];
    },
  });
};

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

// New hook to get vacancies for the homepage
export const useActiveVacancies = (limit?: number) => {
  return useQuery({
    queryKey: ['active-vacancies', limit],
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

// Teacher vacancies hooks with real-time updates
export const useTeacherVacancies = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('teacher-vacancies-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_vacancies'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['teacher-vacancies'],
    queryFn: async () => {
      // First get published teacher IDs
      const { data: publishedTeachers, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('id')
        .eq('is_published', true);

      if (teacherError) {
        console.error('Error fetching published teachers:', teacherError);
        throw teacherError;
      }

      const publishedTeacherIds = (publishedTeachers || []).map(t => t.id);

      if (publishedTeacherIds.length === 0) {
        return []; // No published teachers
      }

      // Then get vacancies from those teachers
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .in('teacher_id', publishedTeacherIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teacher vacancies:', error);
        throw error;
      }
      
      return (data || []) as any[];
    },
  });
};

export const useMyTeacherVacancies = (teacherId: string) => {
  return useQuery({
    queryKey: ['my-teacher-vacancies', teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!teacherId,
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

export const useCreateTeacherVacancy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacancyData: Database['public']['Tables']['teacher_vacancies']['Insert']) => {
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .insert(vacancyData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
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
