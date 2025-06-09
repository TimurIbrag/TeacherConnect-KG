
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type TeacherProfile = Database['public']['Tables']['teacher_profiles']['Row'];
type TeacherProfileInsert = Database['public']['Tables']['teacher_profiles']['Insert'];
type TeacherProfileUpdate = Database['public']['Tables']['teacher_profiles']['Update'];

export const useTeacherProfile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'teacher') {
      fetchTeacherProfile();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  const fetchTeacherProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setTeacherProfile(data);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить профиль преподавателя',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTeacherProfile = async (updates: TeacherProfileUpdate) => {
    if (!user) return;

    try {
      if (teacherProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('teacher_profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single();

        if (error) throw error;
        setTeacherProfile(data);
      } else {
        // Create new profile
        const insertData: TeacherProfileInsert = {
          id: user.id,
          ...updates,
        };

        const { data, error } = await supabase
          .from('teacher_profiles')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        setTeacherProfile(data);
      }

      toast({
        title: 'Успешно',
        description: 'Профиль обновлен',
      });
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    }
  };

  return {
    teacherProfile,
    loading,
    updateTeacherProfile,
    refetch: fetchTeacherProfile,
  };
};
