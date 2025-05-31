
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useActiveVacancies, useTeachers, useSchools } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  School, 
  MapPin, 
  DollarSign, 
  Calendar,
  Users,
  BookOpen,
  ArrowRight,
  Search
} from 'lucide-react';

const HomePage = () => {
  const { t } = useLanguage();
  const { data: featuredVacancies, isLoading: vacanciesLoading } = useActiveVacancies(6);
  const { data: featuredTeachers, isLoading: teachersLoading } = useTeachers();
  const { data: featuredSchools, isLoading: schoolsLoading } = useSchools();

  // Take first 3 items for featured sections
  const limitedTeachers = featuredTeachers?.slice(0, 3) || [];
  const limitedSchools = featuredSchools?.slice(0, 3) || [];

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'По договоренности';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ₽`;
    if (min) return `от ${min.toLocaleString()} ₽`;
    if (max) return `до ${max.toLocaleString()} ₽`;
    return 'Не указана';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Найдите свою идеальную работу в образовании
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Платформа, которая соединяет талантливых преподавателей с лучшими образовательными учреждениями по всей стране
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/teachers">
                <Search className="mr-2 h-5 w-5" />
                Найти преподавателей
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/schools">
                <School className="mr-2 h-5 w-5" />
                Поиск вакансий
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
                {featuredTeachers?.length || 0}+
              </div>
              <p className="text-gray-600">Квалифицированных преподавателей</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {featuredSchools?.length || 0}+
              </div>
              <p className="text-gray-600">Образовательных учреждений</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {featuredVacancies?.length || 0}+
              </div>
              <p className="text-gray-600">Активных вакансий</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vacancies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Актуальные вакансии
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Свежие предложения от ведущих образовательных учреждений
            </p>
          </div>

          {vacanciesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
              {featuredVacancies?.map((vacancy) => (
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
                      <span>{vacancy.location || 'Местоположение не указано'}</span>
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
                Посмотреть все вакансии
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
              Опытные преподаватели
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Знакомьтесь с нашими талантливыми преподавателями
            </p>
          </div>

          {teachersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
              {limitedTeachers.map((teacher) => (
                <Card key={teacher.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                      {teacher.profiles?.full_name?.charAt(0) || 'T'}
                    </div>
                    <CardTitle>{teacher.profiles?.full_name || 'Имя не указано'}</CardTitle>
                    <CardDescription>{teacher.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {teacher.experience_years && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4" />
                        <span>{teacher.experience_years} лет опыта</span>
                      </div>
                    )}
                    {teacher.location && (
                      <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{teacher.location}</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/teachers/${teacher.id}`}>Подробнее</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild>
              <Link to="/teachers">
                Посмотреть всех преподавателей
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
              Ведущие образовательные учреждения
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Школы и учебные заведения, которые ищут талантливых преподавателей
            </p>
          </div>

          {schoolsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
              {limitedSchools.map((school) => (
                <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                    {school.school_name?.charAt(0) || 'S'}
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
                        <span>{school.student_count} учеников</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/schools/${school.id}`}>Подробнее</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center">
            <Button asChild>
              <Link to="/schools">
                Посмотреть все школы
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Готовы начать свой путь в образовании?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Присоединяйтесь к нашей платформе уже сегодня
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/auth">Зарегистрироваться как преподаватель</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/auth">Зарегистрироваться как школа</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
