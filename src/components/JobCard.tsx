
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarClock, Coins, FileText } from 'lucide-react';

interface JobCardProps {
  id: number;
  title: string;
  schedule: string;
  salary: string;
  requirements: string;
  additionalInfo?: string;
  schoolName: string;
  schoolId: number;
  onApply: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  schedule,
  salary,
  requirements,
  additionalInfo,
  schoolName,
  schoolId,
  onApply,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow animate-fade-in">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{schoolName}</p>
          </div>
          <Badge>{schedule}</Badge>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            <span>{salary}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-primary" />
            <span>{schedule}</span>
          </div>
          
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-primary mt-1" />
            <div>
              <p className="font-medium">Требования:</p>
              <p className="text-sm">{requirements}</p>
            </div>
          </div>
          
          {additionalInfo && (
            <div className="text-sm mt-2">
              <p className="font-medium">Дополнительно:</p>
              <p>{additionalInfo}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t p-4 bg-muted/30">
        <Button size="sm" variant="outline" asChild>
          <a href={`/schools/${schoolId}`}>Подробнее о школе</a>
        </Button>
        <Button size="sm" onClick={onApply}>{t('button.apply')}</Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
