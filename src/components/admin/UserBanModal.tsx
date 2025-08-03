import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserManagementData } from '@/hooks/useUserManagement';
import { useSuspendUser } from '@/hooks/useUserManagement';
import { toast } from 'sonner';
import { Ban, Clock, AlertTriangle } from 'lucide-react';

interface UserBanModalProps {
  user: UserManagementData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserBanModal: React.FC<UserBanModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const suspendUser = useSuspendUser();
  const [banType, setBanType] = useState<'temporary' | 'permanent'>('temporary');
  const [banDuration, setBanDuration] = useState<string>('1');
  const [customHours, setCustomHours] = useState<string>('');
  const [banReason, setBanReason] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Calculate ban duration
      let durationHours = 0;
      if (banType === 'temporary') {
        if (banDuration === 'custom') {
          durationHours = parseInt(customHours) || 0;
        } else {
          durationHours = parseInt(banDuration);
        }
      }

      // Store ban information in localStorage (in production, this would go to a database)
      const banInfo = {
        userId: user.id,
        userName: user.full_name,
        banType,
        durationHours,
        reason: banReason,
        bannedAt: new Date().toISOString(),
        bannedUntil: banType === 'permanent' ? null : new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString()
      };

      const existingBans = localStorage.getItem('user_bans');
      const bans = existingBans ? JSON.parse(existingBans) : [];
      bans.push(banInfo);
      localStorage.setItem('user_bans', JSON.stringify(bans));

      // Suspend the user
      await suspendUser.mutateAsync(user.id);

      const durationText = banType === 'permanent' 
        ? 'навсегда' 
        : `${durationHours} ${durationHours === 1 ? 'час' : durationHours < 5 ? 'часа' : 'часов'}`;

      toast.success(`Пользователь ${user.full_name} заблокирован ${durationText}`);
      onClose();
    } catch (error) {
      toast.error('Ошибка при блокировке пользователя');
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Ban className="w-5 h-5 text-red-600" />
            <span>Заблокировать пользователя</span>
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
              <CardTitle>Тип блокировки</CardTitle>
              <CardDescription>
                Выберите тип и продолжительность блокировки
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={banType} onValueChange={(value: 'temporary' | 'permanent') => setBanType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="temporary" id="temporary" />
                  <Label htmlFor="temporary" className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Временная блокировка</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="permanent" id="permanent" />
                  <Label htmlFor="permanent" className="flex items-center space-x-2">
                    <Ban className="w-4 h-4" />
                    <span>Постоянная блокировка</span>
                  </Label>
                </div>
              </RadioGroup>

              {banType === 'temporary' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Продолжительность блокировки</Label>
                    <Select value={banDuration} onValueChange={setBanDuration}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите продолжительность" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 час</SelectItem>
                        <SelectItem value="3">3 часа</SelectItem>
                        <SelectItem value="24">24 часа</SelectItem>
                        <SelectItem value="72">3 дня</SelectItem>
                        <SelectItem value="168">1 неделя</SelectItem>
                        <SelectItem value="custom">Другое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {banDuration === 'custom' && (
                    <div className="space-y-2">
                      <Label htmlFor="customHours">Количество часов</Label>
                      <Input
                        id="customHours"
                        type="number"
                        min="1"
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                        placeholder="Введите количество часов"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Причина блокировки</CardTitle>
              <CardDescription>
                Укажите причину блокировки (обязательно)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Опишите причину блокировки..."
                rows={3}
                required
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              variant="destructive" 
              disabled={suspendUser.isPending || !banReason.trim()}
            >
              {suspendUser.isPending ? 'Блокировка...' : 'Заблокировать'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserBanModal; 