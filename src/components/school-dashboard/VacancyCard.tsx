
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Users,
  Copy,
  MapPin, 
  Calendar, 
  DollarSign,
  Clock,
  ToggleLeft,
  ToggleRight,
  GraduationCap,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface VacancyCardProps {
  vacancy: {
    id: string;
    title: string;
    description?: string;
    vacancy_type?: string;
    subject?: string;
    education_level?: string;
    employment_type?: string;
    location?: string;
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string;
    application_deadline?: string;
    is_active?: boolean;
    created_at?: string;
    contact_name?: string;
    contact_phone?: string;
    contact_email?: string;
    experience_required?: number;
    requirements?: string[];
    benefits?: string[];
    school_profiles?: {
      school_name: string;
      address?: string;
    };
  };
  onEdit: (vacancy: any) => void;
  onDelete: () => void;
  onDuplicate?: (vacancy: any) => void;
  onToggleStatus?: () => void;
  onViewApplications: () => void;
  isLoading?: boolean;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onViewApplications,
  isLoading = false,
}) => {
  const getVacancyTypeLabel = (type?: string) => {
    const types = {
      teacher: 'Учитель',
      tutor: 'Репетитор',
      assistant: 'Ассистент',
      coordinator: 'Координатор',
      other: 'Другое'
    };
    return types[type as keyof typeof types] || type || 'Учитель';
  };

  const getEducationLevelLabel = (level?: string) => {
    const levels = {
      bachelor: 'Бакалавр',
      master: 'Магистр',
      any: 'Не важно'
    };
    return levels[level as keyof typeof levels] || 'Не указано';
  };

  const getEmploymentTypeLabel = (type?: string) => {
    const types = {
      'full-time': 'Полный день',
      'part-time': 'Частичная занятость',
      'online': 'Онлайн',
      'flexible': 'Гибкий график'
    };
    return types[type as keyof typeof types] || type || 'Полный день';
  };

  const getCurrencySymbol = (currency?: string) => {
    const symbols = {
      rub: '₽',
      usd: '$',
      eur: '€'
    };
    return symbols[currency as keyof typeof symbols] || '₽';
  };

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    const symbol = getCurrencySymbol(currency);
    if (!min && !max) return 'Зарплата по договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${symbol}`;
    if (min) return `от ${min.toLocaleString()} ${symbol}`;
    if (max) return `до ${max.toLocaleString()} ${symbol}`;
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
          <div className="flex-1">
            <CardTitle className="text-lg">{vacancy.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {vacancy.school_profiles?.school_name}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{getVacancyTypeLabel(vacancy.vacancy_type)}</Badge>
              {vacancy.subject && <Badge variant="secondary">{vacancy.subject}</Badge>}
            </div>
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
            <span>{formatSalary(vacancy.salary_min, vacancy.salary_max, vacancy.salary_currency)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{getEmploymentTypeLabel(vacancy.employment_type)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span>{getEducationLevelLabel(vacancy.education_level)}</span>
          </div>
          
          {vacancy.application_deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>До {formatDate(vacancy.application_deadline)}</span>
            </div>
          )}
        </div>

        {/* Контактная информация */}
        {(vacancy.contact_name || vacancy.contact_phone || vacancy.contact_email) && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">Контакты:</h4>
            <div className="space-y-1 text-sm">
              {vacancy.contact_name && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span>{vacancy.contact_name}</span>
                </div>
              )}
              {vacancy.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{vacancy.contact_phone}</span>
                </div>
              )}
              {vacancy.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{vacancy.contact_email}</span>
                </div>
              )}
            </div>
          </div>
        )}

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
          {onDuplicate && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(vacancy)}
              disabled={isLoading}
              title="Дублировать вакансию"
            >
              <Copy className="h-4 w-4 mr-1" />
              Копировать
            </Button>
          )}
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
