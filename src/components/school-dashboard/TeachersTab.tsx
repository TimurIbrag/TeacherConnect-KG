
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const TeachersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Поиск учителей</h2>
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Расширенный поиск
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>РК</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Кенжеев Ринат</h3>
                <p className="text-xs text-muted-foreground">Учитель физики • 10 лет опыта</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">Высшее образование</Badge>
              <Badge variant="secondary">Кандидат наук</Badge>
            </div>
            <p className="text-sm mb-3 line-clamp-2">
              Преподаватель физики с большим стажем. Умею заинтересовать учеников предметом, 
              подготовка к олимпиадам и ОРТ.
            </p>
            <div className="flex gap-2">
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Связаться
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Профиль
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>АИ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Абдыкадырова Индира</h3>
                <p className="text-xs text-muted-foreground">Учитель истории • 8 лет опыта</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">Высшее образование</Badge>
              <Badge variant="secondary">Магистр</Badge>
            </div>
            <p className="text-sm mb-3 line-clamp-2">
              Преподаватель истории и обществознания. Специализируюсь на подготовке к выпускным 
              экзаменам и олимпиадам, применяю интерактивные методики обучения.
            </p>
            <div className="flex gap-2">
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                Связаться
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                Профиль
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeachersTab;
