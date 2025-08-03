import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserManagementData } from '@/hooks/useUserManagement';
import { toast } from 'sonner';
import { AlertTriangle, MessageSquare } from 'lucide-react';

interface UserWarningModalProps {
  user: UserManagementData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserWarningModal: React.FC<UserWarningModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const [warningType, setWarningType] = useState<string>('general');
  const [warningTitle, setWarningTitle] = useState<string>('');
  const [warningDescription, setWarningDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!warningTitle.trim() || !warningDescription.trim()) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store warning in localStorage (in production, this would go to a database)
      const warning = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.full_name,
        userEmail: user.email,
        type: warningType,
        title: warningTitle,
        description: warningDescription,
        sentAt: new Date().toISOString(),
        sentBy: 'Admin', // In production, this would be the actual admin user
        isRead: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      };

      const existingWarnings = localStorage.getItem('user_warnings');
      const warnings = existingWarnings ? JSON.parse(existingWarnings) : [];
      warnings.push(warning);
      localStorage.setItem('user_warnings', JSON.stringify(warnings));

      toast.success(`Предупреждение отправлено пользователю ${user.full_name}`);
      onClose();
      
      // Reset form
      setWarningType('general');
      setWarningTitle('');
      setWarningDescription('');
    } catch (error) {
      toast.error('Ошибка при отправке предупреждения');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span>Отправить предупреждение</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о пользователе</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Имя:</span>
                <span>{user.full_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Роль:</span>
                <span>{user.role === 'teacher' ? 'Учитель' : 'Школа'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Детали предупреждения</CardTitle>
              <CardDescription>
                Заполните информацию о предупреждении
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="warningType">Тип предупреждения</Label>
                <Select value={warningType} onValueChange={setWarningType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип предупреждения" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Общее предупреждение</SelectItem>
                    <SelectItem value="behavior">Нарушение поведения</SelectItem>
                    <SelectItem value="content">Неподходящий контент</SelectItem>
                    <SelectItem value="spam">Спам</SelectItem>
                    <SelectItem value="security">Проблемы безопасности</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warningTitle">Заголовок предупреждения</Label>
                <Input
                  id="warningTitle"
                  value={warningTitle}
                  onChange={(e) => setWarningTitle(e.target.value)}
                  placeholder="Краткое описание проблемы"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warningDescription">Описание проблемы</Label>
                <Textarea
                  id="warningDescription"
                  value={warningDescription}
                  onChange={(e) => setWarningDescription(e.target.value)}
                  placeholder="Подробно опишите проблему и что нужно исправить..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Предварительный просмотр</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    {warningTitle || 'Заголовок предупреждения'}
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  {warningDescription || 'Описание предупреждения будет отображаться здесь...'}
                </p>
                <div className="mt-2 text-xs text-yellow-600">
                  Отправлено: {new Date().toLocaleDateString('ru-RU')}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              variant="default"
              disabled={isSubmitting || !warningTitle.trim() || !warningDescription.trim()}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить предупреждение'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserWarningModal; 