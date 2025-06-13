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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, MapPin, BookOpen, Star, Clock, DollarSign, MessageCircle, Send } from 'lucide-react';

// Get published teachers from localStorage
const getPublishedTeachers = () => {
  try {
    const isPublished = localStorage.getItem('teacherProfilePublished') === 'true';
    const profileData = localStorage.getItem('teacherProfileData');
    
    if (isPublished && profileData) {
      const profile = JSON.parse(profileData);
      return [{
        id: 'local-teacher',
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
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');

  // Combine Supabase teachers with published local teachers
  const publishedLocalTeachers = getPublishedTeachers();
  const allTeachers = [...(teachers || []), ...publishedLocalTeachers];

  // Filter teachers based on search criteria
  const filteredTeachers = allTeachers?.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !subjectFilter || 
      teacher.specialization?.toLowerCase().includes(subjectFilter.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      teacher.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesSubject && matchesLocation;
  });

  // Filter teacher vacancies based on search criteria
  const filteredVacancies = teacherVacancies?.filter(vacancy => {
    const matchesSearch = !searchTerm || 
      vacancy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !subjectFilter || 
      vacancy.subject?.toLowerCase().includes(subjectFilter.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      vacancy.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesSubject && matchesLocation;
  });

  // Get unique subjects and locations for filters
  const teacherSubjects = [...new Set(allTeachers?.map(t => t.specialization).filter(Boolean))];
  const vacancySubjects = [...new Set(teacherVacancies?.map(v => v.subject).filter(Boolean))];
  const subjects = [...new Set([...teacherSubjects, ...vacancySubjects])];
  
  const teacherLocations = [...new Set(allTeachers?.map(t => t.location).filter(Boolean))];
  const vacancyLocations = [...new Set(teacherVacancies?.map(v => v.location).filter(Boolean))];
  const locations = [...new Set([...teacherLocations, ...vacancyLocations])];

  const isLoading = teachersLoading || vacanciesLoading;

  // Handle contact teacher
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

    setSelectedTeacher(teacher);
    setContactSubject(`Заинтересованность в услугах преподавателя: ${teacher.profiles?.full_name}`);
    setContactMessage('');
    setIsContactModalOpen(true);
  };

  // Send contact message
  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите сообщение',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, this would send to the backend
    // For now, we'll simulate sending a message
    toast({
      title: 'Сообщение отправлено',
      description: `Ваше сообщение отправлено преподавателю ${selectedTeacher?.profiles?.full_name}`,
    });

    setIsContactModalOpen(false);
    setContactMessage('');
    setContactSubject('');
    setSelectedTeacher(null);
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
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject || ''}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Местоположение" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все города</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location || ''}>{location}</SelectItem>
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
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={teacher.profiles?.avatar_url || undefined} />
                      <AvatarFallback>
                        {teacher.profiles?.full_name?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {teacher.profiles?.full_name || 'Имя не указано'}
                      </CardTitle>
                      <CardDescription>
                        {teacher.specialization || 'Специализация не указана'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {teacher.bio || 'Описание отсутствует'}
                  </p>
                  
                  <div className="space-y-2">
                    {teacher.experience_years && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Star className="h-4 w-4" />
                        {teacher.experience_years} лет опыта
                      </div>
                    )}
                    
                    {teacher.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        {teacher.location}
                      </div>
                    )}
                    
                    {teacher.education && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        {teacher.education}
                      </div>
                    )}
                  </div>

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

                  {/* Verification Status */}
                  <div className="mt-4 flex justify-between items-center">
                    <Badge 
                      variant={teacher.verification_status === 'verified' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {teacher.verification_status === 'verified' ? 'Подтвержден' : 'На проверке'}
                    </Badge>

                    {/* Contact Button */}
                    <Button
                      size="sm"
                      onClick={() => handleContactTeacher(teacher)}
                      className="gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
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
              Преподаватели не найдены
            </p>
            <p className="text-gray-400">
              Попробуйте изменить параметры поиска
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
      
      {/* Contact Teacher Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Связаться с преподавателем</DialogTitle>
            <DialogDescription>
              Отправьте сообщение преподавателю {selectedTeacher?.profiles?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Тема сообщения</Label>
              <Input
                id="subject"
                value={contactSubject}
                onChange={(e) => setContactSubject(e.target.value)}
                placeholder="Укажите тему сообщения"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                rows={4}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Напишите ваше сообщение преподавателю..."
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSendMessage} className="gap-2">
              <Send className="h-4 w-4" />
              Отправить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeachersPage;
