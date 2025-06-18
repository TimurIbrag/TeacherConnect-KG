
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye, Navigation, MessageSquare, User } from 'lucide-react';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';

interface TeacherCardProps {
  id: number;
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  location: string;
  ratings: number;
  views: number;
  distance?: number;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  id,
  name,
  photo,
  specialization,
  experience,
  location,
  ratings,
  views,
  distance,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createChatRoom, isAuthenticated } = useSecurePrivateChat();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
      const teacherUserId = `teacher_${id}`;
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

  const handleViewProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/teachers/${id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Main Avatar */}
            <Avatar className="h-16 w-16">
              <AvatarImage src={photo} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary">{specialization}</Badge>
                    <span className="text-sm text-muted-foreground">{experience}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                    {distance !== undefined && (
                      <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
                        <Navigation className="w-3 h-3" />
                        {distance} км
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Top-right corner avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={photo} alt={name} />
                  <AvatarFallback>{getInitials(name)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t p-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Rating">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm">{ratings}</span>
          </div>
          <div className="flex items-center gap-1" title="Profile views">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{views}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleStartChat}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Связаться
          </Button>
          <Button variant="outline" size="sm" onClick={handleViewProfile}>
            <User className="h-4 w-4 mr-1" />
            Профиль
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeacherCard;
