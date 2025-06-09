
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
import { Eye, User, MessageSquare, Bookmark, GraduationCap, Calendar, MapPin, Search, MessageCircle, Award, Phone, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Личный кабинет
          </h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <TabsList className="grid w-full grid-cols-4 bg-transparent border-b rounded-none h-12">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Профиль
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="relative data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Отклики
                {applications.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    {applications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="messages" 
                className="relative data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Сообщения
                {unreadMessages > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                    {unreadMessages}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
              >
                Сохраненные
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <TabsContent value="profile" className="mt-0">
                    <div className="space-y-6">
                      {/* Profile Header */}
                      <div className="flex items-start gap-6 p-6 bg-white rounded-lg border">
                        <div className="flex flex-col items-center space-y-4">
                          <EnhancedAvatarUploader
                            currentAvatarUrl={profile?.avatar_url || ''}
                            onAvatarUploaded={handleAvatarUploaded}
                            onAvatarRemoved={handleAvatarRemoved}
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900">
                              {profile?.full_name || "Заполните ваше имя"}
                            </h3>
                            <p className="text-gray-600 text-lg">
                              {teacherProfile?.specialization || "Укажите вашу специализацию"}
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{profile?.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{teacherProfile?.location || "Не указано"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                              Образование
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              {teacherProfile?.education || "Не указано"}
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-green-600" />
                              Опыт работы
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">
                              {teacherProfile?.experience_years ? `${teacherProfile.experience_years} лет` : "Не указано"}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* About Section */}
                      <Card>
                        <CardHeader>
                          <CardTitle>О себе</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-4">
                            {teacherProfile?.bio || "Расскажите о себе, опыте работы и методах преподавания"}
                          </p>
                          {teacherProfile?.skills && teacherProfile.skills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Навыки:</p>
                              <div className="flex flex-wrap gap-2">
                                {teacherProfile.skills.map((skill, index) => (
                                  <Badge key={index} variant="secondary">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="applications" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Отклики на вакансии</CardTitle>
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
                            <p className="text-muted-foreground mb-4">
                              У вас пока нет откликов на вакансии
                            </p>
                            <Button variant="outline">
                              <Search className="h-4 w-4 mr-2" />
                              Найти вакансии
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {applications.map((application) => (
                              <div key={application.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">
                                      {application.vacancies?.title || 'Без названия'}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {application.vacancies?.school_profiles?.school_name || 'Школа не указана'}
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
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="messages" className="mt-0">
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
                            <p className="text-muted-foreground">Нет сообщений</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {messages.slice(0, 5).map((message) => (
                              <div key={message.id} className="p-4 border rounded-lg">
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
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="saved" className="mt-0">
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
                      <CardTitle className="text-lg">Статистика</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Просмотры профиля:</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Отклики:</span>
                        <span className="font-medium text-blue-600">{applications.length}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Сообщения:</span>
                        <span className="font-medium text-green-600">{messages.length}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Быстрые действия</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Search className="mr-2 h-4 w-4" />
                        Поиск вакансий
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Новое сообщение
                      </Button>
                      <Button variant="outline" className="w-full justify-start" size="sm">
                        <Award className="mr-2 h-4 w-4" />
                        Мои сертификаты
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
