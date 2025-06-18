
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Main Avatar */}
                <Avatar className="h-16 w-16">
                  <AvatarFallback>РК</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Кенжеев Ринат</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="secondary">Учитель физики</Badge>
                        <span className="text-sm text-muted-foreground">10 лет опыта</span>
                      </div>
                    </div>
                    
                    {/* Top-right corner avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>РК</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">Высшее образование</Badge>
                <Badge variant="secondary">Кандидат наук</Badge>
              </div>
              
              <p className="text-sm mt-3 line-clamp-2">
                Преподаватель физики с большим стажем. Умею заинтересовать учеников предметом, 
                подготовка к олимпиадам и ОРТ.
              </p>
            </div>

            {/* Footer with buttons */}
            <div className="flex justify-between items-center border-t p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm">5.0</span>
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center gap-4">
                {/* Main Avatar */}
                <Avatar className="h-16 w-16">
                  <AvatarFallback>АИ</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Абдыкадырова Индира</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="secondary">Учитель истории</Badge>
                        <span className="text-sm text-muted-foreground">8 лет опыта</span>
                      </div>
                    </div>
                    
                    {/* Top-right corner avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>АИ</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">Высшее образование</Badge>
                <Badge variant="secondary">Магистр</Badge>
              </div>
              
              <p className="text-sm mt-3 line-clamp-2">
                Преподаватель истории и обществознания. Специализируюсь на подготовке к выпускным 
                экзаменам и олимпиадам, применяю интерактивные методики обучения.
              </p>
            </div>

            {/* Footer with buttons */}
            <div className="flex justify-between items-center border-t p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm">4.9</span>
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeachersTab;
