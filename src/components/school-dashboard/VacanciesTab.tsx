
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import CreateVacancyDialog from './CreateVacancyDialog';
import VacancyList from './VacancyList';
import { useVacancyHandlers } from '@/hooks/useVacancyHandlers';

const VacanciesTab = () => {
  const { user, profile } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [duplicateVacancy, setDuplicateVacancy] = useState<any>(null);

  console.log('VacanciesTab render - user:', user?.id, 'profile:', profile?.role);

  const {
    handleVacancyCreated,
    handleEditVacancy,
    handleDeleteVacancy,
    handleToggleVacancyStatus,
    handleViewApplications,
    isCreating,
    isDeleting,
    isUpdating,
  } = useVacancyHandlers();

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

  const handleDuplicateVacancy = (vacancy: any) => {
    console.log('Duplicate vacancy clicked for:', vacancy);
    setDuplicateVacancy(vacancy);
    setCreateDialogOpen(true);
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

  const handleVacancyCreatedWithCallback = (vacancy: any) => {
    handleVacancyCreated(vacancy);
    setCreateDialogOpen(false);
    setDuplicateVacancy(null);
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

  return (
    <>
      <VacancyList
        vacancies={vacancies}
        isLoading={isLoading}
        onCreateClick={handleCreateButtonClick}
        onEdit={handleEditVacancy}
        onDelete={handleDeleteVacancy}
        onDuplicate={handleDuplicateVacancy}
        onToggleStatus={handleToggleVacancyStatus}
        onViewApplications={handleViewApplications}
        isCreating={isCreating}
        isActionLoading={isDeleting || isUpdating}
      />

      <CreateVacancyDialog
        open={createDialogOpen}
        onOpenChange={handleDialogClose}
        onVacancyCreated={handleVacancyCreatedWithCallback}
        isCreating={isCreating}
        duplicateVacancy={duplicateVacancy}
      />
    </>
  );
};

export default VacanciesTab;
