
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye, Navigation, MessageSquare, User, Languages, Calendar as CalendarIcon, Clock, CircleDot } from 'lucide-react';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';

interface TeacherCardProps {
  id: number | string;
  name: string;
  photo: string | null;
  specialization: string;
  experience: string;
  location: string;
  ratings: number;
  views: number;
  distance?: number;
  source?: string;
  date_of_birth?: string | null;
  languages?: Array<{ language: string; level: string }>;
  schedule_details?: Record<string, any>;
  last_seen_at?: string | null;
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
  source = 'mock',
  date_of_birth,
  languages,
  schedule_details,
  last_seen_at,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createChatRoom, isAuthenticated } = useSecurePrivateChat();
  
  const getInitials = (name: string) => {
    if (!name || name === 'Преподаватель') return 'П';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Helper to calculate age from date_of_birth
  const getAge = (dateOfBirth: string | null | undefined) => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age;
  };
  // Helper to check online status
  const isOnline = (lastSeenAt: string | null | undefined) => {
    if (!lastSeenAt) return false;
    const lastSeen = new Date(lastSeenAt).getTime();
    return Date.now() - lastSeen < 2 * 60 * 1000; // 2 minutes
  };

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !profile) {
      toast({
        title: "Требуется регистрация",
        description: "Зарегистрируйтесь, чтобы отправлять сообщения преподавателям.",
        variant: "destructive",
      });
      navigate('/register');
      return;
    }

    if (profile.role !== 'school') {
      toast({
        title: "Доступ ограничен",
        description: "Только школы могут связаться с учителями",
        variant: "destructive",
      });
      return;
    }

    try {
      // Handle different teacher types
      let teacherUserId = id.toString();
      if (source === 'mock' || source === 'published' || source === 'global_published') {
        teacherUserId = `mock_teacher_${id}`;
        const teacherInfo = {
          id: teacherUserId,
          full_name: name,
          avatar_url: photo,
          role: 'teacher'
        };
        localStorage.setItem(`profile_${teacherUserId}`, JSON.stringify(teacherInfo));
      }
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

  // Always display the actual name and photo if available, no fallbacks to defaults
  const displayName = name || 'Преподаватель';
  const displayPhoto = photo || null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Main Avatar - Always show image if available */}
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={displayPhoto || undefined} alt={displayName} />
                <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              {/* Online status dot */}
              {isOnline(last_seen_at) && (
                <span className="absolute bottom-1 right-1 block w-4 h-4 rounded-full bg-green-500 border-2 border-white">
                  <CircleDot className="w-4 h-4 text-green-500" />
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">{displayName}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary">{specialization}</Badge>
                    <span className="text-sm text-muted-foreground">{experience}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{getAge(date_of_birth) ? `${getAge(date_of_birth)} лет` : 'Возраст не указан'}</span>
                    <Languages className="w-4 h-4 ml-2" />
                    <span>{Array.isArray(languages) && languages.length > 0 ? languages.map((l: any) => l.language).join(', ') : 'Языки не указаны'}</span>
                  </div>
                  {/* Available days (schedule) */}
                  {schedule_details && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {Object.entries(schedule_details)
                          .filter(([_, v]: any) => v && v.available)
                          .map(([day, v]: any) => day.charAt(0).toUpperCase() + day.slice(1))
                          .join(', ') || 'Нет предпочтений'}
                      </span>
                    </div>
                  )}
                </div>
                {/* Top-right corner avatar - Always show image if available */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={displayPhoto || undefined} alt={displayName} />
                  <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t p-4 bg-muted/30">
        <div className="flex items-center gap-3">
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
