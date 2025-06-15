
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';
import EnhancedAvatarUploader from '@/components/ui/enhanced-avatar-uploader';

export interface ProfileData {
  name: string;
  specialization: string;
  education: string;
  experience: string;
  schedule: string;
  location: string;
  bio: string;
  photoUrl: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
  userType: 'teacher' | 'school';
  onDraftSave?: (data: Partial<ProfileData>) => void;
}

const TEACHER_SUBJECTS = [
  'Русский язык',
  'Русская литература',
  'Кыргызский язык',
  'Кыргызская литература',
  'Английский язык',
  'Немецкий язык',
  'Турецкий язык',
  'Китайский язык',
  'Математика',
  'Алгебра и геометрия',
  'Физика',
  'Химия',
  'Биология',
  'География',
  'История',
  'Общественные и духовные дисциплины',
  'Человек и общество',
  'Основы религиозной культуры',
  'Информатика',
  'Труд / Технология',
  'ИЗО (изобразительное искусство)',
  'Музыка',
  'Физическая культура',
  'Предмет по выбору'
];

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  userType,
  onDraftSave
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [additionalSpecialization, setAdditionalSpecialization] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Auto-save draft if function is provided
    if (onDraftSave) {
      onDraftSave({ [field]: value });
    }
  };

  const handleAdditionalSpecializationChange = (value: string) => {
    setAdditionalSpecialization(value);
    if (onDraftSave) {
      onDraftSave({ additionalSpecialization: value });
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Имя обязательно для заполнения',
        variant: 'destructive',
      });
      return;
    }

    if (userType === 'teacher' && !formData.specialization) {
      toast({
        title: 'Ошибка',
        description: 'Специализация обязательна для заполнения',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      // Combine main specialization with additional info if provided
      let finalSpecialization = formData.specialization;
      if (additionalSpecialization.trim()) {
        finalSpecialization += ` (${additionalSpecialization.trim()})`;
      }

      await onSave({
        ...formData,
        specialization: finalSpecialization
      });
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUploaded = (url: string) => {
    handleInputChange('photoUrl', url);
  };

  const handleAvatarRemoved = () => {
    handleInputChange('photoUrl', '');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Редактировать профиль
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <Label>Фото профиля</Label>
            <EnhancedAvatarUploader
              currentImageUrl={formData.photoUrl}
              onImageUploaded={handleAvatarUploaded}
              onImageRemoved={handleAvatarRemoved}
              className="mx-auto"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Полное имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Введите ваше полное имя"
            />
          </div>

          {/* Specialization */}
          {userType === 'teacher' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialization">Предмет *</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleInputChange('specialization', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите предмет" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {TEACHER_SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Specialization Info */}
              <div className="space-y-2">
                <Label htmlFor="additionalSpecialization">
                  Дополнительная информация о предмете
                </Label>
                <Input
                  id="additionalSpecialization"
                  value={additionalSpecialization}
                  onChange={(e) => handleAdditionalSpecializationChange(e.target.value)}
                  placeholder="Например: подготовка к ОРТ, олимпиады..."
                />
                <p className="text-xs text-muted-foreground">
                  Укажите если ваша специализация не полностью отражена в списке выше
                </p>
              </div>
            </>
          )}

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education">Образование</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="Например: КНУ им. Ж. Баласагына, факультет математики"
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Опыт работы (лет)</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Например: 5"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              {userType === 'teacher' ? 'Предпочитаемые районы' : 'Местоположение'}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={
                userType === 'teacher'
                  ? "Например: Центр, Восток-5, Джал"
                  : "Например: г. Бишкек, ул. Советская 123"
              }
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder={
                userType === 'teacher'
                  ? "Расскажите о своем опыте, методах преподавания, достижениях..."
                  : "Расскажите о вашей школе, особенностях, достижениях..."
              }
              rows={4}
            />
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label htmlFor="schedule">График работы</Label>
            <Select
              value={formData.schedule}
              onValueChange={(value) => handleInputChange('schedule', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Полный день</SelectItem>
                <SelectItem value="part-time">Частичная занятость</SelectItem>
                <SelectItem value="flexible">Гибкий график</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSaving}
            >
              Отменить
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving && <Save className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
