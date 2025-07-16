
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

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
        <CardTitle className="text-white">Статистика</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-white">Просмотры:</span>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1 text-white" />
            <span className="font-medium text-white">{school.views}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">Количество вакансий:</span>
          <span className="font-medium text-white">{vacancyCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">Откликов получено:</span>
          <span className="font-medium text-white">{school.applications || 0}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolStats;
