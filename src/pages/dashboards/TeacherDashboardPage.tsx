
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Eye, User, MessageSquare, Bookmark, Edit, GraduationCap, Calendar, MapPin, Search, MessageCircle, Award } from 'lucide-react';
import EnhancedAvatarUploader from '@/components/ui/enhanced-avatar-uploader';

interface TeacherProfileData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  specialization: string;
  experience: string;
  education: string;
  bio: string;
  avatar: string;
}

// Get/set teacher profile data
const getTeacherProfileData = (): TeacherProfileData => {
  const saved = localStorage.getItem('teacherProfileData');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing teacher profile data:', error);
    }
  }
  
  return {
    fullName: '',
    phone: '',
    email: '',
    location: '',
    specialization: '',
    experience: '',
    education: '',
    bio: '',
    avatar: '',
  };
};

const setTeacherProfileData = (data: TeacherProfileData) => {
  localStorage.setItem('teacherProfileData', JSON.stringify(data));
};

const TeacherDashboardPage = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<TeacherProfileData>(getTeacherProfileData());

  useEffect(() => {
    setTeacherProfileData(profileData);
  }, [profileData]);

  const handleInputChange = (field: keyof TeacherProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarUploaded = (url: string) => {
    handleInputChange('avatar', url);
    toast({
      title: 'Фото загружено',
      description: 'Фотография профиля успешно обновлена',
    });
  };

  const handleAvatarRemoved = () => {
    handleInputChange('avatar', '');
    toast({
      title: 'Фото удалено',
      description: 'Фотография профиля была удалена',
    });
  };

  if (profile?.role !== 'teacher') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Доступ запрещен</h2>
              <p className="text-muted-foreground">
                Эта страница доступна только для преподавателей.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Личный кабинет учителя
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="applications">Отклики</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
          <TabsTrigger value="saved">Сохраненные</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Мой профиль</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo and Basic Info */}
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center space-y-4">
                      <EnhancedAvatarUploader
                        currentAvatarUrl={profileData.avatar}
                        onAvatarUploaded={handleAvatarUploaded}
                        onAvatarRemoved={handleAvatarRemoved}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {profileData.fullName || "Заполните ваше имя"}
                        </h3>
                        <p className="text-muted-foreground">
                          {profileData.specialization || "Укажите вашу специализацию"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Образование</p>
                          <p className="text-sm text-muted-foreground">
                            {profileData.education || "Не указано"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Опыт работы</p>
                          <p className="text-sm text-muted-foreground">
                            {profileData.experience || "Не указано"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium">График работы</p>
                          <p className="text-sm text-muted-foreground">Не указано</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium">Предпочтительные районы</p>
                          <p className="text-sm text-muted-foreground">
                            {profileData.location || "Не указано"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* About Section */}
                  <div>
                    <h4 className="text-lg font-medium mb-3">О себе</h4>
                    <p className="text-sm text-muted-foreground">
                      {profileData.bio || "Расскажите о себе, опыте работы и методах преподавания"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Заполните все разделы профиля, чтобы повысить шансы найти подходящую школу.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Отклики</CardTitle>
                  <CardDescription>
                    Ваши отклики на вакансии школ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      У вас пока нет откликов на вакансии
                    </p>
                    <Button variant="outline" className="mt-4">
                      <Search className="h-4 w-4 mr-2" />
                      Найти вакансии
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Сообщения</CardTitle>
                  <CardDescription>
                    Переписка с школами и администрацией
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Нет новых сообщений
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Сохраненные</CardTitle>
                  <CardDescription>
                    Сохраненные вакансии и школы
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Нет сохраненных элементов
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Просмотры профиля:</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">0</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Отклики:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Сообщения:</span>
                  <span className="font-medium">0</span>
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
                  <MessageCircle className="mr-2 h-4 w-4" />
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
      </Tabs>
    </div>
  );
};

export default TeacherDashboardPage;
