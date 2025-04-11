
import React, { useState } from 'react';
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
import { Search, Filter, X, CheckSquare } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SchoolsPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [housingFilter, setHousingFilter] = useState(false);
  
  // Handle filters
  const filteredSchools = schoolsData.filter((school) => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          school.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || school.type === typeFilter;
    
    // Check if the school's address includes the locationFilter instead of looking for a location property
    const matchesLocation = !locationFilter || school.address.includes(locationFilter);
    
    const matchesHousing = !housingFilter || school.housing === true;
    
    return matchesSearch && matchesType && matchesLocation && matchesHousing;
  });
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setLocationFilter('');
    setHousingFilter(false);
  };
  
  // Check if any filter is active
  const hasActiveFilters = searchTerm || typeFilter || locationFilter || housingFilter;
  
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
                  <SelectItem value="all">Все типы</SelectItem>
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
                  <SelectItem value="all">Все города</SelectItem>
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Школы не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или сбросить фильтры
          </p>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;
