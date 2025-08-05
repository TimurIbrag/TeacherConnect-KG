
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSchools } from '@/hooks/useSchools';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter, Building, Home, BookOpen } from 'lucide-react';
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
  const [selectedSubject, setSelectedSubject] = useState('');
  const [publishedSchools, setPublishedSchools] = useState<any[]>([]);

  // Get all vacancies to count them per school
  const { data: allVacancies = [] } = useQuery({
    queryKey: ['all-active-vacancies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacancies')
        .select(`
          school_id,
          subject,
          school_profiles!inner (
            is_published
          )
        `)
        .eq('is_active', true)
        .eq('school_profiles.is_published', true);  // Only count vacancies from published schools

      if (error) {
        console.error('Error fetching vacancies:', error);
        return [];
      }

      return data || [];
    },
  });

  // Load and display schools from Supabase - published schools only
  useEffect(() => {
    // Clean up old localStorage data - no longer needed
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

  // Show schools from Supabase only (published schools)
  const allSchools = supabaseSchools.map((school: any) => {
    const vacancyCount = allVacancies.filter(v => v.school_id === school.id).length;
    
    return {
      id: school.id,
      name: school.school_name || 'School', // Remove profiles reference
      photo: school.photo_urls?.[0] || null, // No default photos
      photos: school.photo_urls || [],
      address: school.address || 'Address not provided',
      type: school.school_type || 'Государственная',
      specialization: school.description || 'General Education',
      description: school.description || '',
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
  });

  const districts = [
    t('schools.districts.leninsky'),
    t('schools.districts.pervomaisky'), 
    t('schools.districts.oktyabrsky'),
    t('schools.districts.sverdlovsky')
  ];

  const schoolTypes = [
    t('schools.types.public'),
    t('schools.types.private'),
    t('schools.types.specialized')
  ];

  const cities = [
    t('cities.bishkek'),
    t('cities.osh'),
    t('cities.jalalabad'),
    t('cities.karakol'),
    t('cities.tokmok'),
    t('cities.karabalta'),
    t('cities.balykchy'),
    t('cities.kyzylkiya'),
    t('cities.batken'),
    t('cities.naryn'),
    t('cities.talas'),
    t('cities.kant'),
    t('cities.tashkumyr'),
    t('cities.kochkorata'),
    t('cities.isfana'),
    t('cities.sulukta'),
    t('cities.nookat'),
    t('cities.cholponata'),
    t('cities.atbashi'),
    t('cities.toktogul'),
    t('cities.alabuka'),
    t('cities.kemin'),
    t('cities.tashkoro'),
    t('cities.uchkorgon'),
    t('cities.aksuu'),
    t('cities.shopokov')
  ];

  const subjects = [
    t('subjects.russian'),
    t('subjects.russianLiterature'),
    t('subjects.kyrgyz'),
    t('subjects.kyrgyzLiterature'),
    t('subjects.english'),
    t('subjects.german'),
    t('subjects.turkish'),
    t('subjects.chinese'),
    t('subjects.mathematics'),
    t('subjects.algebraGeometry'),
    t('subjects.physics'),
    t('subjects.chemistry'),
    t('subjects.biology'),
    t('subjects.geography'),
    t('subjects.history'),
    t('subjects.socialStudies'),
    t('subjects.computerScience'),
    t('subjects.physicalEducation'),
    t('subjects.art'),
    t('subjects.music'),
    t('subjects.technology'),
    t('subjects.lifeSafety')
  ];

  // Get vacancy subjects for this school
  const getSchoolVacancySubjects = (schoolId: string) => {
    return allVacancies
      .filter(v => v.school_id === schoolId)
      .map(v => v.subject)
      .filter(Boolean);
  };

  const filteredSchools = allSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || school.address.includes(selectedDistrict);
    const matchesType = !selectedType || school.type === selectedType;
    const matchesCity = !selectedCity || school.city === selectedCity || school.address.includes(selectedCity);
    const matchesHousing = !selectedHousing || 
      (selectedHousing === 'true' && school.housing) || 
      (selectedHousing === 'false' && !school.housing);
    
    // Filter by subject - check if school has vacancies with the selected subject
    const matchesSubject = !selectedSubject || 
      getSchoolVacancySubjects(school.id).some(subject => 
        subject && subject.toLowerCase().includes(selectedSubject.toLowerCase())
      );
    
    return matchesSearch && matchesDistrict && matchesType && matchesCity && matchesHousing && matchesSubject;
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
            {t('schools.foundCount').replace('{{count}}', filteredSchools.length.toString())}
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
              <SelectValue placeholder={t('schools.filters.city')} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('schools.filters.allCities')}</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <SelectValue placeholder={t('schools.filters.district')} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('schools.filters.allDistricts')}</SelectItem>
            {districts.map(district => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <SelectValue placeholder={t('schools.filters.schoolType')} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('schools.filters.allTypes')}</SelectItem>
            {schoolTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedHousing} onValueChange={setSelectedHousing}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <SelectValue placeholder={t('schools.filters.housing')} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('schools.filters.allOptions')}</SelectItem>
            <SelectItem value="true">{t('schools.filters.withHousing')}</SelectItem>
            <SelectItem value="false">{t('schools.filters.withoutHousing')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-full md:w-48">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <SelectValue placeholder={t('schools.filters.subjects')} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t('schools.filters.allSubjects')}</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(selectedDistrict || selectedType || selectedCity || selectedHousing || selectedSubject) && (
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
              {selectedHousing === 'true' ? t('schools.filters.withHousing') : t('schools.filters.withoutHousing')}
              <button onClick={() => setSelectedHousing('')} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          )}
          {selectedSubject && (
            <Badge variant="secondary" className="gap-1">
              {selectedSubject}
              <button onClick={() => setSelectedSubject('')} className="ml-1 hover:text-destructive">
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
              name: school.name || t('schools.defaultName'),
              photo: school.photo || null,
              photos: school.photos || [],
              address: school.address || t('schools.addressNotProvided'),
              type: school.type || t('schools.types.public'),
              specialization: school.specialization || t('schools.defaultSpecialization'),
              description: school.description || '',
              openPositions: school.openPositions || [],
              ratings: school.ratings || 4.0,
              views: school.views || 0,
              housing: school.housing || false,
              distance: undefined, // Distance not calculated
              locationVerified: school.locationVerified || false,
              city: school.city || t('cities.bishkek')
            };
            
            return (
              <SchoolCard key={`${school.id}-${school.name}`} {...schoolData} />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">{t('schools.notFound')}</h3>
          <p className="text-muted-foreground mb-4">
            {t('schools.tryChangeSearch')}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('');
              setSelectedType('');
              setSelectedCity('');
              setSelectedHousing('');
              setSelectedSubject('');
            }}
          >
            {t('common.reset')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;
