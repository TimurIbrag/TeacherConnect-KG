
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useVacancies, useTeachers, useSchools } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Building2, 
  Briefcase, 
  MapPin, 
  Clock,
  Search,
  UserPlus,
  BookOpen
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { data: vacancies, isLoading: vacanciesLoading } = useVacancies();
  const { data: teachers, isLoading: teachersLoading } = useTeachers();
  const { data: schools, isLoading: schoolsLoading } = useSchools();

  const handleGetStarted = () => {
    if (user) {
      if (profile?.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (profile?.role === 'school') {
        navigate('/school-dashboard');
      } else {
        navigate('/teachers');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleRegisterAsTeacher = () => {
    navigate('/auth?type=teacher');
  };

  const handleRegisterAsSchool = () => {
    navigate('/auth?type=school');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Найдите работу преподавателя в Кыргызстане
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            TeacherConnect KG — платформа, объединяющая талантливых преподавателей 
            с лучшими образовательными учреждениями Кыргызстана
          </p>
          {user ? (
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={handleGetStarted}
            >
              Перейти в личный кабинет
            </Button>
          ) : (
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 mr-4"
                onClick={handleGetStarted}
              >
                <Search className="mr-2 h-5 w-5" />
                Найти работу
              </Button>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={handleRegisterAsTeacher}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Я преподаватель
                </Button>
                <Button 
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={handleRegisterAsSchool}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Я представляю школу
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {teachersLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : teachers?.length || 0}
              </h3>
              <p className="text-gray-600">Зарегистрированных преподавателей</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {schoolsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : schools?.length || 0}
              </h3>
              <p className="text-gray-600">Партнерских школ</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Briefcase className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {vacanciesLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : vacancies?.length || 0}
              </h3>
              <p className="text-gray-600">Активных вакансий</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Vacancies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Последние вакансии
            </h2>
            <p className="text-xl text-gray-600">
              Найдите идеальную работу уже сегодня
            </p>
          </div>

          {vacanciesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vacancies?.slice(0, 6).map((vacancy) => (
                <Card key={vacancy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {vacancy.school_profiles?.school_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {vacancy.description || 'Описание отсутствует'}
                    </p>
                    <div className="space-y-2">
                      {vacancy.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="h-4 w-4" />
                          {vacancy.location}
                        </div>
                      )}
                      {vacancy.subject && (
                        <Badge variant="secondary">{vacancy.subject}</Badge>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        {new Date(vacancy.created_at!).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/teachers')}
            >
              Посмотреть все вакансии
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Как это работает
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <UserPlus className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Зарегистрируйтесь</h3>
              <p className="text-gray-600">
                Создайте профиль преподавателя или школы
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Найдите работу</h3>
              <p className="text-gray-600">
                Просматривайте вакансии и отправляйте заявки
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Начните преподавать</h3>
              <p className="text-gray-600">
                Получите работу своей мечты и развивайтесь
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
