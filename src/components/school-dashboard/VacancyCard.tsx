
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Clock,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface VacancyCardProps {
  vacancy: {
    id: string;
    title: string;
    description?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    employment_type?: string;
    application_deadline?: string;
    is_active?: boolean;
    created_at?: string;
    requirements?: string[];
    benefits?: string[];
    school_profiles?: {
      school_name: string;
      address?: string;
    };
  };
  onEdit: (vacancy: any) => void;
  onDelete: () => void;
  onToggleStatus?: () => void;
  onViewApplications: () => void;
  isLoading?: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewApplications,
  isLoading = false,
}) => {
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Зарплата по договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `от ${min.toLocaleString()} ₽`;
    if (max) return `до ${max.toLocaleString()} ₽`;
    return 'Не указана';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Card className={`${vacancy.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{vacancy.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {vacancy.school_profiles?.school_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={vacancy.is_active ? 'default' : 'secondary'}>
              {vacancy.is_active ? 'Активна' : 'Неактивна'}
            </Badge>
            {onToggleStatus && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleStatus}
                disabled={isLoading}
                title={vacancy.is_active ? 'Деактивировать' : 'Активировать'}
              >
                {vacancy.is_active ? (
                  <ToggleRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {vacancy.description && (
          <p className="text-sm text-gray-600 line-clamp-3">
            {vacancy.description}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {vacancy.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{vacancy.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>{formatSalary(vacancy.salary_min, vacancy.salary_max)}</span>
          </div>
          
          {vacancy.employment_type && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{vacancy.employment_type}</span>
            </div>
          )}
          
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
            <div className="flex flex-wrap gap-1">
              {vacancy.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {vacancy.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{vacancy.requirements.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {vacancy.benefits && vacancy.benefits.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Преимущества:</h4>
            <div className="flex flex-wrap gap-1">
              {vacancy.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {vacancy.benefits.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{vacancy.benefits.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewApplications}
            disabled={isLoading}
          >
            <Users className="h-4 w-4 mr-1" />
            Отклики
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(vacancy)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-1" />
            Редактировать
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Удалить
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VacancyCard;
