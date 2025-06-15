
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTeacherProfile } from '@/hooks/useTeacherProfile';
import { useTeacherApplications } from '@/hooks/useApplications';
import { useUserMessages } from '@/hooks/useMessages';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Eye, User, MessageSquare, Bookmark, GraduationCap, Calendar, MapPin, Search, MessageCircle, Award, Phone, Mail, Briefcase, Edit, FileText, Save, Clock, Globe, Lock } from 'lucide-react';
import EnhancedAvatarUploader from '@/components/ui/enhanced-avatar-uploader';
import ProfileEditModal, { ProfileData } from '@/components/ProfileEditModal';

const TeacherDashboardPage = () => {
  const { t } = useLanguage();
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { teacherProfile, loading: profileLoading, updateTeacherProfile } = useTeacherProfile();
  const { data: applications = [], isLoading: applicationsLoading } = useTeacherApplications();
  const { data: messages = [], isLoading: messagesLoading } = useUserMessages();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isPublished, setIsPublished] = useState(false);

  // Load published status from localStorage on mount
  useEffect(() => {
    const publishedStatus = localStorage.getItem('teacherProfilePublished');
    setIsPublished(publishedStatus === 'true');
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleAvatarUploaded = async (url: string) => {
    try {
      setIsAutoSaving(true);
      await updateProfile({ avatar_url: url });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
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
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleAvatarRemoved = async () => {
    try {
      setIsAutoSaving(true);
      await updateProfile({ avatar_url: null });
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
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
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleProfileSave = async (data: ProfileData) => {
    try {
      setIsAutoSaving(true);
      
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
        location: data.location,
        bio: data.bio
      });

      // Save profile data to localStorage for published profiles
      if (isPublished) {
        const profileForPublish = {
          fullName: data.name,
          specialization: data.specialization,
          education: data.education,
          experience: data.experience,
          location: data.location,
          bio: data.bio,
          schedule: data.schedule,
          photoUrl: data.photoUrl,
          skills: teacherProfile?.skills || [],
          languages: teacherProfile?.languages || []
        };
        localStorage.setItem('teacherProfileData', JSON.stringify(profileForPublish));
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      toast({
        title: 'Профиль обновлен',
        description: 'Изменения успешно сохранены и отображаются немедленно',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    } finally {
      setIsAutoSaving(false);
    }
  };

  // Handle publish/unpublish toggle
  const handlePublishToggle = (checked: boolean) => {
    setIsPublished(checked);
    localStorage.setItem('teacherProfilePublished', checked.toString());

    if (checked) {
      // Save current profile data for publishing
      const profileForPublish = {
        fullName: profile?.full_name || '',
        specialization: teacherProfile?.specialization || '',
        education: teacherProfile?.education || '',
        experience: teacherProfile?.experience_years?.toString() || '',
        location: teacherProfile?.location || '',
        bio: teacherProfile?.bio || '',
        schedule: 'full-time',
        photoUrl: profile?.avatar_url || '',
        skills: teacherProfile?.skills || [],
        languages: teacherProfile?.languages || []
      };
      localStorage.setItem('teacherProfileData', JSON.stringify(profileForPublish));
      
      toast({
        title: 'Профиль опубликован',
        description: 'Ваш профиль теперь виден на странице преподавателей',
      });
    } else {
      localStorage.removeItem('teacherProfileData');
      toast({
        title: 'Профиль скрыт',
        description: 'Ваш профиль больше не отображается публично',
      });
    }
  };

  // Auto-save draft data to localStorage
  const saveDraftToLocalStorage = (data: Partial<ProfileData>) => {
    try {
      const existingDraft = localStorage.getItem('teacher_profile_draft');
      const draft = existingDraft ? JSON.parse(existingDraft) : {};
      const updatedDraft = { ...draft, ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem('teacher_profile_draft', JSON.stringify(updatedDraft));
      setHasUnsavedChanges(true);
      
      // Show auto-save indicator
      toast({
        title: 'Черновик сохранен',
        description: 'Ваши изменения сохранены локально',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  // Load draft from localStorage
  const loadDraftFromLocalStorage = (): Partial<ProfileData> | null => {
    try {
      const draft = localStorage.getItem('teacher_profile_draft');
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem('teacher_profile_draft');
    setHasUnsavedChanges(false);
  };

  // Handle action buttons
  const handleSearchVacancies = () => {
    navigate('/schools');
  };

  const handleMessages = () => {
    navigate('/messages');
  };

  const handleCertificates = () => {
    toast({
      title: 'Скоро будет доступно',
      description: 'Функция сертификатов находится в разработке. Следите за обновлениями!',
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

  const unreadMessages = messages.filter(msg => !msg.read && msg.recipient_id === user?.id).length;
  
  // Prepare profile data for edit modal with draft support
  const draft = loadDraftFromLocalStorage();
  const currentProfileData: ProfileData = {
    name: draft?.name || profile?.full_name || '',
    specialization: draft?.specialization || teacherProfile?.specialization || '',
    education: draft?.education || teacherProfile?.education || '',
    experience: draft?.experience || teacherProfile?.experience_years?.toString() || '',
    schedule: draft?.schedule || 'full-time',
    location: draft?.location || teacherProfile?.location || '',
    bio: draft?.bio || teacherProfile?.bio || '',
    photoUrl: draft?.photoUrl || profile?.avatar_url || ''
  };

  const isProfileComplete = profile?.full_name && teacherProfile?.specialization && teacherProfile?.bio;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Auto-save Status */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Личный кабинет учителя
            </h1>
            <div className="flex items-center gap-4">
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Save className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Сохранение...</span>
                </div>
              )}
              {lastSaved && !isAutoSaving && (
                <div className="flex items-center gap-2 text-green-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">
                    Сохранено {lastSaved.toLocaleTimeString()}
                  </span>
                </div>
              )}
              {hasUnsavedChanges && !isAutoSaving && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Есть несохраненные изменения</span>
                </div>
              )}
            </div>
          </div>
        </div>

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
                        <p className="text-gray-900">Полный день</p>
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

                {/* Profile Visibility Section */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {isPublished ? (
                        <Globe className="h-5 w-5 text-green-600" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {isPublished ? "Профиль опубликован" : "Профиль скрыт"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isPublished 
                            ? "Ваш профиль виден на странице преподавателей"
                            : "Только вы можете видеть ваш профиль"
                          }
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={isPublished}
                      onCheckedChange={handlePublishToggle}
                      disabled={!isProfileComplete}
                    />
                  </div>
                  
                  {!isProfileComplete && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        Заполните обязательные поля профиля (имя, специализация, описание) для публикации
                      </p>
                    </div>
                  )}
                </div>
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={handleSearchVacancies}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Искать вакансии
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={handleMessages}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Сообщения
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={handleCertificates}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Сертификаты
                </Button>
              </CardContent>
            </Card>

            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Дополнительно</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left p-2" 
                  size="sm"
                  onClick={() => setActiveTab('applications')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex justify-between items-center w-full">
                    <span>Отклики на вакансии</span>
                    {applications.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {applications.length}
                      </Badge>
                    )}
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left p-2" 
                  size="sm"
                  onClick={() => setActiveTab('messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <div className="flex justify-between items-center w-full">
                    <span>Сообщения</span>
                    {unreadMessages > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {unreadMessages}
                      </Badge>
                    )}
                  </div>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left p-2" 
                  size="sm"
                  onClick={() => setActiveTab('saved')}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Сохраненные
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsContent value="applications">
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
                    <Button variant="outline" onClick={handleSearchVacancies}>
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

          <TabsContent value="messages">
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

          <TabsContent value="saved">
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
        </Tabs>

        {/* Enhanced Profile Edit Modal with Auto-save */}
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            if (!hasUnsavedChanges) {
              clearDraft();
            }
          }}
          initialData={currentProfileData}
          onSave={(data) => {
            handleProfileSave(data);
            clearDraft(); // Clear draft after successful save
          }}
          userType="teacher"
          onDraftSave={saveDraftToLocalStorage} // Pass auto-save function
        />
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
