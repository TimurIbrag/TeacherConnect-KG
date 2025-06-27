
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import VacancyCard from './VacancyCard';

interface VacancyListProps {
  vacancies: any[];
  isLoading: boolean;
  onCreateClick: () => void;
  onEdit: (vacancy: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (vacancy: any) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onViewApplications: (id: string) => void;
  isCreating: boolean;
  isActionLoading: boolean;
}

const VacancyList: React.FC<VacancyListProps> = ({
  vacancies,
  isLoading,
  onCreateClick,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onViewApplications,
  isCreating,
  isActionLoading,
}) => {
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
        <Button onClick={onCreateClick} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? "Создание..." : "Создать вакансию"}
        </Button>
      </div>
      
      {vacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            У вас пока нет созданных вакансий
          </p>
          <Button onClick={onCreateClick} disabled={isCreating}>
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
              onEdit={onEdit}
              onDelete={() => onDelete(vacancy.id)}
              onDuplicate={onDuplicate}
              onToggleStatus={() => onToggleStatus(vacancy.id, vacancy.is_active)}
              onViewApplications={() => onViewApplications(vacancy.id)}
              isLoading={isActionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VacancyList;
