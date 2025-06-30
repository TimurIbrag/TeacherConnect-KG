import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useVacancyMutations } from './useVacancyMutations';

export const useVacancyHandlers = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { createVacancyMutation, deleteVacancyMutation, updateVacancyMutation } = useVacancyMutations();

  const handleVacancyCreated = async (newVacancy: any) => {
    console.log('handleVacancyCreated called with:', newVacancy);
    
    return new Promise((resolve, reject) => {
      createVacancyMutation.mutate(newVacancy, {
        onSuccess: (data) => {
          console.log('Vacancy created successfully:', data);
          resolve(data);
        },
        onError: (error) => {
          console.error('Failed to create vacancy:', error);
          reject(error);
        }
      });
    });
  };

  const handleEditVacancy = (vacancy: any) => {
    console.log('Edit vacancy clicked for:', vacancy);
    toast({
      title: t('vacancy.featureInDevelopment'),
      description: t('vacancy.editingFeature'),
    });
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
    toast({
      title: t('vacancy.featureInDevelopment'),
      description: t('vacancy.applicationsFeature'),
    });
  };

  return {
    handleVacancyCreated,
    handleEditVacancy,
    handleDeleteVacancy,
    handleToggleVacancyStatus,
    handleViewApplications,
    isCreating: createVacancyMutation.isPending,
    isDeleting: deleteVacancyMutation.isPending,
    isUpdating: updateVacancyMutation.isPending,
  };
};
