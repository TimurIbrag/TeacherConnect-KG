import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from 'lucide-react';

interface Stats {
  profileViews: number;
  activeVacancies: number;
  applications: number;
}

interface ProfileStatsCardProps {
  stats: Stats;
}

const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Статистика</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Просмотры:</span>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="font-medium">{stats.profileViews}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Активные вакансии:</span>
          <span className="font-medium">{stats.activeVacancies}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Получено откликов:</span>
          <span className="font-medium">{stats.applications}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStatsCard;