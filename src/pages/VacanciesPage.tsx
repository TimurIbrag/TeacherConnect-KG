
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
          school_profiles!inner (
            school_name,
            address,
            photo_urls,
            profiles (
              full_name
            )
          )
        `)
        .eq('is_active', true)
        .eq('school_profiles.is_published', true)  // Only show vacancies from published schools
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vacancies:', error);
        throw error;
      }

      return (data || []) as ExtendedVacancy[];
    },
  });

  const { data: teacherVacancies = [], isLoading: isLoadingTeacherVacancies } = useQuery({
    queryKey: ['teacher-services-public'],
    queryFn: async () => {
      // First get published teacher IDs
      const { data: publishedTeachers, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('id')
        .eq('is_published', true);

      if (teacherError) {
        console.error('Error fetching published teachers:', teacherError);
        return [];
      }

      const publishedTeacherIds = (publishedTeachers || []).map(t => t.id);

      if (publishedTeacherIds.length === 0) {
        return []; // No published teachers
      }

      // Then get services from published teachers
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
        .in('teacher_id', publishedTeacherIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching teacher services:', error);
        return [];
      }

      return data || [];
    },
  });

  // No more localStorage functionality - all data comes from published profiles only
  const allVacancies = [...supabaseVacancies]; // Only Supabase vacancies from published schools
  
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
      teacher: t('vacancy.types.teacher'),
      tutor: t('vacancy.types.tutor'),
      assistant: t('vacancy.types.assistant'),
      coordinator: t('vacancy.types.coordinator'),
      other: t('vacancy.types.other')
    };
    return types[type as keyof typeof types] || type;
  };

  const getEducationLevelLabel = (level: string) => {
    const levels = {
      bachelor: t('education.bachelor'),
      master: t('education.master'),
      any: t('education.any')
    };
    return levels[level as keyof typeof levels] || level;
  };

  const getEmploymentTypeLabel = (type: string) => {
    const types = {
      'full-time': t('employment.fullTime'),
      'part-time': t('employment.partTime'),
      'online': t('employment.online'),
      'flexible': t('employment.flexible')
    };
    return types[type as keyof typeof types] || type;
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols = {
      rub: '₽',
      usd: '$',
      eur: '€',
      som: t('currency.som')
    };
    return symbols[currency as keyof typeof symbols] || t('currency.som');
  };

  const formatSalary = (vacancy: ExtendedVacancy) => {
    const { salary_min, salary_max, salary_currency = 'som' } = vacancy;
    const symbol = getCurrencySymbol(salary_currency);
    
    if (!salary_min && !salary_max) return t('vacancy.negotiable');
    if (salary_min && salary_max) return `${salary_min.toLocaleString()} - ${salary_max.toLocaleString()} ${symbol}`;
    if (salary_min) return `${t('vacancy.from')} ${salary_min.toLocaleString()} ${symbol}`;
    if (salary_max) return `${t('vacancy.upTo')} ${salary_max.toLocaleString()} ${symbol}`;
    return t('vacancy.notSpecified');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const handleContactSchool = async (schoolId: string, schoolName: string) => {
    if (!user) {
      toast({
        title: t('auth.required'),
        description: t('vacancy.loginToContact'),
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (profile?.role !== 'teacher') {
      toast({
        title: t('common.unavailable'),
        description: t('vacancy.onlyTeachersCanContact'),
        variant: "destructive",
      });
      return;
    }

    try {
      const chatRoomId = await createChatRoom(schoolId);
      toast({
        title: t('chat.created'),
        description: t('chat.canNowCommunicate').replace('{{name}}', schoolName),
      });
      navigate(`/messages/${chatRoomId}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: t('common.error'),
        description: t('chat.createError'),
        variant: "destructive",
      });
    }
  };

  const handleApplyToVacancy = (vacancy: ExtendedVacancy) => {
    if (!user) {
      toast({
        title: t('auth.required'),
        description: t('vacancy.loginToApply'),
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (profile?.role !== 'teacher') {
      toast({
        title: t('common.unavailable'),
        description: t('vacancy.onlyTeachersCanApply'),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: t('vacancy.applicationSent'),
      description: t('vacancy.applicationSuccess').replace('{{title}}', vacancy.title),
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
          <p className="text-muted-foreground">{t('vacancy.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t('vacancy.pageTitle')}</h1>
        <p className="text-muted-foreground mb-6">
          {t('vacancy.pageSubtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('vacancy.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t('vacancy.typePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('vacancy.allTypes')}</SelectItem>
              <SelectItem value="teacher">{t('vacancy.types.teacher')}</SelectItem>
              <SelectItem value="tutor">{t('vacancy.types.tutor')}</SelectItem>
              <SelectItem value="assistant">{t('vacancy.types.assistant')}</SelectItem>
              <SelectItem value="coordinator">{t('vacancy.types.coordinator')}</SelectItem>
              <SelectItem value="other">{t('vacancy.types.other')}</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder={t('vacancy.cityPlaceholder')}
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
            {t('common.reset')}
          </Button>
        </div>
      </div>

      {filteredVacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {vacancies.length === 0 
              ? t('vacancy.noActiveVacancies') 
              : t('vacancy.noVacanciesFound')
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
                        {t('vacancy.active')}
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
                      <span>{t('vacancy.deadline')} {formatDate(vacancy.application_deadline)}</span>
                    </div>
                  )}
                </div>

                {vacancy.description && (
                  <div>
                    <h4 className="font-medium mb-2">{t('vacancy.description')}</h4>
                    <p className="text-sm text-gray-600">
                      {vacancy.description}
                    </p>
                  </div>
                )}

                {vacancy.requirements && vacancy.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{t('vacancy.requirements')}</h4>
                    <div className="flex flex-wrap gap-1">
                      {vacancy.requirements.slice(0, 5).map((req: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {vacancy.requirements.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{vacancy.requirements.length - 5} {t('common.more')}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {vacancy.benefits && vacancy.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">{t('vacancy.benefits')}</h4>
                    <div className="flex flex-wrap gap-1">
                      {vacancy.benefits.slice(0, 3).map((benefit: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                      {vacancy.benefits.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{vacancy.benefits.length - 3} {t('common.more')}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t('vacancy.published')}: {formatDate(vacancy.created_at)}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleContactSchool(vacancy.school_id, vacancy.school_profiles?.school_name || t('schools.defaultName'))}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {t('vacancy.contactSchool')}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApplyToVacancy(vacancy)}
                    >
                      {t('vacancy.apply')}
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
