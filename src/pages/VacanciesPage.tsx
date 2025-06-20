
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, Clock, GraduationCap, Building2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/context/LanguageContext';

const VacanciesPage = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [locationFilter, setLocationFilter] = React.useState('');

  const { data: vacancies = [], isLoading } = useQuery({
    queryKey: ['public-vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          *,
          school_profiles (
            school_name,
            address,
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

      return data || [];
    },
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
      eur: '€'
    };
    return symbols[currency as keyof typeof symbols] || '₽';
  };

  const formatSalary = (vacancy: any) => {
    const { salary_min, salary_max, salary_currency = 'rub' } = vacancy;
    const symbol = getCurrencySymbol(salary_currency);
    
    if (!salary_min && !salary_max) return 'По договоренности';
    if (salary_min && salary_max) return `${salary_min.toLocaleString()} - ${salary_max.toLocaleString()} ${symbol}`;
    if (salary_min) return `от ${salary_min.toLocaleString()} ${symbol}`;
    if (salary_max) return `до ${salary_max.toLocaleString()} ${symbol}`;
    return 'Не указана';
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
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{vacancy.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{getEmploymentTypeLabel(vacancy.employment_type)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{getEducationLevelLabel(vacancy.education_level || 'any')}</span>
                  </div>
                </div>

                {vacancy.description && (
                  <div>
                    <h4 className="font-medium mb-2">Описание</h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {vacancy.description}
                    </p>
                  </div>
                )}

                {vacancy.requirements && vacancy.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Требования</h4>
                    <div className="flex flex-wrap gap-1">
                      {vacancy.requirements.slice(0, 3).map((req: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                      {vacancy.requirements.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{vacancy.requirements.length - 3} еще
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Опубликовано: {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Подробнее
                    </Button>
                    <Button size="sm">
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
