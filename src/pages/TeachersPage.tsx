
import { useState, useEffect } from 'react';
import { TeacherCard } from '@/components/TeacherCard';
import { TeacherSkeletonLoader } from '@/components/TeacherSkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, MapPin, Star, Clock, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTeachers } from '@/hooks/useTeachers';

const ITEMS_PER_PAGE = 12;

export default function TeachersPage() {
  const { data: teachers, isLoading, error } = useTeachers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort teachers
  const filteredTeachers = teachers?.filter(teacher => {
    const profile = teacher.profiles;
    const matchesSearch = !searchTerm || 
      profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === 'all' || 
      teacher.specialization === selectedSpecialization;
    
    const matchesLocation = selectedLocation === 'all' || 
      teacher.location?.includes(selectedLocation);
    
    const matchesExperience = selectedExperience === 'all' || 
      (teacher.experience_years && teacher.experience_years >= parseInt(selectedExperience));

    return matchesSearch && matchesSpecialization && matchesLocation && matchesExperience;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.view_count || 0) - (a.view_count || 0);
      case 'experience':
        return (b.experience_years || 0) - (a.experience_years || 0);
      case 'name':
        return (a.profiles?.full_name || '').localeCompare(b.profiles?.full_name || '');
      default:
        return 0;
    }
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Get unique values for filters
  const specializations = [...new Set(teachers?.map(t => t.specialization).filter(Boolean))];
  const locations = [...new Set(teachers?.map(t => t.location).filter(Boolean))];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSpecialization, selectedLocation, selectedExperience, sortBy]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Teachers</h2>
          <p className="text-gray-600">Sorry, we couldn't load the teachers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Teacher
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover qualified educators ready to help you achieve your learning goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teachers or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Specialization Filter */}
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {specializations.map(spec => (
                  <SelectItem key={spec} value={spec || ''}>{spec}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc || ''}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Filter */}
            <Select value={selectedExperience} onValueChange={setSelectedExperience}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Experience</SelectItem>
                <SelectItem value="1">1+ Years</SelectItem>
                <SelectItem value="3">3+ Years</SelectItem>
                <SelectItem value="5">5+ Years</SelectItem>
                <SelectItem value="10">10+ Years</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Most Popular</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {isLoading ? 'Loading...' : `${filteredTeachers.length} teachers found`}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Teachers Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <TeacherSkeletonLoader key={index} />
            ))}
          </div>
        ) : paginatedTeachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedTeachers.map((teacher) => {
              const profile = teacher.profiles;
              
              // Transform teacher data to match TeacherCard expectations
              const teacherData = {
                id: teacher.id,
                name: profile?.full_name || 'Anonymous Teacher',
                photo: profile?.avatar_url || '/placeholder.svg',
                specialization: teacher.specialization || 'General',
                experience: teacher.experience_years ? `${teacher.experience_years} years` : 'Not specified',
                location: teacher.location || 'Location not specified',
                ratings: 4.5, // Default rating
                views: teacher.view_count || 0,
                about: teacher.bio || 'No description available',
                education: teacher.education || 'Not specified',
                languages: ['English'], // Default language
                achievements: 'Professional Teacher',
                preferredSchedule: teacher.schedule_details ? 
                  `${teacher.schedule_details.preferred_time || 'Flexible'} - ${teacher.schedule_details.days_available || 'Any day'}` : 
                  'Flexible schedule',
                desiredSalary: 'Contact for details',
                preferredDistricts: [teacher.location || 'Any location'],
                applications: 0,
                // Add fields that might be used elsewhere
                date_of_birth: teacher.date_of_birth,
                certificates: teacher.certificates || [],
                resume_url: teacher.resume_url,
                schedule_details: teacher.schedule_details,
                last_seen_at: profile?.last_seen_at
              };

              return (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacherData}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Teachers Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialization('all');
                  setSelectedLocation('all');
                  setSelectedExperience('all');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          </div>
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
    </div>
  );
}
