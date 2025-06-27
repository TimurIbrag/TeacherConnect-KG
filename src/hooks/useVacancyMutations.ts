
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export const useVacancyMutations = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createVacancyMutation = useMutation({
    mutationFn: async (newVacancy: any) => {
      if (!user?.id) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('Creating vacancy with data:', newVacancy);

      // Validate required fields before processing
      const requiredFields = ['title', 'contact_name', 'contact_phone', 'contact_email'];
      const missingFields = requiredFields.filter(field => !newVacancy[field]?.trim());
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        throw new Error(`Обязательные поля: ${missingFields.join(', ')}`);
      }

      const vacancyData = {
        school_id: user.id,
        title: newVacancy.title?.trim(),
        description: newVacancy.description?.trim() || null,
        vacancy_type: newVacancy.vacancy_type || 'teacher',
        subject: newVacancy.subject?.trim() || null,
        education_level: newVacancy.education_level || 'any',
        employment_type: newVacancy.employment_type || 'full-time',
        location: newVacancy.location?.trim() || null,
        salary_min: newVacancy.salary_min ? Number(newVacancy.salary_min) : null,
        salary_max: newVacancy.salary_max ? Number(newVacancy.salary_max) : null,
        salary_currency: newVacancy.salary_currency || 'rub',
        experience_required: Number(newVacancy.experience_required) || 0,
        requirements: Array.isArray(newVacancy.requirements) ? newVacancy.requirements.filter(r => r?.trim()) : [],
        benefits: Array.isArray(newVacancy.benefits) ? newVacancy.benefits.filter(b => b?.trim()) : [],
        contact_name: newVacancy.contact_name?.trim(),
        contact_phone: newVacancy.contact_phone?.trim(),
        contact_email: newVacancy.contact_email?.trim(),
        is_active: true,
        application_deadline: newVacancy.application_deadline || null,
        housing_provided: Boolean(newVacancy.housing_provided)
      };

      console.log('Final vacancy data to insert:', vacancyData);

      const { data, error } = await supabase
        .from('vacancies')
        .insert(vacancyData)
        .select(`
          *,
          school_profiles (
            school_name,
            address
          )
        `)
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Vacancy created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Vacancy creation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['school-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['public-vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['active-vacancies'] });
      toast({
        title: "Вакансия опубликована!",
        description: "Вакансия была успешно создана и автоматически опубликована на публичной странице",
      });
    },
    onError: (error: any) => {
      console.error('Error creating vacancy:', error);
      
      let errorMessage = "Не удалось создать вакансию. Попробуйте снова.";
      
      if (error.message) {
        if (error.message.includes('обязательно') || error.message.includes('обязателен') || error.message.includes('Обязательные поля')) {
          errorMessage = error.message;
        } else if (error.message.includes('duplicate key') || error.message.includes('unique')) {
          errorMessage = "Вакансия с таким названием уже существует.";
        } else if (error.message.includes('invalid input syntax')) {
          errorMessage = "Проверьте правильность заполнения полей.";
        } else if (error.message.includes('foreign key')) {
          errorMessage = "Ошибка связи с профилем школы. Убедитесь, что профиль школы создан.";
        } else if (error.message.includes('permission') || error.message.includes('policy')) {
          errorMessage = "У вас нет прав для создания вакансий.";
        } else if (error.code === 'PGRST301') {
          errorMessage = "Ошибка авторизации. Попробуйте войти в систему заново.";
        }
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const deleteVacancyMutation = useMutation({
    mutationFn: async (vacancyId: string) => {
      const { error } = await supabase
        .from('vacancies')
        .delete()
        .eq('id', vacancyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['public-vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['active-vacancies'] });
      toast({
        title: "Вакансия удалена",
        description: "Вакансия была успешно удалена",
      });
    },
    onError: (error) => {
      console.error('Error deleting vacancy:', error);
      toast({
        title: t('common.error'),
        description: "Не удалось удалить вакансию",
        variant: "destructive",
      });
    },
  });

  const updateVacancyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('vacancies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['school-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['public-vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['active-vacancies'] });
      
      const isActivating = variables.updates.is_active === true;
      const isDeactivating = variables.updates.is_active === false;
      
      if (isActivating) {
        toast({
          title: "Вакансия опубликована!",
          description: "Вакансия теперь видна на публичной странице вакансий",
        });
      } else if (isDeactivating) {
        toast({
          title: "Вакансия снята с публикации",
          description: "Вакансия больше не видна на публичной странице",
        });
      } else {
        toast({
          title: "Вакансия обновлена",
          description: "Изменения сохранены",
        });
      }
    },
    onError: (error) => {
      console.error('Error updating vacancy:', error);
      toast({
        title: t('common.error'),
        description: "Не удалось обновить вакансию",
        variant: "destructive",
      });
    },
  });

  return {
    createVacancyMutation,
    deleteVacancyMutation,
    updateVacancyMutation,
  };
};
