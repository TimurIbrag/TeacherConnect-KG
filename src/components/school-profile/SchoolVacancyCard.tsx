import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, MapPin, Clock, Calendar } from 'lucide-react';

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

interface SchoolVacancyCardProps {
  vacancy: Vacancy;
  schoolId: string;
  schoolName: string;
  onApply: (vacancyId: string) => void;
}

const SchoolVacancyCard: React.FC<SchoolVacancyCardProps> = ({ 
  vacancy, 
  schoolId, 
  schoolName, 
  onApply 
}) => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Зарплата по договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} сом`;
    if (min) return `от ${min.toLocaleString()} сом`;
    if (max) return `до ${max.toLocaleString()} сом`;
    return 'Не указана';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{vacancy.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {schoolName}
            </p>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            {vacancy.employment_type === 'full-time' ? 'Полный день' : 
             vacancy.employment_type === 'part-time' ? 'Частичная занятость' :
             vacancy.employment_type === 'contract' ? 'Контракт' : 'Временная'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {vacancy.description && (
          <p className="text-sm text-gray-600">{vacancy.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatSalary(vacancy.salary_min, vacancy.salary_max)}</span>
          </div>
          
          {vacancy.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{vacancy.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{vacancy.employment_type === 'full-time' ? 'Полный день' : 
                   vacancy.employment_type === 'part-time' ? 'Частичная занятость' :
                   vacancy.employment_type === 'contract' ? 'Контракт' : 'Временная'}</span>
          </div>
          
          {vacancy.application_deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>До {formatDate(vacancy.application_deadline)}</span>
            </div>
          )}
        </div>

        {vacancy.requirements && vacancy.requirements.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Требования:</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {vacancy.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {vacancy.benefits && vacancy.benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Дополнительно:</h4>
            <div className="flex flex-wrap gap-1">
              {vacancy.benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <Button size="sm" variant="outline" asChild>
          <Link to={`/schools/${schoolId}`}>Подробнее о школе</Link>
        </Button>
        <Button size="sm" onClick={() => onApply(vacancy.id)}>
          Откликнуться
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SchoolVacancyCard;