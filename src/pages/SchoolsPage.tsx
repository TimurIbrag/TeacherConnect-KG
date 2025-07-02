
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSchools } from '@/hooks/useSupabaseData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, Building, Home } from 'lucide-react';
import SchoolCard from '@/components/SchoolCard';
import SchoolSkeletonLoader from '@/components/SchoolSkeletonLoader';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SchoolsPage: React.FC = () => {
  const { t } = useLanguage();
  const { data: supabaseSchools = [], isLoading } = useSchools();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedHousing, setSelectedHousing] = useState('');
  const [publishedSchools, setPublishedSchools] = useState<any[]>([]);

  // Get all vacancies to count them per school
  const { data: allVacancies = [] } = useQuery({
    queryKey: ['all-active-vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select('school_id')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching vacancies:', error);
        return [];
      }

      return data || [];
    },
  });

  // Load published schools from localStorage and listen for changes
  useEffect(() => {
    // DISABLED - No longer loading any localStorage data for schools
    // Force clear any existing localStorage data that might contain false profiles
    const keysToRemove = [
      'publishedSchools',
      'allPublishedSchools', 
      'schoolProfilePublished',
      'schoolProfileData'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    setPublishedSchools([]);
  }, []);

  // Only show published schools from localStorage and Supabase schools (no mock data)
  const allSchools = [
    // Published schools from dashboard (localStorage)
    ...publishedSchools,
    // Supabase schools
    ...supabaseSchools.map((school: any) => {
      const vacancyCount = allVacancies.filter(v => v.school_id === school.id).length;
      
      return {
        id: school.id,
        name: school.school_name || school.profiles?.full_name || 'School',
        photo: school.photo_urls?.[0] || '/placeholder.svg',
        address: school.address || 'Address not provided',
        type: school.school_type || 'Государственная',
        specialization: school.description || 'General Education',
        openPositions: Array.from({ length: vacancyCount }, (_, i) => ({
          id: i,
          title: `Vacancy ${i + 1}`,
        })),
        ratings: 4.0,
        views: 0,
        housing: school.housing_provided || false,
        locationVerified: school.location_verified || false,
        city: school.city || 'Бишкек'
      };
    })
  ];

  const districts = [
    'Ленинский район',
    'Первомайский район', 
    'Октябрьский район',
    'Свердловский район'
  ];

  const schoolTypes = [
    'Государственная',
    'Частная',
    'Международная',
    'Специализированная'
  ];

  const cities = [
    'Бишкек',
    'Ош',
    'Джалал-Абад',
    'Каракол',
    'Токмок',
    'Кара-Балта',
    'Балыкчы',
    'Кызыл-Кия',
    'Баткен',
    'Нарын',
    'Талас',
    'Кант',
    'Таш-Кумыр',
    'Кочкор-Ата',
    'Исфана',
    'Сулюкта',
    'Ноокат',
    'Чолпон-Ата',
    'Ат-Башы',
    'Токтогул',
    'Ала-Бука',
    'Кемин',
    'Таш-Короо',
    'Уч-Коргон',
    'Ак-Суу',
    'Шопоков'
  ];

  const filteredSchools = allSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || school.address.includes(selectedDistrict);
    const matchesType = !selectedType || school.type === selectedType;
    const matchesCity = !selectedCity || school.city === selectedCity || school.address.includes(selectedCity);
    const matchesHousing = !selectedHousing || 
      (selectedHousing === 'true' && school.housing) || 
      (selectedHousing === 'false' && !school.housing);
    
    return matchesSearch && matchesDistrict && matchesType && matchesCity && matchesHousing;
  });

  if (isLoading) {
    return (
      <div className="container px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SchoolSkeletonLoader key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('schools.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Найдено {filteredSchools.length} {filteredSchools.length === 1 ? 'школа' : 'школ'}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('schools.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <SelectValue placeholder="Город" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все города</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <SelectValue placeholder="Район" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все районы</SelectItem>
            {districts.map(district => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <SelectValue placeholder="Тип школы" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все типы</SelectItem>
            {schoolTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedHousing} onValueChange={setSelectedHousing}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <SelectValue placeholder="Жилье" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Все варианты</SelectItem>
            <SelectItem value="true">С жильем</SelectItem>
            <SelectItem value="false">Без жилья</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(selectedDistrict || selectedType || selectedCity || selectedHousing) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCity && (
            <Badge variant="secondary" className="gap-1">
              {selectedCity}
              <button onClick={() => setSelectedCity('')} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
          {selectedDistrict && (
            <Badge variant="secondary" className="gap-1">
              {selectedDistrict}
              <button onClick={() => setSelectedDistrict('')} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
          {selectedType && (
            <Badge variant="secondary" className="gap-1">
              {selectedType}
              <button onClick={() => setSelectedType('')} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
          {selectedHousing && (
            <Badge variant="secondary" className="gap-1">
              {selectedHousing === 'true' ? 'С жильем' : 'Без жилья'}
              <button onClick={() => setSelectedHousing('')} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Schools Grid */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => {
            // Ensure proper data mapping for SchoolCard
            const schoolData = {
              id: school.id,
              name: school.name || 'Школа',
              photo: school.photo || '/placeholder.svg',
              address: school.address || 'Адрес не указан',
              type: school.type || 'Государственная',
              specialization: school.specialization || 'Общее образование',
              openPositions: school.openPositions || [],
              ratings: school.ratings || 4.0,
              views: school.views || 0,
              housing: school.housing || false,
              distance: school.distance,
              locationVerified: school.locationVerified || false,
              city: school.city || 'Бишкек'
            };
            
            return (
              <SchoolCard key={`${school.id}-${school.name}`} {...schoolData} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Школы не найдены</h3>
          <p className="text-muted-foreground mb-4">
            Попробуйте изменить параметры поиска или фильтры
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('');
              setSelectedType('');
              setSelectedCity('');
              setSelectedHousing('');
            }}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;
