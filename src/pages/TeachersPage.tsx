
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
import { Search, Filter, X, MapPin, CheckSquare, Navigation } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';

// Interface for coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

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
  
  // Distance filter states
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [showDistanceInResults, setShowDistanceInResults] = useState(false);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Distance radius options in km
  const radiusOptions = [1, 3, 5, 7, 10, 13, 15, 20, 25, 30];
  
  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Ошибка",
        description: "Геолокация не поддерживается вашим браузером",
        variant: "destructive"
      });
      return;
    }
    
    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ latitude, longitude });
        setIsLocationPermissionGranted(true);
        setShowDistanceInResults(true);
        
        toast({
          title: "Местоположение определено",
          description: "Фильтр по расстоянию активирован"
        });
        setIsGettingLocation(false);
        // Close drawer if open
        if (isDrawerOpen) setIsDrawerOpen(false);
      },
      (error) => {
        toast({
          title: "Ошибка определения местоположения",
          description: error.message,
          variant: "destructive"
        });
        setIsGettingLocation(false);
      }
    );
  };
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  };
  
  // Random coordinates for teachers (in real app, this would come from the database)
  const getTeacherCoordinates = (location: string): Coordinates => {
    // Using random coordinates around typical Kyrgyzstan cities
    // This is mock data for demonstration purposes
    const baseCoordinates: {[key: string]: Coordinates} = {
      'Бишкек': { latitude: 42.8746, longitude: 74.5698 },
      'Ош': { latitude: 40.5283, longitude: 72.7985 },
      'Каракол': { latitude: 42.4907, longitude: 78.3936 },
      'Джалал-Абад': { latitude: 40.9333, longitude: 73.0000 },
      'Нарын': { latitude: 41.4300, longitude: 75.9911 },
    };
    
    const base = baseCoordinates[location] || baseCoordinates['Бишкек'];
    
    // Add some randomness to create different locations within the city
    const randomOffset = () => (Math.random() - 0.5) * 0.05; // Approx 5km offset
    
    return {
      latitude: base.latitude + randomOffset(),
      longitude: base.longitude + randomOffset()
    };
  };
  
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
      // Basic filters
      const matchesSearch = !searchTerm || 
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !subjectFilter || teacher.specialization === subjectFilter;
      const matchesExperience = !experienceFilter || teacher.experience === experienceFilter;
      const matchesLocation = !locationFilter || teacher.location === locationFilter;
      
      // Distance filter
      let matchesDistance = true;
      if (userCoordinates && distanceFilter) {
        const teacherCoords = getTeacherCoordinates(teacher.location);
        const distance = calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          teacherCoords.latitude,
          teacherCoords.longitude
        );
        
        // Store the calculated distance on the teacher object for display
        (teacher as any).distance = distance;
        
        // Check if the teacher is within the selected radius
        matchesDistance = distance <= distanceFilter;
      }
      
      return matchesSearch && matchesSubject && matchesExperience && matchesLocation && matchesDistance;
    });
    
    setFilteredTeachers(filtered);
  };
  
  // Apply filters when any filter changes
  useEffect(() => {
    if (!isLoading) {
      applyFilters();
    }
  }, [searchTerm, subjectFilter, experienceFilter, locationFilter, distanceFilter, userCoordinates]);
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setExperienceFilter('');
    setLocationFilter('');
    setDistanceFilter(null);
    
    toast({
      title: "Фильтры сброшены",
      description: "Показаны все учителя",
    });
  };
  
  // Clear just the distance filter
  const clearDistanceFilter = () => {
    setDistanceFilter(null);
    setShowDistanceInResults(false);
    
    toast({
      description: "Фильтр по расстоянию отключен",
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
  const hasActiveFilters = searchTerm || subjectFilter || experienceFilter || locationFilter || distanceFilter;
  
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
          
          {/* Distance Filter - Desktop */}
          <div className="mt-4 hidden md:block">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Расстояние
              </label>
              
              {userCoordinates ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {radiusOptions.map((radius) => (
                    <Button
                      key={radius}
                      variant={distanceFilter === radius ? "default" : "outline"}
                      size="sm"
                      onClick={() => setDistanceFilter(radius)}
                      className={distanceFilter === radius ? "bg-primary" : ""}
                    >
                      {radius} км
                    </Button>
                  ))}
                  {distanceFilter && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearDistanceFilter}
                      className="ml-2"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Сбросить
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getUserLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? "Определение..." : "Определить моё местоположение"}
                </Button>
              )}
            </div>
          </div>
          
          {/* Distance Filter - Mobile */}
          <div className="mt-4 md:hidden">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  {distanceFilter ? `В радиусе ${distanceFilter} км` : "Фильтр по расстоянию"}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Фильтр по расстоянию</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 py-2">
                  {userCoordinates ? (
                    <div className="space-y-4">
                      <p className="text-sm text-center">Выберите радиус поиска:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {radiusOptions.map((radius) => (
                          <Button
                            key={radius}
                            variant={distanceFilter === radius ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setDistanceFilter(radius);
                              setIsDrawerOpen(false);
                            }}
                          >
                            {radius} км
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <p className="text-sm text-center text-muted-foreground">
                        Чтобы активировать фильтр по расстоянию, нужно определить ваше местоположение
                      </p>
                      <Button
                        variant="default"
                        onClick={getUserLocation}
                        disabled={isGettingLocation}
                        className="w-full"
                      >
                        {isGettingLocation ? "Определение..." : "Определить местоположение"}
                      </Button>
                    </div>
                  )}
                </div>
                <DrawerFooter>
                  {distanceFilter && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        clearDistanceFilter();
                        setIsDrawerOpen(false);
                      }}
                    >
                      Сбросить фильтр по расстоянию
                    </Button>
                  )}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
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
              distance={showDistanceInResults ? (teacher as any).distance : undefined}
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
