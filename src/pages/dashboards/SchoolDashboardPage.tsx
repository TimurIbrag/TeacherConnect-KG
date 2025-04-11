
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Building,
  Edit,
  Eye, 
  FileBarChart, 
  FilePlus, 
  FileText, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Plus, 
  Search,
  UserCheck,
  UserCog,
  UserRound
} from 'lucide-react';

const SchoolDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // In a real app, this would check authentication
  React.useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = true; // This would be from auth system
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Панель управления школы</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
          <TabsTrigger value="applications">Отклики</TabsTrigger>
          <TabsTrigger value="teachers">Учителя</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Профиль школы</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Редактировать
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-md">
                      <Building className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Школа-гимназия №5</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        г. Бишкек, ул. Московская, 145
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Государственная</Badge>
                    <Badge variant="secondary">Общеобразовательная</Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">О школе</h4>
                    <p className="text-sm">
                      Школа-гимназия №5 - одна из старейших школ Бишкека с богатыми традициями. 
                      Наша миссия - дать качественное образование, помочь ученикам раскрыть свои 
                      таланты и подготовить их к успешной жизни в современном мире.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Инфраструктура</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 border p-2 rounded">
                        <span className="text-sm">Компьютерный класс</span>
                      </div>
                      <div className="flex items-center gap-2 border p-2 rounded">
                        <span className="text-sm">Спортзал</span>
                      </div>
                      <div className="flex items-center gap-2 border p-2 rounded">
                        <span className="text-sm">Библиотека</span>
                      </div>
                      <div className="flex items-center gap-2 border p-2 rounded">
                        <span className="text-sm">Столовая</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Просмотры профиля:</span>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="font-medium">56</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Активные вакансии:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Получено откликов:</span>
                      <span className="font-medium">12</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FilePlus className="mr-2 h-4 w-4" />
                      Добавить вакансию
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Поиск учителей
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Сообщения
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vacancies" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Вакансии школы</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Новая вакансия
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Учитель математики</CardTitle>
                    <CardDescription>
                      Опубликована: 5 апреля 2025 • 8 просмотров • 3 отклика
                    </CardDescription>
                  </div>
                  <Badge>Активна</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">30,000-40,000 сом</span>
                </div>
                <p className="text-sm">
                  Требуется учитель математики для работы в 5-11 классах. Опыт работы от 2 лет, 
                  высшее педагогическое образование.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Отклики (3)
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    Просмотр
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Учитель английского языка</CardTitle>
                    <CardDescription>
                      Опубликована: 1 апреля 2025 • 12 просмотров • 5 откликов
                    </CardDescription>
                  </div>
                  <Badge>Активна</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">35,000-45,000 сом</span>
                </div>
                <p className="text-sm">
                  Требуется учитель английского языка для начальной и средней школы. 
                  Владение современными методиками обязательно.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Отклики (5)
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    Просмотр
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Учитель информатики</CardTitle>
                    <CardDescription>
                      Опубликована: 30 марта 2025 • 6 просмотров • 2 отклика
                    </CardDescription>
                  </div>
                  <Badge>Активна</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">35,000-40,000 сом</span>
                </div>
                <p className="text-sm">
                  Требуется учитель информатики. Знание языков программирования, 
                  умение преподавать основы алгоритмизации.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>
                  <Button variant="outline" size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Отклики (2)
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Eye className="h-4 w-4 mr-1" />
                    Просмотр
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Отклики на вакансии</CardTitle>
              <CardDescription>
                Отклики учителей на размещенные вакансии
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="new">
                <TabsList className="mb-4">
                  <TabsTrigger value="new">Новые (5)</TabsTrigger>
                  <TabsTrigger value="processed">В работе (3)</TabsTrigger>
                  <TabsTrigger value="archived">Архив (2)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="new" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Каримов Азамат</h3>
                          <p className="text-xs text-muted-foreground">Учитель информатики • 6 лет опыта</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Новый</span>
                        <p className="text-xs text-muted-foreground mt-1">11 апреля, 10:24</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Вакансия: <span className="font-medium">Учитель информатики</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Просмотреть профиль
                      </Button>
                      <Button variant="default" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Написать
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Алиева Гульнара</h3>
                          <p className="text-xs text-muted-foreground">Учитель математики • 4 года опыта</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Новый</span>
                        <p className="text-xs text-muted-foreground mt-1">10 апреля, 15:32</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Вакансия: <span className="font-medium">Учитель математики</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Просмотреть профиль
                      </Button>
                      <Button variant="default" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Написать
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="processed" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Аманов Тимур</h3>
                          <p className="text-xs text-muted-foreground">Учитель математики • 8 лет опыта</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Собеседование</span>
                        <p className="text-xs text-muted-foreground mt-1">15 апреля, 14:00</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Вакансия: <span className="font-medium">Учитель математики</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Профиль
                      </Button>
                      <Button variant="default" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Написать
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserCog className="h-4 w-4 mr-1" />
                        Изменить статус
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="archived">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Бакиров Нурлан</h3>
                          <p className="text-xs text-muted-foreground">Учитель английского языка • 3 года опыта</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Отклонено</span>
                        <p className="text-xs text-muted-foreground mt-1">7 апреля</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">
                      Вакансия: <span className="font-medium">Учитель английского языка</span>
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Профиль
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileBarChart className="h-4 w-4 mr-1" />
                        Причина отказа
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teachers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Поиск учителей</h2>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Расширенный поиск
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Кенжеев Ринат</h3>
                    <p className="text-xs text-muted-foreground">Учитель физики • 10 лет опыта</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">Высшее образование</Badge>
                  <Badge variant="secondary">Кандидат наук</Badge>
                </div>
                <p className="text-sm mb-3 line-clamp-2">
                  Преподаватель физики с большим стажем. Умею заинтересовать учеников предметом, 
                  подготовка к олимпиадам и ОРТ.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Связаться
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Исакова Айнура</h3>
                    <p className="text-xs text-muted-foreground">Учитель биологии • 7 лет опыта</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">Высшее образование</Badge>
                  <Badge variant="secondary">Магистр</Badge>
                </div>
                <p className="text-sm mb-3 line-clamp-2">
                  Преподаватель биологии, применяю интерактивные методы обучения, 
                  провожу лабораторные работы. Опыт работы в школах и лицеях.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Связаться
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Токтогулов Арсен</h3>
                    <p className="text-xs text-muted-foreground">Учитель информатики • 5 лет опыта</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">Высшее образование</Badge>
                  <Badge variant="secondary">Программист</Badge>
                </div>
                <p className="text-sm mb-3 line-clamp-2">
                  Преподаватель информатики и программирования. Обучаю языкам Python, JavaScript.
                  Подготовил более 20 призеров олимпиад.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Связаться
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserRound className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Жумабаева Динара</h3>
                    <p className="text-xs text-muted-foreground">Учитель начальных классов • 12 лет опыта</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">Высшее образование</Badge>
                  <Badge variant="secondary">Отличник образования</Badge>
                </div>
                <p className="text-sm mb-3 line-clamp-2">
                  Опытный учитель начальных классов. Владею методиками развивающего обучения, 
                  индивидуальный подход к каждому ученику.
                </p>
                <div className="flex gap-2">
                  <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Связаться
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolDashboardPage;
