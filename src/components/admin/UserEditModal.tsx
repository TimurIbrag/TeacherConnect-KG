import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserManagementData, UpdateUserData } from '@/hooks/useUserManagement';
import { useUpdateUser } from '@/hooks/useUserManagement';
import { toast } from 'sonner';

interface UserEditModalProps {
  user: UserManagementData | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose
}) => {
  const updateUser = useUpdateUser();
  const [formData, setFormData] = useState<UpdateUserData>({});

  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name,
        phone: user.phone,
        role: user.role
        // Note: Other fields are not available in current schema
        // bio, experience_years, education, skills, languages, availability, hourly_rate,
        // school_name, school_type, school_address, school_website, school_description, school_size
        // will be added when the schema is expanded
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation
    if (!formData.full_name || formData.full_name.trim() === '') {
      toast.error('Полное имя обязательно для заполнения');
      return;
    }

    try {
      await updateUser.mutateAsync({
        userId: user.id,
        updates: formData
      });
      toast.success('Профиль пользователя успешно обновлен');
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Ошибка при обновлении профиля. Попробуйте еще раз.');
    }
  };

  const handleInputChange = (field: keyof UpdateUserData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать профиль: {user.full_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
              <CardDescription>
                Редактируйте основную информацию пользователя
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Полное имя *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Введите полное имя"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Роль</Label>
                <Select
                  value={formData.role || ''}
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Учитель</SelectItem>
                    <SelectItem value="school">Школа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Информация о схеме базы данных</CardTitle>
              <CardDescription>
                Дополнительные поля будут доступны после расширения схемы базы данных
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>В текущей схеме базы данных доступны только основные поля:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Полное имя</li>
                  <li>Телефон</li>
                  <li>Роль (учитель/школа)</li>
                </ul>
                <p className="mt-4">
                  Дополнительные поля (биография, опыт работы, образование, информация о школе и т.д.) 
                  будут добавлены в будущих обновлениях схемы базы данных.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateUser.isPending}>
              Отмена
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Сохранение...
                </>
              ) : (
                'Сохранить изменения'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal; 