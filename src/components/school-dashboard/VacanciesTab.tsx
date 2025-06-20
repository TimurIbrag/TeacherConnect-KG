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

  // Create vacancy mutation
  const createVacancyMutation = useMutation({
    mutationFn: async (newVacancy: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('vacancies')
        .insert({
          ...newVacancy,
          school_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['vacancies'] }); // Refresh public vacancies
      toast({
        title: t('vacancy.created'),
        description: "Вакансия была успешно опубликована",
      });
      setCreateDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating vacancy:', error);
      toast({
        title: t('common.error'),
        description: "Не удалось создать вакансию. Попробуйте снова.",
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
      queryClient.invalidateQueries({ queryKey: ['vacancies'] }); // Refresh public vacancies
      toast({
        title: t('vacancy.deleted'),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['vacancies'] }); // Refresh public vacancies
      toast({
        title: t('vacancy.updated'),
        description: "Изменения сохранены",
      });
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
          <h2 className="text-xl font-semibold">{t('vacancy.schoolVacancies')}</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('vacancy.schoolVacancies')}</h2>
        <Button onClick={handleCreateButtonClick} disabled={createVacancyMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {createVacancyMutation.isPending ? t('vacancy.creating') : t('vacancy.createNew')}
        </Button>
      </div>
      
      {vacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t('vacancy.noVacancies')}
          </p>
          <Button onClick={handleCreateButtonClick} disabled={createVacancyMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            {t('vacancy.createFirst')}
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
