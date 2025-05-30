
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CreateVacancyDialog from './CreateVacancyDialog';
import VacancyCard from './VacancyCard';

const VacanciesTab = () => {
  const { toast } = useToast();
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Load vacancies from localStorage on component mount
  useEffect(() => {
    const savedVacancies = localStorage.getItem('schoolVacancies');
    if (savedVacancies) {
      setVacancies(JSON.parse(savedVacancies));
    }
  }, []);

  const handleVacancyCreated = (newVacancy: any) => {
    setVacancies(prev => [...prev, newVacancy]);
  };

  const handleEditVacancy = (vacancy: any) => {
    // TODO: Implement edit functionality
    toast({
      title: "Функция в разработке",
      description: "Редактирование вакансий будет доступно в следующем обновлении",
    });
  };

  const handleDeleteVacancy = (id: number) => {
    const updatedVacancies = vacancies.filter(v => v.id !== id);
    setVacancies(updatedVacancies);
    localStorage.setItem('schoolVacancies', JSON.stringify(updatedVacancies));
    
    toast({
      title: "Вакансия удалена",
      description: "Вакансия была успешно удалена",
    });
  };

  const handleViewApplications = (id: number) => {
    // TODO: Implement applications view
    toast({
      title: "Функция в разработке",
      description: "Просмотр откликов будет доступен в следующем обновлении",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Вакансии школы</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Новая вакансия
        </Button>
      </div>
      
      {vacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            У вас пока нет опубликованных вакансий
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
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
              onDelete={handleDeleteVacancy}
              onViewApplications={handleViewApplications}
            />
          ))}
        </div>
      )}

      <CreateVacancyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onVacancyCreated={handleVacancyCreated}
      />
    </div>
  );
};

export default VacanciesTab;
