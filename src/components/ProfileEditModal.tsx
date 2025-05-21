
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

interface ProfileData {
  name: string;
  specialization: string;
  education: string;
  experience: string;
  schedule: string;
  location: string;
  bio: string;
  photoUrl: string;
}

// Default empty profile data
export const emptyProfileData: ProfileData = {
  name: '',
  specialization: '',
  education: '',
  experience: '',
  schedule: 'full-time',
  location: '',
  bio: '',
  photoUrl: '',
};

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProfileData;
  onSave: (data: ProfileData) => void;
  userType: 'teacher' | 'school';
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  userType,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  
  // Use a ref for initial data to prevent unnecessary re-renders
  const initialDataRef = React.useRef<ProfileData | undefined>(initialData);
  
  // Local state for form data
  const [formData, setFormData] = useState<ProfileData>({
    ...emptyProfileData,
    ...(initialData || {})
  });
  
  // Update local state when modal opens with new initial data
  useEffect(() => {
    if (isOpen) {
      // Use empty profile data if no initial data is provided
      const dataToUse = initialData || emptyProfileData;
      initialDataRef.current = dataToUse;
      setFormData({...dataToUse});
      setFormChanged(false);
    }
  }, [initialData, isOpen]);
  
  // Track form changes with memoized handler
  const handleChange = React.useCallback((field: keyof ProfileData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
    setFormChanged(true);
  }, []);
  
  // Handle image upload
  const handleImageChange = React.useCallback((file: File | null) => {
    setPhoto(file);
    if (file) {
      // Create a temporary URL for preview
      const tempUrl = URL.createObjectURL(file);
      handleChange('photoUrl', tempUrl);
    } else {
      handleChange('photoUrl', '');
    }
  }, [handleChange]);
  
  // Handle form submission
  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here would be logic to upload photo if it changed
      // and save data through API
      
      onSave(formData);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши изменения успешно сохранены",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: "Произошла ошибка при сохранении профиля",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Prevent dialog close during loading
  const handleDialogClose = () => {
    if (!isLoading) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>
            {userType === 'teacher' 
              ? 'Обновите информацию своего преподавательского профиля' 
              : 'Обновите информацию о вашей школе'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-center mb-4">
            <AvatarUploader 
              initialImageUrl={formData.photoUrl} 
              onImageChange={handleImageChange}
              size="lg"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {userType === 'teacher' ? 'ФИО' : 'Название школы'}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">
                {userType === 'teacher' ? 'Специализация' : 'Специализация школы'}
              </Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleChange('specialization', e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education">
                  {userType === 'teacher' ? 'Образование' : 'Тип школы'}
                </Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleChange('education', e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">
                  {userType === 'teacher' ? 'Опыт работы' : 'Год основания'}
                </Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule">График работы</Label>
                <Select 
                  value={formData.schedule} 
                  onValueChange={(value) => handleChange('schedule', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="schedule">
                    <SelectValue placeholder="Выберите график" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Полный день</SelectItem>
                    <SelectItem value="part-time">Неполный день</SelectItem>
                    <SelectItem value="flexible">Гибкий график</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">
                  {userType === 'teacher' ? 'Предпочитаемый район' : 'Адрес'}
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Описание</Label>
              <Textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!formChanged || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditModal;
