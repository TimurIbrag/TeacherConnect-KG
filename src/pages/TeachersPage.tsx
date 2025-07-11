import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeachers } from '@/hooks/useTeachers';
import { useTeacherVacancies } from '@/hooks/useTeacherVacancies';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import TeacherCard from '@/components/TeacherCard';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, BookOpen, Star, Clock, DollarSign, MessageCircle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Predefined subjects list
const TEACHER_SUBJECTS = [
  'Русский язык',
  'Русская литература',
  'Кыргызский язык',
  'Кыргызская литература',
  'Английский язык',
  'Немецкий язык',
  'Турецкий язык',
  'Китайский язык',
  'Математика',
  'Алгебра и геометрия',
  'Физика',
  'Химия',
  'Биология',
  'География',
  'История',
  'Общественные и духовные дисциплины',
  'Человек и общество',
  'Основы религиозной культуры',
  'Информатика',
  'Труд / Технология',
  'ИЗО (изобразительное искусство)',
  'Музыка',
  'Физическая культура',
  'Предмет по выбору'
];

// Predefined districts list
const DISTRICTS = [
  'Ленинский район',
  'Первомайский район',
  'Октябрьский район',
  'Свердловский район'
];

// DISABLED - No longer using localStorage for published teachers
// All teacher data will only come from Supabase database

const TeachersPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: teacherVacancies, isLoading: vacanciesLoading } = useTeacherVacancies();
  
  // Track view counts for teachers
  const trackTeacherView = async (teacherId: string) => {
    try {
      await supabase.rpc('increment_profile_views', {
        profile_id_param: teacherId,
        profile_type_param: 'teacher',
        viewer_id_param: user?.id || null,
        ip_address_param: null,
        user_agent_param: navigator.userAgent
      });
    } catch (error) {
      console.error('Error tracking teacher view:', error);
    }
  };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [viewMode, setViewMode] = useState<'teachers' | 'services'>('teachers');
  
  // Clean up old localStorage data on mount only (optimization)
  useEffect(() => {
    const keysToRemove = [
      'teacherProfileData',
      'teacherProfilePublished', 
      'publishedTeachers'
    ];
    
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });
  }, []); // Run only once on mount

  // All teachers now come from Supabase only (published teachers)
  const allTeachers = teachers || [];

  // Optimize filtering with useMemo
  const filteredTeachers = useMemo(() => {
    if (!allTeachers) return [];
    
    return allTeachers.filter(teacher => {
      const teacherName = teacher.profiles?.full_name || '';
      const teacherSpec = teacher.specialization || '';
      
      const matchesSearch = !searchTerm || 
        teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacherSpec.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !subjectFilter || 
        teacherSpec.toLowerCase().includes(subjectFilter.toLowerCase());
      
      const matchesLocation = !locationFilter || 
        teacher.location?.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesSubject && matchesLocation;
    });
  }, [allTeachers, searchTerm, subjectFilter, locationFilter]);

  // Optimize vacancy filtering with useMemo
  const filteredVacancies = useMemo(() => {
    if (!teacherVacancies) return [];
    
    return teacherVacancies.filter(vacancy => {
      const matchesSearch = !searchTerm || 
        vacancy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !subjectFilter || 
        vacancy.subject?.includes(subjectFilter);
      
      const matchesLocation = !locationFilter || 
        vacancy.location?.includes(locationFilter);

      return matchesSearch && matchesSubject && matchesLocation;
    });
  }, [teacherVacancies, searchTerm, subjectFilter, locationFilter]);

  const isLoading = teachersLoading || vacanciesLoading;

  // Handle contact teacher - redirect to messages page or show login prompt
  const handleContactTeacher = (teacher: any) => {
    if (!user) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите в систему, чтобы связаться с преподавателем',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Create a unique chat room ID based on both user IDs
    const currentUserId = user.email || user.id || 'current_user';
    const teacherId = teacher.user_id || teacher.id;
    const chatRoomId = `chat_${[currentUserId, teacherId].sort().join('_')}`;
    
    // Store teacher info in localStorage for the chat
    const teacherInfo = {
      id: teacherId,
      name: teacher.profiles?.full_name || 'Преподаватель',
      avatar: teacher.profiles?.avatar_url,
      specialization: teacher.specialization
    };
    localStorage.setItem(`teacher_${teacherId}`, JSON.stringify(teacherInfo));
    
    console.log('Attempting to navigate to chat:', chatRoomId);
    
    // Navigate to messages page with the specific chat room
    navigate(`/messages/${chatRoomId}`);
  };

  // Handle view teacher profile
  const handleViewProfile = (teacher: any) => {
    console.log('Viewing profile for teacher:', teacher);
    const teacherId = teacher.id;
    navigate(`/teachers/${teacherId}`);
  };

  // Get teacher initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return 'T';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Преподаватели и услуги
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Найдите квалифицированных преподавателей и их услуги
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'teachers' ? 'default' : 'ghost'}
            onClick={() => setViewMode('teachers')}
            className="rounded-md"
          >
            Преподаватели
          </Button>
          <Button
            variant={viewMode === 'services' ? 'default' : 'ghost'}
            onClick={() => setViewMode('services')}
            className="rounded-md"
          >
            Услуги
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={viewMode === 'teachers' ? "Поиск по имени или специализации..." : "Поиск услуг..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Предмет" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все предметы</SelectItem>
              {TEACHER_SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Местоположение" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все районы</SelectItem>
              {DISTRICTS.map((district) => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchTerm || subjectFilter || locationFilter) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSubjectFilter('');
                setLocationFilter('');
              }}
            >
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {viewMode === 'teachers' 
            ? `Найдено ${filteredTeachers?.length || 0} преподавателей`
            : `Найдено ${filteredVacancies?.length || 0} услуг`
          }
        </p>
      </div>

      {/* Content */}
      {viewMode === 'teachers' ? (
        // Teachers Grid
        filteredTeachers && filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => {
              // Properly map teacher data for TeacherCard component with actual view count
              const teacherData = {
                id: teacher.id,
                name: teacher.profiles?.full_name && teacher.profiles.full_name.trim() !== '' ? teacher.profiles.full_name : 'Имя не указано',
                photo: teacher.profiles?.avatar_url && teacher.profiles.avatar_url.trim() !== '' ? teacher.profiles.avatar_url : null,
                specialization: teacher.specialization || 'Специализация не указана',
                experience: teacher.experience_years ? `${teacher.experience_years} лет опыта` : 'Опыт не указан',
                location: teacher.location || 'Местоположение не указано',
                ratings: 4.5, // Mock value
                views: teacher.view_count || 0, // Use actual view count from database
              };
              
              return (
                <div key={teacher.id} onClick={() => trackTeacherView(teacher.id)}>
                  <TeacherCard 
                    {...teacherData}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">
              Преподаватели не найдены
            </p>
            <p className="text-gray-400">
              Попробуйте изменить параметры поиска или опубликуйте свой профиль
            </p>
          </div>
        )
      ) : (
        // Services Grid
        filteredVacancies && filteredVacancies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVacancies.map((vacancy) => (
              <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={vacancy.profiles?.avatar_url || undefined} />
                      <AvatarFallback>
                        {vacancy.profiles?.full_name?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                      <CardDescription>
                        {vacancy.profiles?.full_name}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {vacancy.subject && (
                    <Badge variant="secondary" className="mb-3">
                      {vacancy.subject}
                    </Badge>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {vacancy.description || 'Описание отсутствует'}
                  </p>
                  
                  <div className="space-y-2">
                    {(vacancy.hourly_rate || vacancy.group_rate) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        {vacancy.hourly_rate && `${vacancy.hourly_rate} ₽/час (инд.)`}
                        {vacancy.hourly_rate && vacancy.group_rate && ' • '}
                        {vacancy.group_rate && `${vacancy.group_rate} ₽/час (группа)`}
                      </div>
                    )}
                    
                    {vacancy.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        {vacancy.location}
                      </div>
                    )}
                    
                    {vacancy.employment_type && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {vacancy.employment_type}
                      </div>
                    )}
                  </div>

                  {vacancy.availability && vacancy.availability.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Доступность:</p>
                      <div className="flex flex-wrap gap-1">
                        {vacancy.availability.slice(0, 3).map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                        {vacancy.availability.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vacancy.availability.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full" size="sm">
                      Связаться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">
              Услуги не найдены
            </p>
            <p className="text-gray-400">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default TeachersPage;
