import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Award,
  School,
  Activity,
  Eye,
  Edit,
  Ban
} from 'lucide-react';
import { UserManagementData } from '@/hooks/useUserManagement';
import { useUserActivity } from '@/hooks/useUserActivity';
import { useCertificateStatus } from '@/hooks/useCertificateStatus';

interface UserProfileModalProps {
  user: UserManagementData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserManagementData) => void;
  onBan: (user: UserManagementData) => void;
  onWarn: (user: UserManagementData) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onEdit,
  onBan,
  onWarn
}) => {
  const { data: activityData } = useUserActivity();
  const { data: certificateData } = useCertificateStatus();

  if (!user) return null;

  const activity = activityData?.[user.id];
  const certificateStatus = certificateData?.[user.id];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityStatus = () => {
    if (activity?.is_online) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Активен сейчас
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
        Неактивен
      </Badge>
    );
  };

  const getCertificateStatus = () => {
    if (!certificateStatus || certificateStatus.status === 'none') {
      return <Badge variant="outline">Нет сертификатов</Badge>;
    }
    
    switch (certificateStatus.status) {
      case 'pending':
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Ожидают проверки
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Подтверждены
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Отклонены
          </Badge>
        );
      default:
        return <Badge variant="outline">Нет сертификатов</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Профиль пользователя: {user.full_name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onEdit(user)}>
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
            <Button variant="outline" onClick={() => onWarn(user)}>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Отправить предупреждение
            </Button>
            <Button variant="outline" className="text-red-600" onClick={() => onBan(user)}>
              <Ban className="w-4 h-4 mr-2" />
              Заблокировать
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="activity">Активность</TabsTrigger>
              <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
              <TabsTrigger value="resume">Резюме</TabsTrigger>
              <TabsTrigger value="debug">Данные</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Основная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Имя:</span>
                        <span>{user.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Email:</span>
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Телефон:</span>
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Дата регистрации:</span>
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Последний вход:</span>
                        <span>{formatDate(user.last_seen_at)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Статус:</span>
                        {getActivityStatus()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {user.role === 'teacher' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Информация учителя</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {user.experience_years ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Опыт работы:</span>
                          <span>{user.experience_years} лет</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Опыт работы:</span>
                          <span className="text-gray-500">Не указан</span>
                        </div>
                      )}
                      {user.education ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Образование:</span>
                          <span>{user.education}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Образование:</span>
                          <span className="text-gray-500">Не указано</span>
                        </div>
                      )}
                      {user.hourly_rate ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Почасовая ставка:</span>
                          <span>${user.hourly_rate}/час</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Почасовая ставка:</span>
                          <span className="text-gray-500">Не указана</span>
                        </div>
                      )}
                    </div>
                    {user.skills && user.skills.length > 0 ? (
                      <div>
                        <span className="font-medium">Навыки:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium">Навыки:</span>
                        <span className="text-gray-500 ml-2">Не указаны</span>
                      </div>
                    )}
                    {user.languages && user.languages.length > 0 ? (
                      <div>
                        <span className="font-medium">Языки:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.languages.map((language, index) => (
                            <Badge key={index} variant="outline">{language}</Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium">Языки:</span>
                        <span className="text-gray-500 ml-2">Не указаны</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {user.role === 'school' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Информация школы</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {user.school_name ? (
                        <div className="flex items-center space-x-2">
                          <School className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Название школы:</span>
                          <span>{user.school_name}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <School className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Название школы:</span>
                          <span className="text-gray-500">Не указано</span>
                        </div>
                      )}
                      {user.school_type ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Тип школы:</span>
                          <span>{user.school_type}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Тип школы:</span>
                          <span className="text-gray-500">Не указан</span>
                        </div>
                      )}
                      {user.school_size ? (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Размер школы:</span>
                          <span>{user.school_size} учеников</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Размер школы:</span>
                          <span className="text-gray-500">Не указан</span>
                        </div>
                      )}
                    </div>
                    {user.school_address ? (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Адрес:</span>
                        <span>{user.school_address}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Адрес:</span>
                        <span className="text-gray-500">Не указан</span>
                      </div>
                    )}
                    {user.school_website ? (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Веб-сайт:</span>
                        <a href={user.school_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {user.school_website}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Веб-сайт:</span>
                        <span className="text-gray-500">Не указан</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>История активности</CardTitle>
                  <CardDescription>
                    Детальная информация о действиях пользователя на платформе
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Текущий статус:</span>
                      {getActivityStatus()}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Последняя активность:</span>
                      <span>{formatDate(activity?.last_activity || user.last_seen_at)}</span>
                    </div>
                    {activity?.current_page && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Текущая страница:</span>
                        <span className="capitalize">{activity.current_page}</span>
                      </div>
                    )}
                    {activity?.session_duration && activity.session_duration > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Длительность сессии:</span>
                        <span>{Math.floor(activity.session_duration / 60)} мин {activity.session_duration % 60} сек</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Сертификаты и документы</CardTitle>
                  <CardDescription>
                    Статус проверки сертификатов и документов пользователя
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Общий статус:</span>
                      {getCertificateStatus()}
                    </div>
                    {certificateStatus && certificateStatus.status !== 'none' && (
                      <>
                        {certificateStatus.submitted_at && (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Дата подачи:</span>
                            <span>{formatDate(certificateStatus.submitted_at)}</span>
                          </div>
                        )}
                        {certificateStatus.reviewed_at && (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Дата проверки:</span>
                            <span>{formatDate(certificateStatus.reviewed_at)}</span>
                          </div>
                        )}
                        {certificateStatus.reviewed_by && (
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Проверил:</span>
                            <span>{certificateStatus.reviewed_by}</span>
                          </div>
                        )}
                        {certificateStatus.notes && (
                          <div>
                            <span className="font-medium">Примечания:</span>
                            <p className="mt-2 text-sm text-gray-600">{certificateStatus.notes}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Резюме и дополнительная информация</CardTitle>
                </CardHeader>
                <CardContent>
                  {user.bio ? (
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Биография:</span>
                        <p className="mt-2 text-sm text-gray-600">{user.bio}</p>
                      </div>
                      {user.availability ? (
                        <div>
                          <span className="font-medium">Доступность:</span>
                          <p className="mt-2 text-sm text-gray-600">{user.availability}</p>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">Доступность:</span>
                          <p className="mt-2 text-sm text-gray-500">Не указана</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium">Биография:</span>
                        <p className="mt-2 text-sm text-gray-500">Не заполнена</p>
                      </div>
                      <div>
                        <span className="font-medium">Доступность:</span>
                        <p className="mt-2 text-sm text-gray-500">Не указана</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="debug" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Данные пользователя (для разработчиков)</CardTitle>
                  <CardDescription>
                    Показывает все доступные данные пользователя из базы данных
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium">ID пользователя:</span>
                      <span className="ml-2 font-mono text-sm">{user.id}</span>
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{user.email}</span>
                    </div>
                    <div>
                      <span className="font-medium">Полное имя:</span>
                      <span className="ml-2">{user.full_name || 'Не указано'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Роль:</span>
                      <span className="ml-2">{user.role}</span>
                    </div>
                    <div>
                      <span className="font-medium">Телефон:</span>
                      <span className="ml-2">{user.phone || 'Не указан'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Дата регистрации:</span>
                      <span className="ml-2">{formatDate(user.created_at)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Последний вход:</span>
                      <span className="ml-2">{formatDate(user.last_seen_at)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Активен:</span>
                      <span className="ml-2">{user.is_active ? 'Да' : 'Нет'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Профиль заполнен:</span>
                      <span className="ml-2">{user.profile_complete ? 'Да' : 'Нет'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Сертификаты проверены:</span>
                      <span className="ml-2">{user.certificates_verified ? 'Да' : 'Нет'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Количество жалоб:</span>
                      <span className="ml-2">{user.reported_count}</span>
                    </div>
                    <div>
                      <span className="font-medium">Avatar URL:</span>
                      <span className="ml-2">{user.avatar_url || 'Не указан'}</span>
                    </div>
                    
                    {user.role === 'teacher' && (
                      <>
                        <div>
                          <span className="font-medium">Опыт работы:</span>
                          <span className="ml-2">{user.experience_years || 'Не указан'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Образование:</span>
                          <span className="ml-2">{user.education || 'Не указано'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Почасовая ставка:</span>
                          <span className="ml-2">{user.hourly_rate || 'Не указана'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Доступность:</span>
                          <span className="ml-2">{user.availability || 'Не указана'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Биография:</span>
                          <span className="ml-2">{user.bio || 'Не указана'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Навыки:</span>
                          <span className="ml-2">{user.skills?.length ? user.skills.join(', ') : 'Не указаны'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Языки:</span>
                          <span className="ml-2">{user.languages?.length ? user.languages.join(', ') : 'Не указаны'}</span>
                        </div>
                      </>
                    )}
                    
                    {user.role === 'school' && (
                      <>
                        <div>
                          <span className="font-medium">Название школы:</span>
                          <span className="ml-2">{user.school_name || 'Не указано'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Тип школы:</span>
                          <span className="ml-2">{user.school_type || 'Не указан'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Размер школы:</span>
                          <span className="ml-2">{user.school_size || 'Не указан'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Адрес школы:</span>
                          <span className="ml-2">{user.school_address || 'Не указан'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Веб-сайт школы:</span>
                          <span className="ml-2">{user.school_website || 'Не указан'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Описание школы:</span>
                          <span className="ml-2">{user.school_description || 'Не указано'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal; 