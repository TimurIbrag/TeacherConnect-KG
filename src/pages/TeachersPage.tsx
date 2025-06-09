import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeachers } from '@/hooks/useSupabaseData';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, BookOpen, Star } from 'lucide-react';

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
          avatar_url: null
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
  const { data: teachers, isLoading } = useTeachers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

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

  // Get unique subjects and locations for filters
  const subjects = [...new Set(allTeachers?.map(t => t.specialization).filter(Boolean))];
  const locations = [...new Set(allTeachers?.map(t => t.location).filter(Boolean))];

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
          Преподаватели
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Найдите квалифицированных преподавателей для вашего образовательного учреждения
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Поиск по имени или специализации..."
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
          Найдено {filteredTeachers?.length || 0} преподавателей
        </p>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers && filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card 
              key={teacher.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => teacher.id !== 'local-teacher' ? navigate(`/teachers/${teacher.id}`) : null}
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
                <div className="mt-4">
                  <Badge 
                    variant={teacher.verification_status === 'verified' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {teacher.verification_status === 'verified' ? 'Подтвержден' : 'На проверке'}
                  </Badge>
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
      )}
    </div>
  );
};

export default TeachersPage;
