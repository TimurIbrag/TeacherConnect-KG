import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CreateVacancyDialog from './CreateVacancyDialog';
import VacancyCard from './VacancyCard';

const VacanciesTab = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [duplicateVacancy, setDuplicateVacancy] = useState<any>(null);

  console.log('VacanciesTab render - user:', user?.id, 'profile:', profile?.role);

  // Fetch vacancies from Supabase
  const { data: vacancies = [], isLoading } = useQuery({
    queryKey: ['school-vacancies', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles (
            school_name,
            address
          )
        `)
        .eq('school_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vacancies:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id && profile?.role === 'school',
  });

  // Create vacancy mutation with improved error handling
  const createVacancyMutation = useMutation({
    mutationFn: async (newVacancy: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('Creating vacancy with data:', newVacancy);

      // Ensure all required fields are present and properly formatted
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

      // Validate required fields
      if (!vacancyData.title) {
        throw new Error('Название вакансии обязательно');
      }
      if (!vacancyData.contact_name) {
        throw new Error('Контактное лицо обязательно');
      }
      if (!vacancyData.contact_phone) {
        throw new Error('Телефон обязателен');
      }
      if (!vacancyData.contact_email) {
        throw new Error('Email обязателен');
      }

      console.log('Final vacancy data to insert:', vacancyData);

      const { data, error } = await supabase
        .from('vacancies')
        .insert(vacancyData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
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
      setCreateDialogOpen(false);
      setDuplicateVacancy(null);
    },
    onError: (error: any) => {
      console.error('Error creating vacancy - full error object:', error);
      
      let errorMessage = "Не удалось создать вакансию. Попробуйте снова.";
      
      // Provide more specific error messages based on the error
      if (error.message) {
        if (error.message.includes('обязательно') || error.message.includes('обязателен')) {
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

  // Delete vacancy mutation
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

  // Update vacancy status mutation
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

  const handleVacancyCreated = (newVacancy: any) => {
    console.log('handleVacancyCreated called with:', newVacancy);
    createVacancyMutation.mutate(newVacancy);
  };

  const handleEditVacancy = (vacancy: any) => {
    console.log('Edit vacancy clicked for:', vacancy);
    // TODO: Implement edit functionality
    toast({
      title: t('vacancy.featureInDevelopment'),
      description: t('vacancy.editingFeature'),
    });
  };

  const handleDuplicateVacancy = (vacancy: any) => {
    console.log('Duplicate vacancy clicked for:', vacancy);
    setDuplicateVacancy(vacancy);
    setCreateDialogOpen(true);
  };

  const handleDeleteVacancy = (id: string) => {
    console.log('Delete vacancy clicked for id:', id);
    deleteVacancyMutation.mutate(id);
  };

  const handleToggleVacancyStatus = (id: string, isActive: boolean) => {
    console.log('Toggle vacancy status for id:', id, 'to:', !isActive);
    updateVacancyMutation.mutate({
      id,
      updates: { is_active: !isActive }
    });
  };

  const handleViewApplications = (id: string) => {
    console.log('View applications clicked for id:', id);
    // TODO: Implement applications view
    toast({
      title: t('vacancy.featureInDevelopment'),
      description: t('vacancy.applicationsFeature'),
    });
  };

  const handleCreateButtonClick = () => {
    console.log('Create button clicked, opening dialog');
    setDuplicateVacancy(null);
    setCreateDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      setDuplicateVacancy(null);
    }
  };

  if (profile?.role !== 'school') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Доступ к управлению вакансиями разрешен только школам
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Мои вакансии</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Мои вакансии</h2>
        <Button onClick={handleCreateButtonClick} disabled={createVacancyMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {createVacancyMutation.isPending ? "Создание..." : "Создать вакансию"}
        </Button>
      </div>
      
      {vacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            У вас пока нет созданных вакансий
          </p>
          <Button onClick={handleCreateButtonClick} disabled={createVacancyMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Создать первую вакансию
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {vacancies.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              onEdit={handleEditVacancy}
              onDelete={() => handleDeleteVacancy(vacancy.id)}
              onDuplicate={handleDuplicateVacancy}
              onToggleStatus={() => handleToggleVacancyStatus(vacancy.id, vacancy.is_active)}
              onViewApplications={() => handleViewApplications(vacancy.id)}
              isLoading={deleteVacancyMutation.isPending || updateVacancyMutation.isPending}
            />
          ))}
        </div>
      )}

      <CreateVacancyDialog
        open={createDialogOpen}
        onOpenChange={handleDialogClose}
        onVacancyCreated={handleVacancyCreated}
        isCreating={createVacancyMutation.isPending}
        duplicateVacancy={duplicateVacancy}
      />
    </div>
  );
};

export default VacanciesTab;
