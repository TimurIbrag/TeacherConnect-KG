
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeacher } from '@/hooks/useTeachers';
// Removed mock data import - using only Supabase data
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  MessageSquare,
  Star,
  Languages,
  DollarSign,
  Building,
  Award,
  Eye,
  FileText,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';

const TeacherProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createChatRoom, isAuthenticated } = useSecurePrivateChat();
  
  const teacherId = id || '';
  
  // Try to get teacher from Supabase first
  const { data: supabaseTeacher, isLoading: isLoadingSupabase } = useTeacher(teacherId);
  
  // Transform Supabase teacher data to display format
  const teacher = supabaseTeacher ? {
    id: supabaseTeacher.id,
    name: supabaseTeacher.full_name || 'Преподаватель',
    photo: supabaseTeacher.avatar_url || null,
    specialization: supabaseTeacher.specialization || 'Специализация не указана',
    experience: `${supabaseTeacher.experience_years || 0} лет`,
    location: supabaseTeacher.location || 'Местоположение не указано',
    ratings: 5.0,
    views: 0,
    about: supabaseTeacher.bio || 'Информация о себе не указана',
    education: supabaseTeacher.education || 'Образование не указано',
    languages: Array.isArray(supabaseTeacher.languages) ? supabaseTeacher.languages : 
      (supabaseTeacher.languages ? [supabaseTeacher.languages] : ['Кыргызский', 'Русский']),
    achievements: 'Верифицированный преподаватель',
    preferredSchedule: 'Полный день',
    desiredSalary: '25,000 - 30,000 сом',
    preferredDistricts: [supabaseTeacher.location || 'Бишкек'],
    applications: 0,
    source: 'supabase'
  } : null;
  
  console.log('Found teacher:', teacher);
  
  if (isLoadingSupabase) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Загрузка профиля...</p>
      </div>
    );
  }
  
  if (!teacher) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Учитель не найден</h1>
        <p className="mb-6">Пользователь с указанным ID не существует.</p>
        <p className="text-sm text-muted-foreground mb-6">ID: {teacherId}</p>
        <Button asChild>
          <Link to="/teachers">Вернуться к списку учителей</Link>
        </Button>
      </div>
    );
  }
  
  const handleStartChat = async () => {
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
      // For mock or published teachers, we need to create a mock teacher profile in Supabase
      let teacherUserId = teacher.id;
      
      // If this is a mock teacher (numeric ID), we need to handle it differently
      if (teacher.source === 'mock' || teacher.source === 'published' || teacher.source === 'global_published') {
        // Create a deterministic user ID for mock teachers
        teacherUserId = `mock_teacher_${teacher.id}`;
        
        // Store teacher info in localStorage for the chat system
        const teacherInfo = {
          id: teacherUserId,
          full_name: teacher.name,
          avatar_url: teacher.photo,
          role: 'teacher'
        };
        localStorage.setItem(`profile_${teacherUserId}`, JSON.stringify(teacherInfo));
      }
      
      console.log('Creating chat with teacher ID:', teacherUserId);
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
  
  const getInitials = (name: string) => {
    if (!name || name === 'Преподаватель') return 'П';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Always use the actual teacher data without fallbacks
  const displayName = teacher.name || 'Преподаватель';
  const displayPhoto = teacher.photo || null;
  
  // In the teacher object, add age calculation
  const getAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return null;
    const dob = new Date(dateOfBirth);
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age;
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={displayPhoto || undefined} alt={displayName} />
                    <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{displayName}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{teacher.specialization}</span>
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{teacher.experience}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:self-start">
                  {/* Show message button only for authenticated school users */}
                  {isAuthenticated && profile?.role === 'school' && (
                    <Button onClick={handleStartChat}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {t('button.message')}
                    </Button>
                  )}
                  {/* Show login prompt for non-authenticated users */}
                  {!isAuthenticated && (
                    <Button variant="outline" onClick={() => navigate('/login')}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Войти для связи
                    </Button>
                  )}
                  {/* Show access restriction for teachers */}
                  {isAuthenticated && profile?.role === 'teacher' && (
                    <Button variant="outline" disabled>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Недоступно
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-6">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">О себе</TabsTrigger>
                  <TabsTrigger value="experience">Опыт</TabsTrigger>
                  <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">О себе</h3>
                    <p className="text-muted-foreground">{teacher.about}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Образование</h3>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                        <span>{teacher.education}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Языки</h3>
                      <div className="flex items-start gap-2">
                        <Languages className="h-5 w-5 text-primary mt-0.5" />
                        <span>{teacher.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Достижения</h3>
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-primary mt-0.5" />
                      <span>{teacher.achievements}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Опыт работы</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium">Общий стаж:</span>
                      <span>{teacher.experience}</span>
                    </div>
                    <p className="text-muted-foreground">
                      {teacher.about}
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">График работы</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{teacher.preferredSchedule}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Желаемая зарплата</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span>{teacher.desiredSalary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Предпочтительные районы</h3>
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 text-primary mt-0.5" />
                      <span>{teacher.preferredDistricts.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Местоположение</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{teacher.location}</span>
                    </div>
                    <div className="bg-muted h-48 rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">Карта местоположения</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Stats & Info */}
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
                  <span className="font-medium">{teacher.views}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Отклики на вакансии:</span>
                <span className="font-medium">{teacher.applications}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Похожие учителя</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-center py-4">
                  Похожие учителя будут показаны здесь
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/teachers">Все учителя</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
