
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { schoolsData } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from '@/hooks/useSupabaseData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
import { 
  Briefcase, 
  MapPin, 
  MessageSquare,
  Star,
  Building,
  Eye,
  Home,
  Check,
  DollarSign,
  Calendar,
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationMap from '@/components/LocationMap';

// Unified interface for displaying school data
interface DisplaySchool {
  id: string | number;
  name: string;
  photo: string;
  address: string;
  type: string;
  specialization: string;
  ratings: number;
  views: number;
  housing: boolean;
  about: string;
  facilities: string[];
  applications: number;
  city?: string;
}

const SchoolProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Try to get school from Supabase first, then fallback to mock data
  const { data: supabaseSchool, isLoading: isLoadingSupabase } = useSchool(id || '');
  
  // Get vacancies for this school
  const { data: vacancies = [], isLoading: isLoadingVacancies } = useQuery({
    queryKey: ['school-vacancies-public', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles (
            school_name,
            address
          )
        `)
        .eq('school_id', id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vacancies:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!id,
  });

  const schoolId = Number(id);
  const mockSchool = schoolsData.find(s => s.id === schoolId);
  
  // Use Supabase school if available, otherwise use mock data
  const school = supabaseSchool || mockSchool;
  
  const handleApplyToVacancy = (vacancyId: string) => {
    toast({
      title: "Заявка отправлена!",
      description: "Ваш отклик на вакансию успешно отправлен",
    });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Зарплата по договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} сом`;
    if (min) return `от ${min.toLocaleString()} сом`;
    if (max) return `до ${max.toLocaleString()} сом`;
    return 'Не указана';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('ru-RU');
  };
  
  if (isLoadingSupabase && !mockSchool) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
      </div>
    );
  }
  
  if (!school) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Школа не найдена</h1>
        <p className="mb-6">Организация с указанным ID не существует.</p>
        <Button asChild>
          <Link to="/schools">Вернуться к списку школ</Link>
        </Button>
      </div>
    );
  }

  // Convert school data to unified display format
  const displaySchool: DisplaySchool = supabaseSchool ? {
    id: supabaseSchool.id,
    name: supabaseSchool.school_name || 'Школа',
    photo: supabaseSchool.photo_urls?.[0] || '/placeholder.svg',
    address: supabaseSchool.address || 'Адрес не указан',
    type: supabaseSchool.school_type || 'Государственная',
    specialization: supabaseSchool.description || 'Общее образование',
    ratings: 4.5,
    views: 150,
    housing: supabaseSchool.housing_provided || false,
    about: supabaseSchool.description || 'Описание школы',
    facilities: supabaseSchool.facilities || [],
    applications: 0,
    city: supabaseSchool.address?.split(',')[0] || 'Бишкек'
  } : {
    id: mockSchool!.id,
    name: mockSchool!.name,
    photo: mockSchool!.photo,
    address: mockSchool!.address,
    type: mockSchool!.type,
    specialization: mockSchool!.specialization,
    ratings: mockSchool!.ratings,
    views: mockSchool!.views,
    housing: mockSchool!.housing,
    about: mockSchool!.about,
    facilities: mockSchool!.facilities,
    applications: mockSchool!.applications,
    city: mockSchool!.address?.split(',')[0] || 'Бишкек'
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="relative h-48 w-full">
              <img 
                src={displaySchool.photo} 
                alt={displaySchool.name} 
                className="h-full w-full object-cover rounded-t-lg" 
              />
              {displaySchool.housing && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-white">
                    <Home className="h-3 w-3 mr-1" />
                    Жилье
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{displaySchool.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{displaySchool.address}</span>
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{displaySchool.type}</Badge>
                    <Badge variant="secondary">{displaySchool.specialization}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                      <span>{displaySchool.ratings}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:self-start">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('button.message')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-6">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">О школе</TabsTrigger>
                  <TabsTrigger value="vacancies">
                    Вакансии
                    <Badge className="ml-2 bg-primary text-primary-foreground" variant="default">
                      {vacancies.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="facilities">Инфраструктура</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">О школе</h3>
                    <p className="text-muted-foreground">{displaySchool.about}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Тип</h3>
                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <span>{displaySchool.type}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Специализация</h3>
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                        <span>{displaySchool.specialization}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Местоположение</h3>
                    <LocationMap address={displaySchool.address} />
                  </div>
                </TabsContent>
                
                <TabsContent value="vacancies" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Открытые вакансии</h3>
                    {isLoadingVacancies ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Загрузка вакансий...</p>
                      </div>
                    ) : vacancies.length > 0 ? (
                      <div className="space-y-4">
                        {vacancies.map((vacancy) => (
                          <Card key={vacancy.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {displaySchool.name}
                                  </p>
                                </div>
                                <Badge className="bg-primary text-primary-foreground">
                                  {vacancy.employment_type === 'full-time' ? 'Полный день' : 
                                   vacancy.employment_type === 'part-time' ? 'Частичная занятость' :
                                   vacancy.employment_type === 'contract' ? 'Контракт' : 'Временная'}
                                </Badge>
                              </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                              {vacancy.description && (
                                <p className="text-sm text-gray-600">{vacancy.description}</p>
                              )}
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatSalary(vacancy.salary_min, vacancy.salary_max)}</span>
                                </div>
                                
                                {vacancy.location && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{vacancy.location}</span>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{vacancy.employment_type === 'full-time' ? 'Полный день' : 
                                         vacancy.employment_type === 'part-time' ? 'Частичная занятость' :
                                         vacancy.employment_type === 'contract' ? 'Контракт' : 'Временная'}</span>
                                </div>
                                
                                {vacancy.application_deadline && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>До {formatDate(vacancy.application_deadline)}</span>
                                  </div>
                                )}
                              </div>

                              {vacancy.requirements && vacancy.requirements.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Требования:</h4>
                                  <ul className="text-sm list-disc list-inside space-y-1">
                                    {vacancy.requirements.map((req, index) => (
                                      <li key={index}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {vacancy.benefits && vacancy.benefits.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Дополнительно:</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {vacancy.benefits.map((benefit, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {benefit}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                            
                            <CardFooter className="flex justify-between items-center border-t pt-4">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/schools/${id}`}>Подробнее о школе</Link>
                              </Button>
                              <Button size="sm" onClick={() => handleApplyToVacancy(vacancy.id)}>
                                Откликнуться
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">Нет открытых вакансий</h3>
                        <p className="text-muted-foreground">
                          В настоящее время школа не разместила открытых вакансий.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="facilities" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Инфраструктура</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {displaySchool.facilities && displaySchool.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-md border">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {displaySchool.housing && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Дополнительные преимущества</h3>
                      <div className="flex items-center gap-2 p-3 rounded-md border border-accent/30 bg-accent/5">
                        <Home className="h-5 w-5 text-accent" />
                        <span>Школа предоставляет жилье для учителей</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
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
                  <span className="font-medium">{displaySchool.views}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Количество вакансий:</span>
                <span className="font-medium">{vacancies.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Откликов получено:</span>
                <span className="font-medium">{displaySchool.applications || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Рейтинг:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-accent fill-accent" />
                  <span className="font-medium">{displaySchool.ratings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Похожие школы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schoolsData
                  .filter(s => s.id !== schoolId && s.type === displaySchool.type)
                  .slice(0, 3)
                  .map(similarSchool => (
                    <div key={similarSchool.id} className="flex flex-col gap-2">
                      <div className="h-24 w-full rounded-md overflow-hidden">
                        <img 
                          src={similarSchool.photo} 
                          alt={similarSchool.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{similarSchool.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {similarSchool.address}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to={`/schools/${similarSchool.id}`}>
                          Просмотр
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/schools">Все школы</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfilePage;
