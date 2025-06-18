
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageSquare, Search, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';

const TeachersTab = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createChatRoom, isAuthenticated } = useSecurePrivateChat();

  const handleStartChat = async (teacherId: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему для отправки сообщений",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!profile || profile.role !== 'school') {
      toast({
        title: "Доступ ограничен",
        description: "Только школы могут связаться с учителями",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a mock teacher user ID based on teacher ID
      const teacherUserId = `teacher_${teacherId}`;
      const chatRoomId = await createChatRoom(teacherUserId);
      
      toast({
        title: "Чат создан",
        description: "Переходим к общению с учителем",
      });
      
      navigate(`/messages/${chatRoomId}`);
    } catch (error: any) {
      console.error('Failed to start chat:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать чат",
        variant: "destructive",
      });
    }
  };

  const handleViewProfile = (teacherId: number) => {
    navigate(`/teachers/${teacherId}`);
  };

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
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>РК</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Кенжеев Ринат</h3>
                    <p className="text-xs text-muted-foreground">Учитель физики • 10 лет опыта</p>
                  </div>
                </div>
                {/* Teacher's profile picture in top right corner */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>РК</AvatarFallback>
                </Avatar>
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
              <Button size="sm" onClick={() => handleStartChat(1)}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Связаться
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleViewProfile(1)}>
                <User className="h-4 w-4 mr-1" />
                Профиль
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>АИ</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">Абдыкадырова Индира</h3>
                    <p className="text-xs text-muted-foreground">Учитель истории • 8 лет опыта</p>
                  </div>
                </div>
                {/* Teacher's profile picture in top right corner */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>АИ</AvatarFallback>
                </Avatar>
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
              <Button size="sm" onClick={() => handleStartChat(2)}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Связаться
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleViewProfile(2)}>
                <User className="h-4 w-4 mr-1" />
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
