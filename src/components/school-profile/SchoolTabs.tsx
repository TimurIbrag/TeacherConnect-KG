import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building, Briefcase, Check, Home } from 'lucide-react';
import LocationMap from '@/components/LocationMap';
import SchoolVacancyCard from './SchoolVacancyCard';
import SchoolPhotoGallery from './SchoolPhotoGallery';

interface DisplaySchool {
  id: string | number;
  name: string;
  address: string;
  type: string;
  specialization: string;
  housing: boolean;
  about: string;
  facilities: string[];
  photos?: string[];
}

interface Vacancy {
  id: string;
  title: string;
  description?: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  application_deadline?: string;
  requirements?: string[];
  benefits?: string[];
}

interface SchoolTabsProps {
  school: DisplaySchool;
  vacancies: Vacancy[];
  isLoadingVacancies: boolean;
  onApplyToVacancy: (vacancyId: string) => void;
}

const SchoolTabs: React.FC<SchoolTabsProps> = ({ 
  school, 
  vacancies, 
  isLoadingVacancies, 
  onApplyToVacancy 
}) => {
  return (
    <Tabs defaultValue="about">
      <TabsList className="mb-6">
        <TabsTrigger value="about">О школе</TabsTrigger>
        <TabsTrigger value="vacancies">
          Вакансии
          <Badge className="ml-2 bg-primary text-primary-foreground" variant="default">
            {vacancies.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="facilities">Инфраструктура</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">О школе</h3>
          <p className="text-muted-foreground">{school.about}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Тип</h3>
            <div className="flex items-start gap-2">
              <Building className="h-5 w-5 text-primary mt-0.5" />
              <span>{school.type}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Специализация</h3>
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-primary mt-0.5" />
              <span>{school.specialization}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Местоположение</h3>
          <LocationMap address={school.address} />
        </div>
        
        {school.photos && school.photos.length > 0 && (
          <SchoolPhotoGallery photos={school.photos} schoolName={school.name} />
        )}
      </TabsContent>
      
      <TabsContent value="vacancies" className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Открытые вакансии</h3>
          {isLoadingVacancies ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Загрузка вакансий...</p>
            </div>
          ) : vacancies && vacancies.length > 0 ? (
            <div className="space-y-4">
              {vacancies.map((vacancy) => (
                <SchoolVacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  schoolId={String(school.id)}
                  schoolName={school.name}
                  onApply={onApplyToVacancy}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Нет открытых вакансий</h3>
              <p className="text-muted-foreground">
                В настоящее время школа не размещала открытых вакансий.
              </p>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="facilities" className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Инфраструктура</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {school.facilities && school.facilities.map((facility, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-md border">
                <Check className="h-4 w-4 text-primary" />
                <span>{facility}</span>
              </div>
            ))}
          </div>
        </div>
        
        {school.housing && (
          <div>
            <h3 className="text-lg font-medium mb-3">Дополнительные преимущества</h3>
            <div className="flex items-center gap-2 p-3 rounded-md border border-accent/30 bg-accent/5">
              <Home className="h-5 w-5 text-accent" />
              <span>Школа предоставляет жилье для учителей</span>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SchoolTabs;