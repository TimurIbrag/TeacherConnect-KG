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
        bio: user.bio,
        experience_years: user.experience_years,
        education: user.education,
        skills: user.skills,
        languages: user.languages,
        availability: user.availability,
        hourly_rate: user.hourly_rate,
        school_name: user.school_name,
        school_type: user.school_type,
        school_address: user.school_address,
        school_website: user.school_website,
        school_description: user.school_description,
        school_size: user.school_size,
        school_levels: user.school_levels
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Полное имя</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Биография</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                />
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
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Опыт работы (лет)</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={formData.experience_years || ''}
                      onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Почасовая ставка ($)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      value={formData.hourly_rate || ''}
                      onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Образование</Label>
                  <Input
                    id="education"
                    value={formData.education || ''}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Доступность</Label>
                  <Input
                    id="availability"
                    value={formData.availability || ''}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    placeholder="Например: Пн-Пт, 9:00-18:00"
                  />
                </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="school_name">Название школы</Label>
                    <Input
                      id="school_name"
                      value={formData.school_name || ''}
                      onChange={(e) => handleInputChange('school_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_type">Тип школы</Label>
                    <Select
                      value={formData.school_type || ''}
                      onValueChange={(value) => handleInputChange('school_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип школы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Государственная</SelectItem>
                        <SelectItem value="private">Частная</SelectItem>
                        <SelectItem value="international">Международная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school_size">Размер школы (учеников)</Label>
                    <Input
                      id="school_size"
                      type="number"
                      value={formData.school_size || ''}
                      onChange={(e) => handleInputChange('school_size', parseInt(e.target.value) || undefined)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school_website">Веб-сайт</Label>
                    <Input
                      id="school_website"
                      value={formData.school_website || ''}
                      onChange={(e) => handleInputChange('school_website', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school_address">Адрес</Label>
                  <Input
                    id="school_address"
                    value={formData.school_address || ''}
                    onChange={(e) => handleInputChange('school_address', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school_description">Описание школы</Label>
                  <Textarea
                    id="school_description"
                    value={formData.school_description || ''}
                    onChange={(e) => handleInputChange('school_description', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

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