
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  User, 
  Check, 
  School 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'Новое сообщение от Школы №5',
    content: 'Здравствуйте! Мы рассмотрели ваше резюме и хотели бы пригласить вас на собеседование.',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: 2,
    type: 'vacancy',
    title: 'Новая вакансия: Учитель математики',
    content: 'В школе "Сейтек" открыта новая вакансия, которая соответствует вашему профилю.',
    timestamp: new Date(Date.now() - 5 * 3600000),
    read: false,
  },
  {
    id: 3,
    type: 'application',
    title: 'Отклик на вакансию',
    content: 'Анна Иванова откликнулась на вашу вакансию учителя английского языка.',
    timestamp: new Date(Date.now() - 2 * 86400000),
    read: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'Добро пожаловать в TeacherConnect KG!',
    content: 'Ваш аккаунт успешно создан. Заполните свой профиль, чтобы найти подходящие предложения.',
    timestamp: new Date(Date.now() - 7 * 86400000),
    read: true,
  },
  {
    id: 5,
    type: 'message',
    title: 'Новое сообщение от Михаила Петрова',
    content: 'У меня есть несколько вопросов по вакансии учителя физики.',
    timestamp: new Date(Date.now() - 1 * 86400000),
    read: true,
  },
];

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    } else {
      // Redirect to login if not logged in
      navigate('/login');
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для доступа к уведомлениям",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);
  
  // Mark notification as read
  const handleMarkAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    
    toast({
      title: "Отмечено как прочитанное",
      description: "Все уведомления отмечены как прочитанные",
    });
  };
  
  // Get notifications for the active tab
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(notif => notif.type === activeTab);
  
  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'vacancy':
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case 'application':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Уведомления</h1>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            Отметить все как прочитанные
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            Все
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="message" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Сообщения
          </TabsTrigger>
          <TabsTrigger value="vacancy" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            Вакансии
          </TabsTrigger>
          <TabsTrigger value="application" className="flex items-center gap-1">
            <School className="h-4 w-4" />
            Отклики
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {activeTab === 'all' ? 'Все уведомления' : 
                 activeTab === 'message' ? 'Сообщения' :
                 activeTab === 'vacancy' ? 'Вакансии' :
                 activeTab === 'application' ? 'Отклики' : 'Уведомления'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={cn(
                        "p-4 border rounded-md transition-colors",
                        notification.read ? "bg-background" : "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className={cn(
                              "font-medium",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </h3>
                            <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                                locale: ru
                              })}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.content}
                          </p>
                          <div className="flex justify-end mt-2">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Отметить как прочитанное
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    У вас нет новых уведомлений
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
