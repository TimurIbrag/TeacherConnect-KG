
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  MessageSquare, 
  Briefcase, 
  User, 
  Check,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Mock notification data - empty for now, will be populated from real data
  const mockNotifications = [
    {
      id: 1,
      type: 'system',
      title: t('notifications.welcomeTitle'),
      content: t('notifications.welcomeContent'),
      timestamp: new Date(Date.now() - 7 * 86400000),
      read: true,
    }
  ];
  
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Check if user is logged in using proper auth context
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      toast({
        title: t('auth.authorizationRequired'),
        description: t('auth.pleaseLoginForNotifications'),
        variant: "destructive",
      });
    }
  }, [user, profile, loading, navigate, toast, t]);
  
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
      title: t('notifications.markedAsRead'),
      description: t('notifications.allMarkedAsRead'),
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
        <h1 className="text-3xl font-bold">{t('notifications.title')}</h1>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <Check className="h-4 w-4 mr-2" />
            {t('notifications.markAllAsRead')}
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            Все
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
            <User className="h-4 w-4" />
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
