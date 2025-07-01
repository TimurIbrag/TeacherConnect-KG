import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Eye, Briefcase, Globe, Home, CheckCircle, Building, Clock } from 'lucide-react';
import { schoolsData } from '@/data/mockData';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
};

const SchoolProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add query for school's active vacancies - handle both UUID and numeric IDs
  const { data: schoolVacancies = [] } = useQuery({
    queryKey: ['school-vacancies', id],
    queryFn: async () => {
      if (!id) return [];
      
      // For UUID format (Supabase schools), query the database
      if (id.includes('-')) {
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
          console.error('Error fetching school vacancies:', error);
          return [];
        }

        return (data || []) as ExtendedVacancy[];
      }
      
      // For numeric IDs (mock schools), return empty array - we'll show openPositions instead
      return [];
    },
    enabled: !!id,
  });

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

  const formatSalary = (vacancy: ExtendedVacancy) => {
    const { salary_min, salary_max, salary_currency = 'rub' } = vacancy;
    const symbols = { rub: '₽', usd: '$', eur: '€' };
    const symbol = symbols[salary_currency as keyof typeof symbols] || '₽';
    
    if (!salary_min && !salary_max) return 'По договоренности';
    if (salary_min && salary_max) return `${salary_min.toLocaleString()} - ${salary_max.toLocaleString()} ${symbol}`;
    if (salary_min) return `от ${salary_min.toLocaleString()} ${symbol}`;
    if (salary_max) return `до ${salary_max.toLocaleString()} ${symbol}`;
    return 'Не указана';
  };

  useEffect(() => {
    const loadSchoolData = async () => {
      // Try to find school in Supabase first
      if (id && id.includes('-')) {
        try {
          const { data: supabaseSchool, error } = await supabase
            .from('school_profiles')
            .select(`
              *,
              profiles (*)
            `)
            .eq('id', id)
            .single();

          if (!error && supabaseSchool) {
            const schoolData = {
              id: supabaseSchool.id,
              name: supabaseSchool.school_name || 'Школа',
              photo: supabaseSchool.photo_urls?.[0] || '/placeholder.svg',
              address: supabaseSchool.address || 'Адрес не указан',
              type: supabaseSchool.school_type || 'Государственная',
              specialization: supabaseSchool.description || 'Общее образование',
              views: 150, // Mock value
              housing: supabaseSchool.housing_provided || false,
              about: supabaseSchool.description || 'Информация о школе не предоставлена.',
              website: supabaseSchool.website_url || '',
              facilities: supabaseSchool.facilities || [],
              applications: 0, // Mock value
              city: supabaseSchool.address?.split(',')[0] || 'Бишкек',
              photos: supabaseSchool.photo_urls || [], // Display all photos from school profile
              locationVerified: supabaseSchool.location_verified || false
            };
            setSchool(schoolData);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching school from Supabase:', error);
        }
      }

      // Fallback to published schools and mock data
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      let foundSchool = publishedSchools.find((s: any) => s.id.toString() === id);

      if (!foundSchool) {
        foundSchool = schoolsData.find(s => s.id.toString() === id);
        if (foundSchool) {
          foundSchool = {
            ...foundSchool,
            city: 'Бишкек',
            housing: foundSchool.housing || false,
            about: foundSchool.about || 'Информация о школе не предоставлена.',
            website: foundSchool.website || '',
            facilities: foundSchool.facilities || [],
            applications: foundSchool.applications || 0,
            photos: [], // Mock schools don't have photos
            locationVerified: false
          };
        }
      }

      setSchool(foundSchool);
      setLoading(false);
    };

    loadSchoolData();
  }, [id]);

  if (loading) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="container px-4 py-8 max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => navigate('/schools')} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к школам
        </Button>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Школа не найдена</h1>
          <p className="text-muted-foreground">Запрашиваемая школа не существует или была удалена.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Button variant="outline" onClick={() => navigate('/schools')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Вернуться к школам
      </Button>

      {/* School Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden border">
              {/* School photo - Always visible to all users including guests */}
              <img 
                src={school.photo} 
                alt={school.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{school.name}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {school.type && <Badge variant="outline">{school.type}</Badge>}
                {school.specialization && <Badge variant="secondary">{school.specialization}</Badge>}
                {school.city && <Badge variant="outline">{school.city}</Badge>}
                {school.housing && (
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    <Home className="w-3 h-3 mr-1" />
                    С жильем
                  </Badge>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{school.address}</span>
                  {school.locationVerified && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                
                {school.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={school.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      {school.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>{school.views} просмотров</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {school.openPositions ? school.openPositions.length : schoolVacancies.length} вакансий
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show Supabase vacancies or mock school positions */}
      {(schoolVacancies.length > 0 || (school.openPositions && school.openPositions.length > 0)) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Открытые вакансии ({schoolVacancies.length > 0 ? schoolVacancies.length : school.openPositions?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Show Supabase vacancies if available */}
              {schoolVacancies.map((vacancy) => (
                <div key={vacancy.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{vacancy.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{getVacancyTypeLabel(vacancy.vacancy_type || 'teacher')}</Badge>
                        {vacancy.subject && <Badge variant="secondary">{vacancy.subject}</Badge>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {formatSalary(vacancy)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                    {vacancy.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{vacancy.location}</span>
                      </div>
                    )}
                    {vacancy.employment_type && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{vacancy.employment_type}</span>
                      </div>
                    )}
                  </div>
                  
                  {vacancy.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {vacancy.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Опубликовано: {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                    </span>
                    <Button size="sm">
                      Откликнуться
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Show mock school positions if no Supabase vacancies */}
              {schoolVacancies.length === 0 && school.openPositions && school.openPositions.map((position: any) => (
                <div key={position.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{position.title}</h4>
                      <Badge variant="outline">Учитель</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary">
                        {position.salary}
                      </div>
                    </div>
                  </div>
                  
                  {position.schedule && (
                    <div className="text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{position.schedule}</span>
                      </div>
                    </div>
                  )}
                  
                  {position.additionalInfo && (
                    <p className="text-sm text-gray-600 mb-3">
                      {position.additionalInfo}
                    </p>
                  )}
                  
                  <div className="flex justify-end">
                    <Button size="sm">
                      Откликнуться
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>О школе</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {school.about || 'Информация о школе не предоставлена.'}
              </p>
            </CardContent>
          </Card>

          {/* Photo Gallery */}
          {school.photos && school.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Фотогалерея школы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {school.photos.map((photo: string, index: number) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg border">
                      {/* School gallery photos - Always visible to all users including guests */}
                      <img 
                        src={photo} 
                        alt={`${school.name} - фото ${index + 1}`}
                        className="h-full w-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => window.open(photo, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Facilities */}
          {school.facilities && school.facilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Инфраструктура</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {school.facilities.map((facility: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{facility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Open Positions */}
          {school.openPositions && school.openPositions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Открытые вакансии</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {school.openPositions.map((position: any) => (
                    <div key={position.id} className="p-3 border rounded-md">
                      <h4 className="font-medium">{position.title}</h4>
                      {position.schedule && (
                        <p className="text-sm text-muted-foreground mt-1">
                          График: {position.schedule}
                        </p>
                      )}
                      {position.salary && (
                        <p className="text-sm text-muted-foreground">
                          Зарплата: {position.salary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Связаться со школой</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                Отправить сообщение
              </Button>
              <Button variant="outline" className="w-full">
                Подать заявку
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Просмотры:</span>
                <span className="text-sm font-medium">{school.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Активные вакансии:</span>
                <span className="text-sm font-medium">{school.openPositions ? school.openPositions.length : schoolVacancies.length}</span>
              </div>
              {school.applications !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Заявки:</span>
                  <span className="text-sm font-medium">{school.applications}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfileDetailPage;
