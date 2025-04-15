
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, FileText, MessageSquare, UserCog, UserRound } from 'lucide-react';

const ApplicationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Отклики на вакансии</CardTitle>
        <CardDescription>
          Отклики учителей на размещенные вакансии
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new">
          <TabsList className="mb-4">
            <TabsTrigger value="new">Новые (5)</TabsTrigger>
            <TabsTrigger value="processed">В работе (3)</TabsTrigger>
            <TabsTrigger value="archived">Архив (2)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Каримов Азамат</h3>
                    <p className="text-xs text-muted-foreground">Учитель информатики • 6 лет опыта</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Новый</span>
                  <p className="text-xs text-muted-foreground mt-1">11 апреля, 10:24</p>
                </div>
              </div>
              <p className="text-sm mb-3">
                Вакансия: <span className="font-medium">Учитель информатики</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Просмотреть профиль
                </Button>
                <Button variant="default" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Написать
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="processed" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Аманов Тимур</h3>
                    <p className="text-xs text-muted-foreground">Учитель математики • 8 лет опыта</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Собеседование</span>
                  <p className="text-xs text-muted-foreground mt-1">15 апреля, 14:00</p>
                </div>
              </div>
              <p className="text-sm mb-3">
                Вакансия: <span className="font-medium">Учитель математики</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Профиль
                </Button>
                <Button variant="default" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Написать
                </Button>
                <Button variant="outline" size="sm">
                  <UserCog className="h-4 w-4 mr-1" />
                  Изменить статус
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="archived">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Бакиров Нурлан</h3>
                    <p className="text-xs text-muted-foreground">Учитель английского языка • 3 года опыта</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Отклонено</span>
                  <p className="text-xs text-muted-foreground mt-1">7 апреля</p>
                </div>
              </div>
              <p className="text-sm mb-3">
                Вакансия: <span className="font-medium">Учитель английского языка</span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Профиль
                </Button>
                <Button variant="outline" size="sm">
                  <FileBarChart className="h-4 w-4 mr-1" />
                  Причина отказа
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
