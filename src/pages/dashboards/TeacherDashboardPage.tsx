
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Award,
  BookOpen,
  Building,
  Calendar,
  Edit,
  Eye, 
  FileText, 
  GraduationCap, 
  Heart, 
  Home, 
  Mail, 
  MessageSquare, 
  Plus, 
  Search
} from 'lucide-react';

const TeacherDashboardPage: React.FC = () => {
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
      <h1 className="text-3xl font-bold mb-6">Личный кабинет учителя</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="applications">Отклики</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
          <TabsTrigger value="saved">Сохраненные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Мой профиль</CardTitle>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Редактировать
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xl font-bold">АИ</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Асанов Ибрагим</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        Учитель математики
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Образование</h4>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                        <span>Кыргызский Национальный Университет</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Опыт работы</h4>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <span>5 лет</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">График работы</h4>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <span>Полный рабочий день</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Предпочтительные районы</h4>
                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <span>Бишкек, центр</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">О себе</h4>
                    <p className="text-sm">
                      Опытный преподаватель математики с индивидуальным подходом к каждому ученику. 
                      Ответственный, коммуникабельный, постоянно совершенствую свои знания и методы преподавания.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Заполните все разделы профиля, чтобы повысить шансы найти подходящую школу.
                  </p>
                </CardFooter>
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
                        <span className="font-medium">24</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Отклики:</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Сообщения:</span>
                      <span className="font-medium">5</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Search className="mr-2 h-4 w-4" />
                      Искать вакансии
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Сообщения
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="mr-2 h-4 w-4" />
                      Сертификаты
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Мои отклики на вакансии</CardTitle>
              <CardDescription>
                Здесь отображаются все ваши заявки на вакансии школ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Учитель математики</h3>
                      <p className="text-sm text-muted-foreground">Школа №12, Бишкек</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">На рассмотрении</span>
                  </div>
                  <p className="text-sm mb-3">
                    Дата отклика: 10 апреля 2025
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Просмотр
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Связаться
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Преподаватель алгебры и геометрии</h3>
                      <p className="text-sm text-muted-foreground">Лицей "Сапат", Бишкек</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Приглашение</span>
                  </div>
                  <p className="text-sm mb-3">
                    Дата отклика: 5 апреля 2025
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Просмотр
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Связаться
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сообщения</CardTitle>
              <CardDescription>
                Общение со школами и другими пользователями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Школа №12</h3>
                        <p className="text-xs text-muted-foreground">3 новых сообщения</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">10:30</span>
                  </div>
                  <p className="text-sm truncate">
                    Здравствуйте! Мы рассмотрели вашу заявку и хотели бы...
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Лицей "Сапат"</h3>
                        <p className="text-xs text-muted-foreground">1 новое сообщение</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">Вчера</span>
                  </div>
                  <p className="text-sm truncate">
                    Приглашаем вас на собеседование в среду в 15:00...
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Все сообщения
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сохраненные вакансии</CardTitle>
              <CardDescription>
                Вакансии, которые вас заинтересовали
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Учитель математики (старшие классы)</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        Школа-гимназия №1, Бишкек
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">35,000-45,000 сом</span>
                    {true && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full flex items-center gap-0.5">
                        <Home className="h-3 w-3" />
                        Жилье
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="default" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Откликнуться
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Преподаватель информатики</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        Международная школа "Horizon", Бишкек
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Частичная занятость</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">По договоренности</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="default" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Откликнуться
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboardPage;
