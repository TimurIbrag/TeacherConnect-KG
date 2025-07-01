import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Star } from 'lucide-react';

interface DisplaySchool {
  views: number;
  ratings: number;
  applications: number;
}

interface SchoolStatsProps {
  school: DisplaySchool;
  vacancyCount: number;
}

const SchoolStats: React.FC<SchoolStatsProps> = ({ school, vacancyCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Просмотры профиля:</span>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="font-medium">{school.views}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Количество вакансий:</span>
          <span className="font-medium">{vacancyCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Откликов получено:</span>
          <span className="font-medium">{school.applications || 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Рейтинг:</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1 text-accent fill-accent" />
            <span className="font-medium">{school.ratings}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolStats;