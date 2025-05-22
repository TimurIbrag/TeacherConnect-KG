
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { schoolsData, schoolTypes, locations } from '@/data/mockData';
import SchoolCard from '@/components/SchoolCard';
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
import { Search, Filter, X, CheckSquare, Navigation } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';

// Interface for coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

const SchoolsPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [housingFilter, setHousingFilter] = useState(false);
  
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
  
  // Get school coordinates (in a real app, this would come from the database)
  const getSchoolCoordinates = (address: string): Coordinates => {
    // Using random coordinates around typical Kyrgyzstan cities
    // This is mock data for demonstration purposes
    const baseCoordinates: {[key: string]: Coordinates} = {
      'Бишкек': { latitude: 42.8746, longitude: 74.5698 },
      'Ош': { latitude: 40.5283, longitude: 72.7985 },
      'Каракол': { latitude: 42.4907, longitude: 78.3936 },
      'Джалал-Абад': { latitude: 40.9333, longitude: 73.0000 },
      'Нарын': { latitude: 41.4300, longitude: 75.9911 },
    };
    
    // Find which city is in the address
    const city = Object.keys(baseCoordinates).find(city => address.includes(city)) || 'Бишкек';
    const base = baseCoordinates[city];
    
    // Add some randomness to create different locations within the city
    const randomOffset = () => (Math.random() - 0.5) * 0.05; // Approx 5km offset
    
    return {
      latitude: base.latitude + randomOffset(),
      longitude: base.longitude + randomOffset()
    };
  };
  
  // Handle filters
  const filteredSchools = schoolsData.filter((school) => {
    // Basic filters
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          school.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || school.type === typeFilter;
    const matchesLocation = !locationFilter || school.address.includes(locationFilter);
    const matchesHousing = !housingFilter || school.housing === true;
    
    // Distance filter
    let matchesDistance = true;
    if (userCoordinates && distanceFilter) {
      const schoolCoords = getSchoolCoordinates(school.address);
      const distance = calculateDistance(
        userCoordinates.latitude,
        userCoordinates.longitude,
        schoolCoords.latitude,
        schoolCoords.longitude
      );
      
      // Store the calculated distance on the school object for display
      (school as any).distance = distance;
      
      // Check if the school is within the selected radius
      matchesDistance = distance <= distanceFilter;
    }
    
    return matchesSearch && matchesType && matchesLocation && matchesHousing && matchesDistance;
  });
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setLocationFilter('');
    setHousingFilter(false);
    setDistanceFilter(null);
    
    toast({
      title: "Фильтры сброшены",
      description: "Показаны все школы",
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
  
  // Check if any filter is active
  const hasActiveFilters = searchTerm || typeFilter || locationFilter || housingFilter || distanceFilter;
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t('schools.title')}</h1>
      
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
                  placeholder="Название или специализация..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('schools.filter.type')}</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все типы</SelectItem>
                  {schoolTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('schools.filter.location')}</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
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
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2 h-10">
                <Switch 
                  id="housing" 
                  checked={housingFilter}
                  onCheckedChange={setHousingFilter}
                />
                <Label htmlFor="housing" className="flex items-center cursor-pointer">
                  <CheckSquare className="mr-1 h-4 w-4" />
                  С жильем
                </Label>
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
          Найдено школ: {filteredSchools.length}
        </p>
      </div>
      
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchools.map((school) => (
            <SchoolCard
              key={school.id}
              id={school.id}
              name={school.name}
              photo={school.photo}
              address={school.address}
              type={school.type}
              specialization={school.specialization}
              openPositions={school.openPositions}
              ratings={school.ratings}
              views={school.views}
              housing={school.housing}
              distance={showDistanceInResults ? (school as any).distance : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Школы не найдены</h3>
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

export default SchoolsPage;
