
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

export const useTeacherApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['teacher-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          vacancies (
            title,
            school_profiles (
              school_name,
              profiles (
                full_name
              )
            )
          )
        `)
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateApplication = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vacancyId, coverLetter }: { vacancyId: string; coverLetter?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const applicationData: ApplicationInsert = {
        teacher_id: user.id,
        vacancy_id: vacancyId,
        cover_letter: coverLetter,
        status: 'pending',
      };

      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Успешно',
        description: 'Отклик отправлен',
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-applications'] });
    },
    onError: (error) => {
      console.error('Error creating application:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отклик',
        variant: 'destructive',
      });
    },
  });
};
