import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Star, Eye, Briefcase, Globe, Home, CheckCircle, Building } from 'lucide-react';
import { schoolsData } from '@/data/mockData';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SchoolProfileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Add query for school's active vacancies
  const { data: schoolVacancies = [] } = useQuery({
    queryKey: ['school-vacancies', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error } = await supabase
        .from('vacancies')
        .select('*')
        .eq('school_id', id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching school vacancies:', error);
        return [];
      }

      return data || [];
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

  const formatSalary = (vacancy: any) => {
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
    const loadSchoolData = () => {
      // Try to find school in published schools first
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      let foundSchool = publishedSchools.find((s: any) => s.id.toString() === id);

      // If not found in published, check mock data
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
            applications: foundSchool.applications || 0
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
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span>{school.ratings}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span>{school.views} просмотров</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-primary font-medium">
                    {school.openPositions?.length || 0} вакансий
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add active vacancies section */}
      {schoolVacancies.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Открытые вакансии ({schoolVacancies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolVacancies.map((vacancy) => (
                <div key={vacancy.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{vacancy.title}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{getVacancyTypeLabel(vacancy.vacancy_type)}</Badge>
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
                <span className="text-sm text-muted-foreground">Рейтинг:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-medium">{school.ratings}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Просмотры:</span>
                <span className="text-sm font-medium">{school.views}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Активные вакансии:</span>
                <span className="text-sm font-medium">{school.openPositions?.length || 0}</span>
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
