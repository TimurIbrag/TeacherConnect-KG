
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, UserCheck, Trash2, MoreHorizontal, Building, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VacancyCardProps {
  vacancy: {
    id: number;
    position: string;
    subject: string;
    description: string;
    salaryMin: number;
    salaryMax: number;
    schedule: string;
    experience: string;
    education: string;
    requirements: string[];
    benefits: string[];
    schoolName: string;
    schoolAddress: string;
    schoolType: string;
    schoolWebsite?: string;
    schoolInfrastructure: string[];
    status: string;
    createdAt: string;
    views: number;
    applications: number;
  };
  onEdit: (vacancy: any) => void;
  onDelete: (id: number) => void;
  onViewApplications: (id: number) => void;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onEdit,
  onDelete,
  onViewApplications
}) => {
  const formatSalary = () => {
    if (vacancy.salaryMin && vacancy.salaryMax) {
      return `${vacancy.salaryMin.toLocaleString()}-${vacancy.salaryMax.toLocaleString()} сом`;
    } else if (vacancy.salaryMin) {
      return `от ${vacancy.salaryMin.toLocaleString()} сом`;
    } else if (vacancy.salaryMax) {
      return `до ${vacancy.salaryMax.toLocaleString()} сом`;
    }
    return 'По договоренности';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {vacancy.position} • {vacancy.subject}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{vacancy.schoolName}</span>
              {vacancy.schoolAddress && (
                <>
                  <span>•</span>
                  <MapPin className="h-4 w-4" />
                  <span>{vacancy.schoolAddress}</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Опубликована: {formatDate(vacancy.createdAt)} • {vacancy.views} просмотров • {vacancy.applications} откликов
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={vacancy.status === 'active' ? 'default' : 'secondary'}>
              {vacancy.status === 'active' ? 'Активна' : 'Неактивна'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(vacancy)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewApplications(vacancy.id)}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Отклики ({vacancy.applications})
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(vacancy.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{vacancy.schedule}</Badge>
          <Badge variant="outline">{formatSalary()}</Badge>
          <Badge variant="outline">{vacancy.experience}</Badge>
          <Badge variant="secondary">{vacancy.schoolType}</Badge>
        </div>
        
        <p className="text-sm line-clamp-2">{vacancy.description}</p>
        
        {vacancy.requirements.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Требования:</p>
            <div className="flex flex-wrap gap-1">
              {vacancy.requirements.slice(0, 3).map((req, index) => (
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

        {vacancy.benefits.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Предлагаем:</p>
            <div className="flex flex-wrap gap-1">
              {vacancy.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {vacancy.benefits.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{vacancy.benefits.length - 3} еще
                </Badge>
              )}
            </div>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(vacancy)}>
            <Edit className="h-4 w-4 mr-1" />
            Редактировать
          </Button>
          <Button variant="outline" size="sm" onClick={() => onViewApplications(vacancy.id)}>
            <UserCheck className="h-4 w-4 mr-1" />
            Отклики ({vacancy.applications})
          </Button>
          <Button variant="outline" size="sm" className="ml-auto">
            <Eye className="h-4 w-4 mr-1" />
            Просмотр
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VacancyCard;
