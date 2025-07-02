
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeacher } from '@/hooks/useSupabaseData';
import { teachersData } from '@/data/mockData';
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
  Eye
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
  
  // Enhanced function to get all possible teachers including published ones
  const getAllAvailableTeachers = () => {
    const teachers = [];
    
    // 1. Get published teacher from localStorage
    try {
      const isPublished = localStorage.getItem('teacherProfilePublished') === 'true';
      const profileData = localStorage.getItem('teacherProfileData');
      
      if (isPublished && profileData) {
        const profile = JSON.parse(profileData);
        
        if (profile.fullName && profile.specialization) {
          teachers.push({
            id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: profile.fullName,
            photo: profile.photoUrl || '/placeholder.svg',
            specialization: profile.specialization,
            experience: (profile.experience || '0') + ' лет',
            location: profile.location || 'Не указано',
            ratings: 5.0,
            views: 0,
            about: profile.bio || 'Информация о себе не указана',
            education: profile.education || 'Образование не указано',
            languages: profile.languages || ['Кыргызский', 'Русский'],
            achievements: 'Опубликованный профиль',
            preferredSchedule: 'Полный день',
            desiredSalary: '25,000 - 30,000 сом',
            preferredDistricts: [profile.location || 'Бишкек'],
            applications: 0,
            source: 'published'
          });
        }
      }
    } catch (error) {
      console.error('Error loading published teacher:', error);
    }
    
    // 2. Get all published teachers from a global storage (if exists)
    try {
      const allPublishedTeachers = JSON.parse(localStorage.getItem('allPublishedTeachers') || '[]');
      allPublishedTeachers.forEach((teacher: any, index: number) => {
        if (teacher.id && teacher.name) {
          teachers.push({
            id: teacher.id,
            name: teacher.name,
            photo: teacher.photo || '/placeholder.svg',
            specialization: teacher.specialization || 'Специализация не указана',
            experience: (teacher.experience || '0') + ' лет',
            location: teacher.location || 'Не указано',
            ratings: teacher.ratings || 5.0,
            views: teacher.views || 0,
            about: teacher.about || 'Информация о себе не указана',
            education: teacher.education || 'Образование не указано',
            languages: teacher.languages || ['Кыргызский', 'Русский'],
            achievements: teacher.achievements || 'Опубликованный профиль',
            preferredSchedule: teacher.preferredSchedule || 'Полный день',
            desiredSalary: teacher.desiredSalary || '25,000 - 30,000 сом',
            preferredDistricts: teacher.preferredDistricts || ['Бишкек'],
            applications: teacher.applications || 0,
            source: 'global_published'
          });
        }
      });
    } catch (error) {
      console.error('Error loading global published teachers:', error);
    }
    
    // 3. Get mock teachers
    teachersData.forEach(teacher => {
      teachers.push({
        id: teacher.id.toString(),
        name: teacher.name,
        photo: teacher.photo,
        specialization: teacher.specialization,
        experience: teacher.experience,
        location: teacher.location,
        ratings: teacher.ratings,
        views: teacher.views,
        about: teacher.about,
        education: teacher.education,
        languages: teacher.languages,
        achievements: teacher.achievements,
        preferredSchedule: teacher.preferredSchedule,
        desiredSalary: teacher.desiredSalary,
        preferredDistricts: teacher.preferredDistricts,
        applications: teacher.applications,
        source: 'mock'
      });
    });
    
    return teachers;
  };
  
  // Find the teacher from all available sources
  const findTeacherById = (searchId: string) => {
    const allTeachers = getAllAvailableTeachers();
    console.log('Searching for teacher ID:', searchId);
    console.log('Available teachers:', allTeachers.map(t => ({ id: t.id, name: t.name })));
    
    return allTeachers.find(t => t.id === searchId || t.id.toString() === searchId);
  };
  
  // Determine which teacher data to use
  const teacher = supabaseTeacher ? {
    id: supabaseTeacher.id,
    name: supabaseTeacher.profiles?.full_name || 'Учитель',
    photo: supabaseTeacher.profiles?.avatar_url || '/placeholder.svg',
    specialization: supabaseTeacher.specialization || 'Специализация не указана',
    experience: `${supabaseTeacher.experience_years || 0} лет`,
    location: supabaseTeacher.location || 'Местоположение не указано',
    ratings: 5.0,
    views: 0,
    about: supabaseTeacher.bio || 'Информация о себе не указана',
    education: supabaseTeacher.education || 'Образование не указано',
    languages: supabaseTeacher.languages || ['Кыргызский', 'Русский'],
    achievements: 'Верифицированный преподаватель',
    preferredSchedule: 'Полный день',
    desiredSalary: '25,000 - 30,000 сом',
    preferredDistricts: [supabaseTeacher.location || 'Бишкек'],
    applications: 0,
    source: 'supabase'
  } : findTeacherById(teacherId);
  
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
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
                    <AvatarImage src={teacher.photo} alt={teacher.name} />
                    <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{teacher.name}</CardTitle>
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
                {getAllAvailableTeachers()
                  .filter(t => t.id !== teacherId && t.specialization === teacher.specialization)
                  .slice(0, 3)
                  .map(similarTeacher => (
                    <div key={similarTeacher.id} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={similarTeacher.photo} alt={similarTeacher.name} />
                        <AvatarFallback>{getInitials(similarTeacher.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{similarTeacher.name}</p>
                        <p className="text-xs text-muted-foreground">{similarTeacher.specialization}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/teachers/${similarTeacher.id}`}>
                          Просмотр
                        </Link>
                      </Button>
                    </div>
                  ))}
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
