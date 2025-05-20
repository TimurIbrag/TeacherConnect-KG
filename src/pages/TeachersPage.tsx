
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { teachersData, subjects, experienceOptions, locations } from '@/data/mockData';
import TeacherCard from '@/components/TeacherCard';
import TeacherSkeletonLoader from '@/components/TeacherSkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Search, Filter, X, MapPin, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TeachersPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  
  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      applyFilters();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle filters
  const applyFilters = () => {
    const filtered = teachersData.filter((teacher) => {
      const matchesSearch = !searchTerm || 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !subjectFilter || teacher.specialization === subjectFilter;
      const matchesExperience = !experienceFilter || teacher.experience === experienceFilter;
      const matchesLocation = !locationFilter || teacher.location === locationFilter;
      
      return matchesSearch && matchesSubject && matchesExperience && matchesLocation;
    });
    
    setFilteredTeachers(filtered);
  };
  
  // Apply filters when any filter changes
  useEffect(() => {
    if (!isLoading) {
      applyFilters();
    }
  }, [searchTerm, subjectFilter, experienceFilter, locationFilter]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setExperienceFilter('');
    setLocationFilter('');
    
    toast({
      title: "Фильтры сброшены",
      description: "Показаны все учителя",
    });
  };
  
  // Show map selection for location
  const showLocationMap = () => {
    toast({
      title: "Выбор на карте",
      description: "Функция выбора локации на карте будет добавлена в ближайшее время",
    });
  };
  
  // Check if any filter is active
  const hasActiveFilters = searchTerm || subjectFilter || experienceFilter || locationFilter;
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('teachers.title')}</h1>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {t('button.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Поиск</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Имя или предмет..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('teachers.filter.subject')}</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите предмет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все предметы</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('teachers.filter.experience')}</label>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите опыт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Любой опыт</SelectItem>
                  {experienceOptions.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('teachers.filter.location')}</label>
              <div className="flex gap-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите город" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все города</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={showLocationMap}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="flex items-center"
              >
                <X className="mr-1 h-4 w-4" />
                Очистить фильтры
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          {isLoading ? 'Загрузка...' : `Найдено учителей: ${filteredTeachers.length}`}
        </p>
      </div>
      
      {isLoading ? (
        // Skeleton loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <TeacherSkeletonLoader key={index} />
          ))}
        </div>
      ) : filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              id={teacher.id}
              name={teacher.name}
              photo={teacher.photo}
              specialization={teacher.specialization}
              experience={teacher.experience}
              location={teacher.location}
              ratings={teacher.ratings}
              views={teacher.views}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <X className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Учителя не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или сбросить фильтры
          </p>
          <Button 
            variant="outline"
            onClick={clearFilters}
            className="mt-4"
          >
            Сбросить все фильтры
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
