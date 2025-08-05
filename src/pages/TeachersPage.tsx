import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeachers } from '@/hooks/useTeachers';
import { useTeacherVacancies } from '@/hooks/useTeacherVacancies';
import { useSchools } from '@/hooks/useSchools';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import TeacherCard from '@/components/TeacherCard';
import TeacherSkeletonLoader from '@/components/TeacherSkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, Clock, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

// Predefined districts list
const DISTRICTS = [
  'Ленинский район',
  'Первомайский район',
  'Октябрьский район',
  'Свердловский район'
];

// Example subjects list (should be replaced with real data if available)
const TEACHER_SUBJECTS = [
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'История',
  'География',
  'Английский язык',
  'Русский язык',
  'Кыргызский язык',
  'Информатика',
  'Литература',
  'Физкультура',
];

const TeachersPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  // const { toast } = useToast(); // Uncomment if you use toast
  const [viewMode, setViewMode] = useState<'teachers' | 'services'>('teachers');
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Use paginated teachers
  const {
    data: teachersResult,
    isLoading: teachersLoading,
  } = useTeachers(currentPage, ITEMS_PER_PAGE);
  const teachers = teachersResult?.data || [];
  const totalTeachers = teachersResult?.count || 0;

  const { data: teacherVacancies, isLoading: vacanciesLoading } = useTeacherVacancies();
  const { data: schools, isLoading: schoolsLoading } = useSchools();

  // Filtered services (vacancies)
  const filteredVacancies = useMemo(() => {
    if (!teacherVacancies) return [];
    return teacherVacancies.filter(vacancy => {
      const matchesSearch = !searchTerm ||
        (vacancy.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vacancy.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSubject = !subjectFilter || vacancy.subject === subjectFilter;
      const matchesLocation = !locationFilter || vacancy.location === locationFilter;
      return matchesSearch && matchesSubject && matchesLocation;
    });
  }, [teacherVacancies, searchTerm, subjectFilter, locationFilter]);

  // Pagination for vacancies
  const totalPages = useMemo(() => {
    const count = viewMode === 'teachers' ? totalTeachers : filteredVacancies.length;
    return Math.ceil(count / ITEMS_PER_PAGE);
  }, [viewMode, totalTeachers, filteredVacancies]);

  const paginatedVacancies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVacancies.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVacancies, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, subjectFilter, locationFilter, viewMode]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('teachers.header')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('teachers.subheader')}
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'teachers' ? 'default' : 'ghost'}
            onClick={() => setViewMode('teachers')}
            className="rounded-md"
          >
            {t('teachers.tab')}
          </Button>
          <Button
            variant={viewMode === 'services' ? 'default' : 'ghost'}
            onClick={() => setViewMode('services')}
            className="rounded-md"
          >
            {t('teachers.servicesTab')}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={viewMode === 'teachers' ? t('teachers.searchPlaceholder') : t('teachers.servicesSearchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('teachers.subjectPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все предметы</SelectItem>
              {TEACHER_SUBJECTS.map((subject) => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('teachers.locationPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Все районы</SelectItem>
              {DISTRICTS.map((district) => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchTerm || subjectFilter || locationFilter) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSubjectFilter('');
                setLocationFilter('');
              }}
            >
              {t('common.reset')}
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {viewMode === 'teachers' 
            ? t('teachers.foundCount').replace('{{count}}', String(totalTeachers || 0))
            : t('teachers.servicesFoundCount').replace('{{count}}', String(filteredVacancies?.length || 0))
          }
        </p>
      </div>

      {/* Teachers or Services Grid */}
      {viewMode === 'teachers' ? (
        teachersLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <TeacherSkeletonLoader key={index} />
            ))}
          </div>
        ) : teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {teachers.map((teacher) => {
              // Use the transformed data directly from useTeachers hook
              return (
                <TeacherCard
                  key={teacher.id}
                  id={teacher.id}
                  name={teacher.full_name || 'Anonymous Teacher'}
                  photo={teacher.avatar_url || null}
                  specialization={teacher.specialization || 'General'}
                  experience={teacher.experience_years ? `${teacher.experience_years} years` : 'Not specified'}
                  location={teacher.location || 'Location not specified'}
                  ratings={4.5}
                  views={0}
                  date_of_birth={null}
                  languages={teacher.languages?.map(lang => ({ language: lang, level: 'Native' })) || []}
                  schedule_details={null}
                  last_seen_at={null}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">
              {t('teachers.notFound')}
            </p>
            <p className="text-gray-400">
              {t('teachers.tryChangeSearch')}
            </p>
          </div>
        )
      ) : (
        paginatedVacancies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {/* Render your service/vacancy cards here */}
            {paginatedVacancies.map((vacancy) => (
              <div key={vacancy.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-bold text-lg mb-2">{vacancy.title}</h3>
                <p className="text-gray-600 mb-1">{vacancy.subject}</p>
                <p className="text-gray-500 mb-1">{vacancy.location}</p>
                <p className="text-gray-400 text-sm">{vacancy.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">
              {t('teachers.servicesNotFound')}
            </p>
            <p className="text-gray-400">
              {t('teachers.tryChangeSearch')}
            </p>
          </div>
        )
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
