import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupportRequest } from '@/hooks/useSupportRequests';
import { useUpdateSupportRequest } from '@/hooks/useSupportRequests';
import { useEmailService } from '@/hooks/useEmailService';
import { toast } from 'sonner';
import { 
  Mail, 
  User, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface SupportRequestModalProps {
  request: SupportRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const SupportRequestModal: React.FC<SupportRequestModalProps> = ({
  request,
  isOpen,
  onClose
}) => {
  const updateSupportRequest = useUpdateSupportRequest();
  const { useSendEmail, useEmailTemplates } = useEmailService();
  const sendEmail = useSendEmail();
  const { data: emailTemplates = [] } = useEmailTemplates();
  
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');

  React.useEffect(() => {
    if (request) {
      setNewStatus(request.status);
      // Pre-fill email subject with request subject
      setEmailSubject(`Re: ${request.subject}`);
    }
  }, [request]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Высокий</Badge>;
      case 'medium':
        return <Badge variant="default">Средний</Badge>;
      case 'low':
        return <Badge variant="secondary">Низкий</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Clock className="w-3 h-3 mr-1" />
          Открыт
        </Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          В работе
        </Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Решен
        </Badge>;
      case 'closed':
        return <Badge variant="secondary">Закрыт</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const handleStatusUpdate = async () => {
    if (!request) return;

    try {
      await updateSupportRequest.mutateAsync({
        id: request.id,
        updates: { status: newStatus as SupportRequest['status'] }
      });
      toast.success('Статус запроса обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  const handleSendEmail = async () => {
    if (!request || !emailSubject.trim() || !emailMessage.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      await sendEmail.mutateAsync({
        to: request.user_email,
        subject: emailSubject,
        message: emailMessage,
        requestId: request.id
      });

      // Update request status to 'in_progress' if it was 'open'
      if (request.status === 'open') {
        await updateSupportRequest.mutateAsync({
          id: request.id,
          updates: { status: 'in_progress' }
        });
      }

      toast.success(`Email отправлен на ${request.user_email}`);
      setEmailMessage('');
      onClose();
    } catch (error) {
      toast.error('Ошибка при отправке email');
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailMessage(template.message);
      setSelectedTemplate(templateId);
    }
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Запрос поддержки: {request.subject}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle>Детали запроса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Пользователь:</span>
                    <span>{request.user_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Email:</span>
                    <span>{request.user_email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Дата создания:</span>
                    <span>{formatDate(request.created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Приоритет:</span>
                    {getPriorityBadge(request.priority)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Статус:</span>
                {getStatusBadge(request.status)}
              </div>
              <div>
                <span className="font-medium">Тема:</span>
                <p className="mt-1 text-gray-700">{request.subject}</p>
              </div>
              <div>
                <span className="font-medium">Сообщение:</span>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{request.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Обновление статуса</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="space-y-2 flex-1">
                  <Label>Новый статус</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Открыт</SelectItem>
                      <SelectItem value="in_progress">В работе</SelectItem>
                      <SelectItem value="resolved">Решен</SelectItem>
                      <SelectItem value="closed">Закрыт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={newStatus === request.status || updateSupportRequest.isPending}
                >
                  {updateSupportRequest.isPending ? 'Обновление...' : 'Обновить статус'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Response */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Отправить ответ по email</span>
              </CardTitle>
              <CardDescription>
                Отправьте ответ пользователю на его email адрес
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emailTemplates.length > 0 && (
                <div className="space-y-2">
                  <Label>Шаблон письма</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите шаблон (необязательно)" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Тема письма</Label>
                <Input
                  id="emailSubject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Тема ответа"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailMessage">Сообщение</Label>
                <Textarea
                  id="emailMessage"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Напишите ответ пользователю..."
                  rows={6}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEmailMessage('');
                    setEmailSubject(`Re: ${request.subject}`);
                  }}
                >
                  Очистить
                </Button>
                <Button 
                  onClick={handleSendEmail}
                  disabled={sendEmail.isPending || !emailSubject.trim() || !emailMessage.trim()}
                >
                  {sendEmail.isPending ? (
                    <>
                      <Send className="w-4 h-4 mr-2 animate-pulse" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportRequestModal; 