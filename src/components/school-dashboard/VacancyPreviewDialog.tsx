
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, DollarSign, Clock, Mail, Phone, User } from 'lucide-react';

interface VacancyPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vacancyData: any;
  onConfirmPublish: () => void;
  isPublishing: boolean;
}

const VacancyPreviewDialog: React.FC<VacancyPreviewDialogProps> = ({
  open,
  onOpenChange,
  vacancyData,
  onConfirmPublish,
  isPublishing
}) => {


  const getEmploymentTypeLabel = (type: string) => {
    const types = {
      'full-time': 'Полный день',
      'part-time': 'Частичная занятость',
      'online': 'Онлайн',
      'flexible': 'Гибкий график'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      rub: 'с',
      usd: '$'
    };
    return symbols[currency as keyof typeof symbols] || 'с';
  };

  const formatSalary = () => {
    const { salary_min, salary_max, salary_currency = 'rub' } = vacancyData;
    const symbol = getCurrencySymbol(salary_currency);
    
    if (!salary_min && !salary_max) return 'По договоренности';
    if (salary_min && salary_max) return `${salary_min.toLocaleString()} - ${salary_max.toLocaleString()} ${symbol}`;
    if (salary_min) return `от ${salary_min.toLocaleString()} ${symbol}`;
    if (salary_max) return `до ${salary_max.toLocaleString()} ${symbol}`;
    return 'Не указана';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Предварительный просмотр вакансии</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{vacancyData.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{vacancyData.subject}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{vacancyData.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>{formatSalary()}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{getEmploymentTypeLabel(vacancyData.employment_type)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Описание вакансии</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {vacancyData.description}
                </p>
              </div>

              {vacancyData.requirements && vacancyData.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Требования</h4>
                  <div className="flex flex-wrap gap-1">
                    {vacancyData.requirements.map((req: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {vacancyData.benefits && vacancyData.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Преимущества</h4>
                  <div className="flex flex-wrap gap-1">
                    {vacancyData.benefits.map((benefit: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Контактная информация</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{vacancyData.contact_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{vacancyData.contact_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{vacancyData.contact_email}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Вернуться к редактированию
            </Button>
            <Button onClick={onConfirmPublish} disabled={isPublishing}>
              {isPublishing ? 'Публикуем...' : 'Опубликовать вакансию'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyPreviewDialog;
