
import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
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
  Search,
  ThumbsUp,
  ThumbsDown,
  Upload,
  Trash2
} from 'lucide-react';

// Типы для дней недели и временных слотов
type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type TimeSlot = '8:00-10:00' | '10:00-12:00' | '12:00-14:00' | '14:00-16:00' | '16:00-18:00' | '18:00-20:00';

// Данные для гибкого графика
const weekDays: { id: WeekDay; label: string }[] = [
  { id: 'monday', label: 'Понедельник' },
  { id: 'tuesday', label: 'Вторник' },
  { id: 'wednesday', label: 'Среда' },
  { id: 'thursday', label: 'Четверг' },
  { id: 'friday', label: 'Пятница' },
  { id: 'saturday', label: 'Суббота' },
  { id: 'sunday', label: 'Воскресенье' },
];

const timeSlots: TimeSlot[] = [
  '8:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
];

type ScheduleItem = {
  day: WeekDay;
  slots: TimeSlot[];
};

type ProfileFormData = {
  fullName: string;
  specialization: string;
  education: string;
  experience: string;
  workScheduleType: string;
  districts: string;
  about: string;
  schedule: ScheduleItem[];
};

type CertificateType = {
  id: string;
  name: string;
  date: string;
  file?: File;
};

const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // В реальном приложении проверяем авторизацию
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: '',
    specialization: '',
    education: '',
    experience: '',
    workScheduleType: '',
    districts: '',
    about: '',
    schedule: []
  });
  
  // Стейт для сертификатов
  const [certificates, setCertificates] = useState<CertificateType[]>([]);
  const [showCertificatesDialog, setShowCertificatesDialog] = useState(false);
  
  // Стейт для статистики
  const [stats, setStats] = useState({
    profileViews: 0,
    responses: 0,
    messages: 0
  });
  
  const form = useForm<ProfileFormData>({
    defaultValues: profileData
  });

  useEffect(() => {
    // Проверяем авторизацию
    if (!isLoggedIn) {
      navigate('/login');
    }
    
    // Обновляем форму при изменении profileData
    form.reset(profileData);
  }, [isLoggedIn, navigate, profileData, form]);
  
  // Функция для сохранения профиля
  const saveProfile = (data: ProfileFormData) => {
    setProfileData(data);
    setEditMode(false);
    toast({
      title: "Профиль сохранен",
      description: "Ваши данные успешно обновлены",
    });
  };
  
  // Обработчик добавления сертификата
  const handleAddCertificate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCertificate: CertificateType = {
      id: Date.now().toString(),
      name: formData.get('certificateName') as string,
      date: formData.get('certificateDate') as string,
    };
    
    // Добавляем файл, если он был загружен
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      newCertificate.file = fileInput.files[0];
    }
    
    setCertificates([...certificates, newCertificate]);
    
    // Сбрасываем форму
    e.currentTarget.reset();
    
    toast({
      title: "Сертификат добавлен",
      description: `Сертификат "${newCertificate.name}" успешно добавлен`,
    });
  };
  
  // Обработчик удаления сертификата
  const handleDeleteCertificate = (id: string) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    toast({
      title: "Сертификат удален",
      description: "Сертификат успешно удален из вашего профиля",
    });
  };
  
  // Компонент диалога для редактирования профиля
  const EditProfileDialog = () => (
    <Dialog open={editMode} onOpenChange={setEditMode}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование профиля</DialogTitle>
          <DialogDescription>
            Обновите информацию в вашем профиле. Нажмите Сохранить, когда закончите.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveProfile)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Иванов Иван Иванович" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Специализация</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Учитель математики" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Образование</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Кыргызский Национальный Университет" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опыт работы</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="5 лет" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workScheduleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>График работы</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Полный рабочий день" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Гибкий график</FormLabel>
              <div className="border rounded-md p-4 space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Выберите удобные для вас дни и временные промежутки
                </div>
                
                {weekDays.map((day) => (
                  <div key={day.id} className="space-y-2">
                    <div className="font-medium">{day.label}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const schedule = form.getValues("schedule") || [];
                        const daySchedule = schedule.find(s => s.day === day.id);
                        const isChecked = daySchedule?.slots.includes(slot) || false;
                        
                        return (
                          <div key={`${day.id}-${slot}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${day.id}-${slot}`} 
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const newSchedule = [...schedule];
                                const dayIndex = newSchedule.findIndex(s => s.day === day.id);
                                
                                if (checked) {
                                  if (dayIndex >= 0) {
                                    newSchedule[dayIndex].slots.push(slot);
                                  } else {
                                    newSchedule.push({ day: day.id, slots: [slot] });
                                  }
                                } else if (dayIndex >= 0) {
                                  newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter(s => s !== slot);
                                  if (newSchedule[dayIndex].slots.length === 0) {
                                    newSchedule.splice(dayIndex, 1);
                                  }
                                }
                                
                                form.setValue("schedule", newSchedule);
                              }}
                            />
                            <Label htmlFor={`${day.id}-${slot}`}>{slot}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="districts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Предпочтительные районы</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Бишкек, центр" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>О себе</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Расскажите о себе, своем опыте и методах преподавания..." 
                      rows={5}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
  
  // Компонент диалога для сертификатов
  const CertificatesDialog = () => (
    <Dialog open={showCertificatesDialog} onOpenChange={setShowCertificatesDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Мои сертификаты</DialogTitle>
          <DialogDescription>
            Добавьте свои сертификаты и дипломы для подтверждения квалификации
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleAddCertificate} className="space-y-4 border-b pb-4">
            <div className="space-y-2">
              <Label htmlFor="certificateName">Название сертификата</Label>
              <Input id="certificateName" name="certificateName" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificateDate">Дата получения</Label>
              <Input id="certificateDate" name="certificateDate" type="date" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificateFile">Файл сертификата</Label>
              <Input id="certificateFile" name="certificateFile" type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Добавить сертификат
            </Button>
          </form>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Загруженные сертификаты</h3>
            
            {certificates.length === 0 ? (
              <p className="text-sm text-muted-foreground">У вас пока нет загруженных сертификатов</p>
            ) : (
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border rounded-md p-2">
                    <div>
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-xs text-muted-foreground">Получен: {cert.date}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCertificate(cert.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCertificatesDialog(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
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
                  <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditMode(true)}>
                    <Edit className="h-4 w-4" />
                    Редактировать
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {profileData.fullName 
                          ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() 
                          : ''}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{profileData.fullName || "Заполните ваше имя"}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {profileData.specialization || "Укажите вашу специализацию"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Образование</h4>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.education || "Не указано"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Опыт работы</h4>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.experience || "Не указано"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">График работы</h4>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.workScheduleType || "Не указано"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Предпочтительные районы</h4>
                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.districts || "Не указано"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {profileData.schedule && profileData.schedule.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Гибкий график</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profileData.schedule.map((item) => (
                          <div key={item.day} className="border rounded-md p-3">
                            <div className="font-medium mb-1">
                              {weekDays.find(d => d.id === item.day)?.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.slots.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">О себе</h4>
                    <p className="text-sm">
                      {profileData.about || "Расскажите о себе, опыте работы и методах преподавания"}
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
                        <span className="font-medium">{stats.profileViews}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Отклики:</span>
                      <span className="font-medium">{stats.responses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Сообщения:</span>
                      <span className="font-medium">{stats.messages}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => navigate('/schools')}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Искать вакансии
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/messages')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Сообщения
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowCertificatesDialog(true)}
                    >
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
              {stats.responses === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">У вас пока нет откликов на вакансии</p>
                  <Button onClick={() => navigate('/schools')}>
                    <Search className="mr-2 h-4 w-4" />
                    Найти вакансии
                  </Button>
                </div>
              ) : (
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
                      <Button variant="outline" size="sm" onClick={() => navigate('/vacancy/1')}>
                        <FileText className="h-4 w-4 mr-1" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate('/messages/school/1')}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Связаться
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
              {stats.messages === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">У вас пока нет сообщений</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-accent/10" onClick={() => navigate('/messages/school/1')}>
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
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={() => navigate('/messages')}>
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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Удалено из сохраненных",
                          description: "Вакансия удалена из списка сохраненных",
                        });
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">35,000-45,000 сом</span>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full flex items-center gap-0.5">
                      <Home className="h-3 w-3" />
                      Жилье
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Отклик отправлен",
                          description: "Ваш отклик успешно отправлен в школу",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Откликнуться
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/vacancy/1')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                  
                  <div className="mt-4 border-t pt-3">
                    <div className="text-sm font-medium mb-2">Оставить отзыв о школе:</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Рекомендую
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Не рекомендую
                      </Button>
                    </div>
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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Удалено из сохраненных",
                          description: "Вакансия удалена из списка сохраненных",
                        });
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Частичная занятость</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">По договоренности</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Отклик отправлен",
                          description: "Ваш отклик успешно отправлен в школу",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Откликнуться
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/vacancy/2')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                  
                  <div className="mt-4 border-t pt-3">
                    <div className="text-sm font-medium mb-2">Оставить отзыв о школе:</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Рекомендую
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Не рекомендую
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Диалоги */}
      <EditProfileDialog />
      <CertificatesDialog />
    </div>
  );
};

export default TeacherDashboardPage;
