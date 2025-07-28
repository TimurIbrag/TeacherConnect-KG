
import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useTeachers } from '@/hooks/useTeachers';
import { useSchools } from '@/hooks/useSchools';
import { useActiveVacancies } from '@/hooks/useVacancies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, School, MapPin, DollarSign, Calendar, Users, BookOpen, ArrowRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';


const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { user, profile, loading } = useAuth();
  const { data: featuredVacancies, isLoading: vacanciesLoading, error: vacanciesError } = useActiveVacancies(6);
  const { data: teachersResult, isLoading: teachersLoading, error: teachersError } = useTeachers();
  const { data: featuredSchools, isLoading: schoolsLoading, error: schoolsError } = useSchools();
  const { toast } = useToast();

  // Handle OAuth redirects and authentication flow
  useEffect(() => {
    console.log('🔄 HomePage auth state:', { 
      user: !!user, 
      profile: !!profile, 
      loading,
      userEmail: user?.email,
      profileRole: profile?.role,
      currentUrl: window.location.href,
      searchParams: window.location.search
    });
    
    // Check for OAuth error in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    if (error) {
      console.error('❌ OAuth error detected:', { error, errorDescription });
      toast({
        title: "Ошибка аутентификации",
        description: errorDescription || error,
        variant: "destructive"
      });
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    // If user is authenticated but has no profile or incomplete profile, redirect to user type selection
    if (user && !loading && (!profile || !profile.role)) {
      console.log('🔄 User authenticated but profile incomplete, redirecting to user type selection');
      navigate('/user-type-selection');
      return;
    }
    
    // If user is authenticated and has complete profile, let them stay on home page
    if (user && profile && profile.role) {
      console.log('🔄 User authenticated with complete profile');
      return;
    }
    
    // If not authenticated, let them stay on home page
    if (!user && !loading) {
      console.log('🔄 User not authenticated, staying on home page');
      return;
    }
    
    console.log('⏳ Waiting for authentication to complete...');
  }, [user, profile, loading, navigate, toast]);

  // Add console logs for debugging
  console.log('HomePage data:', {
    featuredVacancies: featuredVacancies?.length || 0,
    teachers: teachersResult?.data?.length || 0,
    schools: featuredSchools?.length || 0,
    vacanciesError,
    teachersError,
    schoolsError,
    vacanciesLoading,
    teachersLoading,
    schoolsLoading
  });

  // Debug individual data
  if (featuredVacancies) {
    console.log('Featured vacancies:', featuredVacancies);
  }
  if (teachersResult?.data) {
    console.log('Teachers data:', teachersResult.data);
  }
  if (featuredSchools) {
    console.log('Featured schools:', featuredSchools);
  }

  // Take first 3 items for featured sections
  const limitedTeachers = teachersResult?.data?.slice(0, 3) || [];
  const limitedSchools = featuredSchools?.slice(0, 3) || [];
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('vacancy.negotiable');
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${t('currency.som')}`;
    if (min) return `${t('vacancy.from')} ${min.toLocaleString()} ${t('currency.som')}`;
    if (max) return `${t('vacancy.upTo')} ${max.toLocaleString()} ${t('currency.som')}`;
    return t('vacancy.notSpecified');
  };
  
  const handleAddVacancy = () => {
    if (profile?.role === 'school') {
      navigate('/dashboard/school');
    } else {
      navigate('/login');
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/teachers">
                <Search className="mr-2 h-5 w-5" />
                {t('home.hero.findTeachers')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/schools">
                <School className="mr-2 h-5 w-5" />
                {t('home.hero.findVacancies')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {teachersResult?.data?.length || 0}+
              </div>
              <p className="text-gray-600">{t('home.stats.teachers')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {featuredSchools?.length || 0}+
              </div>
              <p className="text-gray-600">{t('home.stats.schools')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {featuredVacancies?.length || 0}+
              </div>
              <p className="text-gray-600">{t('home.stats.vacancies')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vacancies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.vacancies.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.vacancies.subtitle')}
            </p>
          </div>

          {vacanciesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredVacancies?.map(vacancy => (
                <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                    <CardDescription>
                      {vacancy.school_profiles?.school_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vacancy.location || t('vacancy.locationNotSpecified')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatSalary(vacancy.salary_min, vacancy.salary_max)}</span>
                    </div>

                    {vacancy.employment_type && (
                      <Badge variant="secondary">
                        {vacancy.employment_type}
                      </Badge>
                    )}

                    {vacancy.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {vacancy.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild>
              <Link to="/schools">
                {t('home.vacancies.viewAllVacancies')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Teachers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.teachers.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.teachers.subtitle')}
            </p>
          </div>

          {teachersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {limitedTeachers.map(teacher => (
                <Card key={teacher.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {teacher.profiles?.full_name?.charAt(0) || 'T'}
                    </div>
                    <CardTitle>{teacher.profiles?.full_name || t('teacher.nameNotSpecified')}</CardTitle>
                    <CardDescription>{teacher.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {teacher.experience_years && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4" />
                        <span>{teacher.experience_years} {t('teacher.yearsOfExperience')}</span>
                      </div>
                    )}
                    {teacher.location && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{teacher.location}</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/teachers/${teacher.id}`}>{t('common.more')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild>
              <Link to="/teachers">
                {t('home.teachers.viewAllTeachers')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Schools */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.schools.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.schools.subtitle')}
            </p>
          </div>

          {schoolsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {limitedSchools.map(school => (
                <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                    {school.photo_urls && school.photo_urls[0] ? (
                      <img 
                        src={school.photo_urls[0]} 
                        alt={school.school_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-4xl font-bold">
                        {school.school_name?.charAt(0) || 'S'}
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{school.school_name}</CardTitle>
                    <CardDescription>{school.school_type}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {school.address && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{school.address}</span>
                      </div>
                    )}
                    {school.student_count && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{school.student_count} {t('school.students')}</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/schools/${school.id}`}>{t('common.more')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild>
              <Link to="/schools">
                {t('home.schools.viewAllSchools')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleAddVacancy}>
              {t('cta.addVacancy')}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/vacancies')} className="text-slate-500">
              {t('cta.findJob')}
            </Button>
          </div>
        </div>
      </section>
      

    </div>
  );
};

export default HomePage;
