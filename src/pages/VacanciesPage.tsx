
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, Clock, GraduationCap, Building2, Search, MessageSquare, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';
import { useNavigate } from 'react-router-dom';

// Extended vacancy type with new fields
type ExtendedVacancy = {
  id: string;
  title: string;
  description?: string;
  vacancy_type?: string;
  subject?: string;
  education_level?: string;
  employment_type?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency?: string;
  application_deadline?: string;
  is_active?: boolean;
  created_at: string;
  requirements?: string[];
  benefits?: string[];
  school_id: string;
  school_profiles?: {
    school_name: string;
    address?: string;
    photo_urls?: string[];
    profiles?: {
      full_name: string;
    };
  };
};

const VacanciesPage = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createChatRoom } = useSecurePrivateChat();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [locationFilter, setLocationFilter] = React.useState('');

  const { data: supabaseVacancies = [], isLoading: isLoadingSupabase } = useQuery({
    queryKey: ['public-vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles (
            school_name,
            address,
            photo_urls,
            profiles (
              full_name
            )
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vacancies:', error);
        throw error;
      }

      return (data || []) as ExtendedVacancy[];
    },
  });

  // Get teacher services/vacancies
  const { data: teacherVacancies = [], isLoading: isLoadingTeacherVacancies } = useQuery({
    queryKey: ['teacher-services-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teacher services:', error);
        return [];
      }

      return data || [];
    },
  });

  // Get published schools and their vacancies from localStorage
  const getPublishedSchoolVacancies = () => {
    try {
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      console.log('DEBUG: Published schools for vacancies:', publishedSchools);
      
      const vacancies: ExtendedVacancy[] = [];
      
      publishedSchools.forEach((school: any) => {
        if (school.openPositions && school.openPositions.length > 0) {
          school.openPositions.forEach((position: any, index: number) => {
            vacancies.push({
              id: `published-${school.id}-${index}`,
              title: position.title || position.subject || 'Учитель',
              description: position.description || position.additionalInfo || '',
              employment_type: position.schedule || 'full-time',
              location: school.address || 'Не указано',
              salary_min: undefined,
              salary_max: undefined,
              salary_currency: 'som',
              created_at: new Date().toISOString(),
              is_active: true,
              school_id: school.id,
              school_profiles: {
                school_name: school.name,
                address: school.address,
                photo_urls: school.photos || [school.photo?.value || school.photo],
                profiles: {
                  full_name: school.name
                }
              }
            });
          });
        }
      });
      
      return vacancies;
    } catch (error) {
      console.error('Error loading published school vacancies:', error);
      return [];
    }
  };

  // Combine all vacancy sources
  const publishedVacancies = getPublishedSchoolVacancies();
  const allVacancies = [...supabaseVacancies, ...publishedVacancies];
  
  // Convert teacher services to vacation format for display
  const teacherServicesAsVacancies: ExtendedVacancy[] = teacherVacancies.map((service: any) => ({
    id: `teacher-service-${service.id}`,
    title: `${service.title} - Услуги репетитора`,
    description: service.description || '',
    vacancy_type: 'tutor',
    subject: service.subject,
    employment_type: service.employment_type || 'flexible',
    location: service.location || 'Не указано',
    salary_min: service.hourly_rate,
    salary_max: service.group_rate,
    salary_currency: 'som',
    application_deadline: undefined,
    requirements: [],
    benefits: [],
    created_at: service.created_at,
    is_active: service.is_active,
    school_id: service.teacher_id,
    school_profiles: {
      school_name: `Репетитор: ${service.profiles?.full_name || 'Преподаватель'}`,
      address: service.location || 'Не указано',
      photo_urls: service.profiles?.avatar_url ? [service.profiles.avatar_url] : [],
      profiles: {
        full_name: service.profiles?.full_name || 'Преподаватель'
      }
    }
  }));
  
  const vacancies = [...allVacancies, ...teacherServicesAsVacancies];
  const isLoading = isLoadingSupabase || isLoadingTeacherVacancies;

  const getVacancyTypeLabel = (type: string) => {
    const types = {
      teacher: 'Учитель',
      tutor: 'Репетитор',
      assistant: 'Ассистент',
      coordinator: 'Координатор',
      other: 'Другое'
    };
    return types[type as keyof typeof types] || type;
  };

  const getEducationLevelLabel = (level: string) => {
    const levels = {
      bachelor: 'Бакалавр',
      master: 'Магистр',
      any: 'Не важно'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getEmploymentTypeLabel = (type: string) => {
    const types = {
      'full-time': 'Полный день',
      'part-time': 'Частичная занятость',
      'online': 'Онлайн',
      'flexible': 'Гибкий график'
    };
    return types[type as keyof typeof types] || type;
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      rub: '₽',
      usd: '$',
      eur: '€',
      som: 'сом'
    };
    return symbols[currency as keyof typeof symbols] || 'сом';
  };

  const formatSalary = (vacancy: ExtendedVacancy) => {
    const { salary_min, salary_max, salary_currency = 'som' } = vacancy;
    const symbol = getCurrencySymbol(salary_currency);
    
    if (!salary_min && !salary_max) return 'По договоренности';
    if (salary_min && salary_max) return `${salary_min.toLocaleString()} - ${salary_max.toLocaleString()} ${symbol}`;
    if (salary_min) return `от ${salary_min.toLocaleString()} ${symbol}`;
    if (salary_max) return `до ${salary_max.toLocaleString()} ${symbol}`;
    return 'Не указана';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleContactSchool = async (schoolId: string, schoolName: string) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему, чтобы связаться со школой",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (profile?.role !== 'teacher') {
      toast({
        title: "Недоступно",
        description: "Связаться со школой могут только учителя",
        variant: "destructive",
      });
      return;
    }

    try {
      const chatRoomId = await createChatRoom(schoolId);
      toast({
        title: "Чат создан",
        description: `Теперь вы можете общаться с ${schoolName}`,
      });
      navigate(`/messages/${chatRoomId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать чат со школой",
        variant: "destructive",
      });
    }
  };

  const handleApplyToVacancy = (vacancy: ExtendedVacancy) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему, чтобы откликнуться на вакансию",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (profile?.role !== 'teacher') {
      toast({
        title: "Недоступно",
        description: "Откликнуться на вакансию могут только учителя",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Заявка отправлена!",
      description: `Ваш отклик на вакансию "${vacancy.title}" успешно отправлен`,
    });
  };

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = !searchTerm || 
      vacancy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vacancy.school_profiles?.school_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || vacancy.vacancy_type === typeFilter;
    
    const matchesLocation = !locationFilter || 
      vacancy.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Загрузка вакансий...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Вакансии для преподавателей</h1>
        <p className="text-muted-foreground mb-6">
          Найдите подходящую работу в образовательных учреждениях
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск вакансий..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Тип вакансии" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="teacher">Учитель</SelectItem>
              <SelectItem value="tutor">Репетитор</SelectItem>
              <SelectItem value="assistant">Ассистент</SelectItem>
              <SelectItem value="coordinator">Координатор</SelectItem>
              <SelectItem value="other">Другое</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Город..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          <Button 
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setLocationFilter('');
            }}
            variant="outline"
          >
            Сбросить фильтры
          </Button>
        </div>
      </div>

      {filteredVacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {vacancies.length === 0 
              ? 'На данный момент нет активных вакансий' 
              : 'Не найдено вакансий по заданным критериям'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredVacancies.map((vacancy) => (
            <Card key={vacancy.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{vacancy.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{vacancy.school_profiles?.school_name}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{getVacancyTypeLabel(vacancy.vacancy_type || 'teacher')}</Badge>
                      {vacancy.subject && <Badge variant="secondary">{vacancy.subject}</Badge>}
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        Активна
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">
                      {formatSalary(vacancy)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {vacancy.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{vacancy.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{getEmploymentTypeLabel(vacancy.employment_type || 'full-time')}</span>
                  </div>
                  
                  {vacancy.application_deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>До {formatDate(vacancy.application_deadline)}</span>
                    </div>
                  )}
                </div>

                {vacancy.description && (
                  <div>
                    <h4 className="font-medium mb-2">Описание</h4>
                    <p className="text-sm text-gray-600">
                      {vacancy.description}
                    </p>
                  </div>
                )}

                {vacancy.requirements && vacancy.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Требования</h4>
                    <div className="flex flex-wrap gap-1">
                      {vacancy.requirements.slice(0, 5).map((req: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {vacancy.requirements.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{vacancy.requirements.length - 5} еще
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {vacancy.benefits && vacancy.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Дополнительно</h4>
                    <div className="flex flex-wrap gap-1">
                      {vacancy.benefits.slice(0, 3).map((benefit: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {vacancy.benefits.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{vacancy.benefits.length - 3} еще
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Опубликовано: {formatDate(vacancy.created_at)}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactSchool(vacancy.school_id, vacancy.school_profiles?.school_name || 'школой')}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Связаться со школой
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApplyToVacancy(vacancy)}
                    >
                      Откликнуться
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VacanciesPage;
