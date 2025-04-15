
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, Eye, FilePlus, MapPin, MessageSquare, Search } from 'lucide-react';

const ProfileTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Профиль школы</CardTitle>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-4 w-4" />
              Редактировать
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-md">
                <Building className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Школа-гимназия №5</h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  г. Бишкек, ул. Московская, 145
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Государственная</Badge>
              <Badge variant="secondary">Общеобразовательная</Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">О школе</h4>
              <p className="text-sm">
                Школа-гимназия №5 - одна из старейших школ Бишкека с богатыми традициями. 
                Наша миссия - дать качественное образование, помочь ученикам раскрыть свои 
                таланты и подготовить их к успешной жизни в современном мире.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Инфраструктура</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm">Компьютерный класс</span>
                </div>
                <div className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm">Спортзал</span>
                </div>
                <div className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm">Библиотека</span>
                </div>
                <div className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm">Столовая</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Просмотры профиля:</span>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">56</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Активные вакансии:</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Получено откликов:</span>
                <span className="font-medium">12</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FilePlus className="mr-2 h-4 w-4" />
                Добавить вакансию
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Поиск учителей
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Сообщения
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
