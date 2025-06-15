import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { teachersData } from '@/data/mockData';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  MessageSquare,
  Star,
  Languages,
  DollarSign,
  Building,
  Award,
  Eye
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecurePrivateChat } from '@/hooks/useSecurePrivateChat';

const TeacherProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { createChatRoom, isAuthenticated } = useSecurePrivateChat();
  
  // Find teacher by ID
  const teacherId = Number(id);
  const teacher = teachersData.find(t => t.id === teacherId);
  
  if (!teacher) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Учитель не найден</h1>
        <p className="mb-6">Пользователь с указанным ID не существует.</p>
        <Button asChild>
          <Link to="/teachers">Вернуться к списку учителей</Link>
        </Button>
      </div>
    );
  }
  
  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в систему для отправки сообщений",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (!profile || profile.role !== 'school') {
      toast({
        title: "Доступ ограничен",
        description: "Только школы могут связаться с учителями",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a mock teacher user ID based on teacher ID
      const teacherUserId = `teacher_${teacher.id}`;
      const chatRoomId = await createChatRoom(teacherUserId);
      
      toast({
        title: "Чат создан",
        description: "Переходим к общению с учителем",
      });
      
      navigate(`/messages/${chatRoomId}`);
    } catch (error: any) {
      console.error('Failed to start chat:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать чат",
        variant: "destructive",
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={teacher.photo} alt={teacher.name} />
                    <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{teacher.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{teacher.specialization}</span>
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary">{teacher.experience}</Badge>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                        <span>{teacher.ratings}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:self-start">
                  <Button onClick={handleStartChat}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('button.message')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-6">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">О себе</TabsTrigger>
                  <TabsTrigger value="experience">Опыт</TabsTrigger>
                  <TabsTrigger value="preferences">Предпочтения</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">О себе</h3>
                    <p className="text-muted-foreground">{teacher.about}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Образование</h3>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                        <span>{teacher.education}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Языки</h3>
                      <div className="flex items-start gap-2">
                        <Languages className="h-5 w-5 text-primary mt-0.5" />
                        <span>{teacher.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Достижения</h3>
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-primary mt-0.5" />
                      <span>{teacher.achievements}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Опыт работы</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="font-medium">Общий стаж:</span>
                      <span>{teacher.experience}</span>
                    </div>
                    <p className="text-muted-foreground">
                      Подробная информация о опыте работы будет отображаться здесь после заполнения профиля.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">График работы</h3>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{teacher.preferredSchedule}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Желаемая зарплата</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span>{teacher.desiredSalary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Предпочтительные районы</h3>
                    <div className="flex items-start gap-2">
                      <Building className="h-5 w-5 text-primary mt-0.5" />
                      <span>{teacher.preferredDistricts.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Местоположение</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{teacher.location}</span>
                    </div>
                    <div className="bg-muted h-48 rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">Карта местоположения</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Stats & Info */}
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
                  <span className="font-medium">{teacher.views}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Отклики на вакансии:</span>
                <span className="font-medium">{teacher.applications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Рейтинг:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-accent fill-accent" />
                  <span className="font-medium">{teacher.ratings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Похожие учителя</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachersData
                  .filter(t => t.id !== teacherId && t.specialization === teacher.specialization)
                  .slice(0, 3)
                  .map(similarTeacher => (
                    <div key={similarTeacher.id} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={similarTeacher.photo} alt={similarTeacher.name} />
                        <AvatarFallback>{getInitials(similarTeacher.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{similarTeacher.name}</p>
                        <p className="text-xs text-muted-foreground">{similarTeacher.specialization}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/teachers/${similarTeacher.id}`}>
                          Просмотр
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/teachers">Все учителя</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
