
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { teachersData, subjects, experienceOptions, locations } from '@/data/mockData';
import TeacherCard from '@/components/TeacherCard';
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
import { Search, Filter, X } from 'lucide-react';

const TeachersPage: React.FC = () => {
  const { t } = useLanguage();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  // Handle filters
  const filteredTeachers = teachersData.filter((teacher) => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !subjectFilter || teacher.specialization === subjectFilter;
    const matchesExperience = !experienceFilter || teacher.experience === experienceFilter;
    const matchesLocation = !locationFilter || teacher.location === locationFilter;
    
    return matchesSearch && matchesSubject && matchesExperience && matchesLocation;
  });
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSubjectFilter('');
    setExperienceFilter('');
    setLocationFilter('');
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
                  <SelectItem value="all">Все предметы</SelectItem>
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
                  <SelectItem value="all">Любой опыт</SelectItem>
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
          Найдено учителей: {filteredTeachers.length}
        </p>
      </div>
      
      {filteredTeachers.length > 0 ? (
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
          <h3 className="text-lg font-medium mb-2">Учителя не найдены</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или сбросить фильтры
          </p>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
