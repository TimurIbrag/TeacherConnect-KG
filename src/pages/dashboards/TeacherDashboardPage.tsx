import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherApplications } from '@/hooks/useApplications';
import { useUserMessages } from '@/hooks/useMessages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, User, MessageSquare, Bookmark, GraduationCap, Calendar, MapPin, Search, MessageCircle, Award, Phone, Mail, Briefcase, Edit, FileText } from 'lucide-react';
import EnhancedAvatarUploader from '@/components/ui/enhanced-avatar-uploader';
import ProfileEditModal, { ProfileData } from '@/components/ProfileEditModal';

const TeacherDashboardPage = () => {
  const { t } = useLanguage();
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const { teacherProfile, loading: profileLoading, updateTeacherProfile } = useTeacherProfile();
  const { data: applications = [], isLoading: applicationsLoading } = useTeacherApplications();
  const { data: messages = [], isLoading: messagesLoading } = useUserMessages();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const handleProfileSave = async (data: ProfileData) => {
    try {
      // Update user profile
      await updateProfile({ 
        full_name: data.name,
        avatar_url: data.photoUrl
      });

      // Update teacher profile
      await updateTeacherProfile({
        specialization: data.specialization,
        education: data.education,
        experience_years: parseInt(data.experience) || 0,
        schedule: data.schedule as 'full-time' | 'part-time' | 'flexible',
        location: data.location,
        bio: data.bio
      });

      toast({
        title: 'Профиль обновлен',
        description: 'Изменения успешно сохранены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
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
  
  // Prepare profile data for edit modal
  const currentProfileData: ProfileData = {
    name: profile?.full_name || '',
    specialization: teacherProfile?.specialization || '',
    education: teacherProfile?.education || '',
    experience: teacherProfile?.experience_years?.toString() || '',
    schedule: teacherProfile?.schedule || 'full-time',
    location: teacherProfile?.location || '',
    bio: teacherProfile?.bio || '',
    photoUrl: profile?.avatar_url || ''
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Личный кабинет учителя
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
              <TabsContent value="profile" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Section - My Profile */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-xl font-semibold">Мой профиль</CardTitle>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => setIsEditModalOpen(true)}
                        >
                          <Edit className="h-4 w-4" />
                          Редактировать
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                            {profile?.avatar_url ? (
                              <img 
                                src={profile.avatar_url} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <User className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              {profile?.full_name || "Заполните ваше имя"}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {teacherProfile?.specialization || "Укажите вашу специализацию"}
                            </p>
                          </div>
                        </div>

                        {/* Profile Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <GraduationCap className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Образование</p>
                                <p className="text-gray-900">{teacherProfile?.education || "Не указано"}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">График работы</p>
                                <p className="text-gray-900">
                                  {teacherProfile?.schedule === 'full-time' && 'Полный день'}
                                  {teacherProfile?.schedule === 'part-time' && 'Неполный день'}
                                  {teacherProfile?.schedule === 'flexible' && 'Гибкий график'}
                                  {!teacherProfile?.schedule && 'Не указано'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Опыт работы</p>
                                <p className="text-gray-900">
                                  {teacherProfile?.experience_years ? `${teacherProfile.experience_years} лет` : "Не указано"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-red-600" />
                              <div>
                                <p className="text-sm font-medium text-gray-500">Предпочитательные районы</p>
                                <p className="text-gray-900">{teacherProfile?.location || "Не указано"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* About Me Section */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">О себе</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 leading-relaxed">
                              {teacherProfile?.bio || "Расскажите о себе, опыте работы и методах преподавания"}
                            </p>
                          </div>
                        </div>

                        {!profile?.full_name && !teacherProfile?.specialization && (
                          <div className="text-center py-8 text-gray-500">
                            <p className="mb-2">Заполните все разделы профиля, чтобы повысить шансы найти подходящую школу.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Section - Statistics and Actions */}
                  <div className="space-y-6">
                    {/* Statistics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Статистика</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Просмотры профиля:</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">0</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Отклики:</span>
                          <span className="font-medium text-blue-600">{applications.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Сообщения:</span>
                          <span className="font-medium text-green-600">{messages.length}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Действия</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Search className="mr-2 h-4 w-4" />
                          Искать вакансии
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Сообщения
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Award className="mr-2 h-4 w-4" />
                          Сертификаты
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Other tabs content remains the same */}
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
          </div>
        </Tabs>

        {/* Profile Edit Modal */}
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          initialData={currentProfileData}
          onSave={handleProfileSave}
          userType="teacher"
        />
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
