
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeachers, useTeacherVacancies } from '@/hooks/useSupabaseData';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, BookOpen, Star, Clock, DollarSign, MessageCircle, User } from 'lucide-react';

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

// Get published teachers from localStorage (only if actually published)
const getPublishedTeachers = () => {
  try {
    const isPublished = localStorage.getItem('teacherProfilePublished') === 'true';
    const profileData = localStorage.getItem('teacherProfileData');
    
    if (isPublished && profileData) {
      const profile = JSON.parse(profileData);
      const currentUser = localStorage.getItem('user');
      const userData = currentUser ? JSON.parse(currentUser) : null;
      
      // Only return if profile has meaningful data
      if (profile.fullName && profile.specialization) {
        return [{
          id: 'local-teacher',
          user_id: userData?.email || 'local-teacher-id',
          profiles: {
            full_name: profile.fullName,
            avatar_url: profile.photoUrl
          },
          specialization: profile.specialization,
          bio: profile.bio,
          experience_years: parseInt(profile.experience) || 0,
          location: profile.location,
          education: profile.education,
          skills: profile.skills || [],
          languages: profile.languages || [],
          verification_status: 'verified' as const
        }];
      }
    }
  } catch (error) {
    console.error('Error loading published teacher:', error);
  }
  return [];
};

const TeachersPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: teacherVacancies, isLoading: vacanciesLoading } = useTeacherVacancies();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [viewMode, setViewMode] = useState<'teachers' | 'services'>('teachers');

  // Combine Supabase teachers with published local teachers (no duplicates)
  const publishedLocalTeachers = getPublishedTeachers();
  const supabaseTeachers = teachers || [];
  
  // Remove duplicates by checking if local teacher already exists in Supabase
  const allTeachers = [
    ...supabaseTeachers,
    ...publishedLocalTeachers.filter(localTeacher => 
      !supabaseTeachers.some(supabaseTeacher => 
        supabaseTeacher.profiles?.full_name === localTeacher.profiles?.full_name
      )
    )
  ];

  // Filter teachers based on search criteria
  const filteredTeachers = allTeachers?.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !subjectFilter || 
      teacher.specialization?.includes(subjectFilter);
    
    const matchesLocation = !locationFilter || 
      teacher.location?.includes(locationFilter);

    return matchesSearch && matchesSubject && matchesLocation;
  });

  // Filter teacher vacancies based on search criteria
  const filteredVacancies = teacherVacancies?.filter(vacancy => {
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

  const isLoading = teachersLoading || vacanciesLoading;

  // Handle contact teacher - redirect to messages page
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
    const currentUserId = user.email || 'current_user';
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
    
    // Navigate to messages page with the specific chat room
    navigate(`/messages/${chatRoomId}`);
  };

  // Handle view teacher profile
  const handleViewProfile = (teacher: any) => {
    // Navigate to the teacher profile with the correct ID
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
                <Skeleton className="h-20 w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
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
            {filteredTeachers.map((teacher) => (
              <Card 
                key={teacher.id} 
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Main Avatar */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={teacher.profiles?.avatar_url || undefined} />
                        <AvatarFallback>
                          {getInitials(teacher.profiles?.full_name || '')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {teacher.profiles?.full_name || 'Имя не указано'}
                            </h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="secondary">
                                {teacher.specialization || 'Специализация не указана'}
                              </Badge>
                              {teacher.experience_years && (
                                <span className="text-sm text-muted-foreground">
                                  {teacher.experience_years} лет опыта
                                </span>
                              )}
                            </div>
                            {teacher.location && (
                              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{teacher.location}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Top-right corner avatar */}
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={teacher.profiles?.avatar_url || undefined} />
                            <AvatarFallback>
                              {getInitials(teacher.profiles?.full_name || '')}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {teacher.bio && (
                      <p className="text-gray-600 mt-4 line-clamp-3">
                        {teacher.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {teacher.skills && teacher.skills.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {teacher.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{teacher.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {teacher.languages && teacher.languages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">
                          Языки: {teacher.languages.slice(0, 2).join(', ')}
                          {teacher.languages.length > 2 && ` +${teacher.languages.length - 2}`}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Footer with stats and buttons */}
                <div className="flex justify-between items-center border-t p-4 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title="Rating">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm">5.0</span>
                    </div>
                    <div className="flex items-center gap-1" title="Profile views">
                      <span className="text-sm text-muted-foreground">
                        {teacher.verification_status === 'verified' ? 'Подтвержден' : 'На проверке'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleContactTeacher(teacher)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Связаться
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(teacher)}
                    >
                      <User className="h-4 w-4 mr-1" />
                      Профиль
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
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
