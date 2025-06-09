
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherApplications } from '@/hooks/useApplications';
import { useUserMessages } from '@/hooks/useMessages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, User, MessageSquare, Bookmark, Edit, GraduationCap, Calendar, MapPin, Search, MessageCircle, Award } from 'lucide-react';
import EnhancedAvatarUploader from '@/components/ui/enhanced-avatar-uploader';

const TeacherDashboardPage = () => {
  const { t } = useLanguage();
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const { teacherProfile, loading: profileLoading, updateTeacherProfile } = useTeacherProfile();
  const { data: applications = [], isLoading: applicationsLoading } = useTeacherApplications();
  const { data: messages = [], isLoading: messagesLoading } = useUserMessages();
  const [activeTab, setActiveTab] = useState('profile');

  const handleAvatarUploaded = async (url: string) => {
    try {
      await updateProfile({ avatar_url: url });
      toast({
        title: 'Фото загружено',
        description: 'Фотография профиля успешно обновлена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить фотографию',
        variant: 'destructive',
      });
    }
  };

  const handleAvatarRemoved = async () => {
    try {
      await updateProfile({ avatar_url: null });
      toast({
        title: 'Фото удалено',
        description: 'Фотография профиля была удалена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить фотографию',
        variant: 'destructive',
      });
    }
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

  const unreadMessages = messages.filter(msg => !msg.read && msg.recipient_id === user?.id).length;

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
          <TabsTrigger value="applications" className="relative">
            Отклики
            {applications.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {applications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="relative">
            Сообщения
            {unreadMessages > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {unreadMessages}
              </Badge>
            )}
          </TabsTrigger>
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
                        currentAvatarUrl={profile?.avatar_url || ''}
                        onAvatarUploaded={handleAvatarUploaded}
                        onAvatarRemoved={handleAvatarRemoved}
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {profile?.full_name || "Заполните ваше имя"}
                        </h3>
                        <p className="text-muted-foreground">
                          {teacherProfile?.specialization || "Укажите вашу специализацию"}
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
                            {teacherProfile?.education || "Не указано"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Опыт работы</p>
                          <p className="text-sm text-muted-foreground">
                            {teacherProfile?.experience_years ? `${teacherProfile.experience_years} лет` : "Не указано"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium">Языки</p>
                          <p className="text-sm text-muted-foreground">
                            {teacherProfile?.languages?.join(', ') || "Не указано"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium">Локация</p>
                          <p className="text-sm text-muted-foreground">
                            {teacherProfile?.location || "Не указано"}
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
                      {teacherProfile?.bio || "Расскажите о себе, опыте работы и методах преподавания"}
                    </p>
                    {teacherProfile?.skills && teacherProfile.skills.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Навыки:</p>
                        <div className="flex flex-wrap gap-2">
                          {teacherProfile.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
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
                  {applicationsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Загрузка...</p>
                    </div>
                  ) : applications.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        У вас пока нет откликов на вакансии
                      </p>
                      <Button variant="outline" className="mt-4">
                        <Search className="h-4 w-4 mr-2" />
                        Найти вакансии
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{application.vacancies?.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {application.vacancies?.school_profiles?.school_name}
                              </p>
                              <div className="mt-2">
                                <Badge 
                                  variant={
                                    application.status === 'accepted' ? 'default' :
                                    application.status === 'rejected' ? 'destructive' :
                                    'secondary'
                                  }
                                >
                                  {application.status === 'pending' && 'На рассмотрении'}
                                  {application.status === 'accepted' && 'Принят'}
                                  {application.status === 'rejected' && 'Отклонен'}
                                  {application.status === 'reviewed' && 'Рассмотрен'}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {application.applied_at && new Date(application.applied_at).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      ))}
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
                    Переписка с школами и администрацией
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Загрузка...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Нет сообщений
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.slice(0, 5).map((message) => (
                        <Card key={message.id} className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">
                                  {message.sender_id === user?.id ? 'Вы' : message.sender?.full_name}
                                </h4>
                                {!message.read && message.recipient_id === user?.id && (
                                  <Badge variant="destructive" className="h-2 w-2 p-0"></Badge>
                                )}
                              </div>
                              {message.subject && (
                                <p className="text-sm font-medium text-muted-foreground">
                                  {message.subject}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground mt-1">
                                {message.content.substring(0, 100)}
                                {message.content.length > 100 && '...'}
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {message.sent_at && new Date(message.sent_at).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
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
                  <span className="font-medium">{applications.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Сообщения:</span>
                  <span className="font-medium">{messages.length}</span>
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
