
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  Copy, 
  Users,
  Building2
} from 'lucide-react';

interface VacancyCardProps {
  vacancy: any;
  onEdit: (vacancy: any) => void;
  onDelete: (id: string) => void;
  onDuplicate: (vacancy: any) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  onViewApplications: (id: string) => void;
  isLoading?: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onViewApplications,
  isLoading = false
}) => {
  const formatSalary = (min?: number, max?: number, currency = 'сом') => {
    if (!min && !max) return 'По договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
    if (min) return `от ${min.toLocaleString()} ${currency}`;
    if (max) return `до ${max.toLocaleString()} ${currency}`;
    return 'Не указана';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <Card className={`relative ${!vacancy.is_active ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{vacancy.title}</CardTitle>
              <Badge variant={vacancy.is_active ? 'default' : 'secondary'}>
                {vacancy.is_active ? 'Опубликована' : 'Черновик'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Building2 className="h-4 w-4" />
              <span>{vacancy.school_profiles?.school_name}</span>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {vacancy.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{vacancy.location}</span>
                </div>
              )}
              {(vacancy.salary_min || vacancy.salary_max) && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{formatSalary(vacancy.salary_min, vacancy.salary_max)}</span>
                </div>
              )}
              {vacancy.application_deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>До {formatDate(vacancy.application_deadline)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {vacancy.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {vacancy.description}
          </p>
        )}

        {vacancy.subject && (
          <div>
            <Badge variant="outline">{vacancy.subject}</Badge>
          </div>
        )}

        {vacancy.requirements && vacancy.requirements.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Требования:</p>
            <div className="flex flex-wrap gap-1">
              {vacancy.requirements.slice(0, 3).map((req: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {vacancy.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{vacancy.requirements.length - 3} еще
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            variant={vacancy.is_active ? "outline" : "default"}
            size="sm"
            onClick={() => onToggleStatus(vacancy.id, vacancy.is_active)}
            disabled={isLoading}
            className={vacancy.is_active ? "" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            {vacancy.is_active ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Снять с публикации
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Опубликовать вакансию
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewApplications(vacancy.id)}
            disabled={isLoading}
          >
            <Users className="h-4 w-4 mr-2" />
            Отклики
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(vacancy)}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDuplicate(vacancy)}
            disabled={isLoading}
          >
            <Copy className="h-4 w-4 mr-2" />
            Дублировать
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(vacancy.id)}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Создана: {formatDate(vacancy.created_at)}
          {vacancy.updated_at !== vacancy.created_at && (
            <span> • Обновлена: {formatDate(vacancy.updated_at)}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
