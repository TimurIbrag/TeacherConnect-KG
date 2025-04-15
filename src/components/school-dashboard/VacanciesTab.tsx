
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Plus, UserCheck } from 'lucide-react';

const VacanciesTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Вакансии школы</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Новая вакансия
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Учитель математики</CardTitle>
                <CardDescription>
                  Опубликована: 5 апреля 2025 • 8 просмотров • 3 отклика
                </CardDescription>
              </div>
              <Badge>Активна</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">30,000-40,000 сом</span>
            </div>
            <p className="text-sm">
              Требуется учитель математики для работы в 5-11 классах. Опыт работы от 2 лет, 
              высшее педагогическое образование.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Редактировать
              </Button>
              <Button variant="outline" size="sm">
                <UserCheck className="h-4 w-4 mr-1" />
                Отклики (3)
              </Button>
              <Button variant="outline" size="sm" className="ml-auto">
                <Eye className="h-4 w-4 mr-1" />
                Просмотр
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VacanciesTab;
