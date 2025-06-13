
import React, { useState, useEffect, useCallback } from 'react';
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
import { Loader2, Save, Clock } from 'lucide-react';
import AvatarUploader from './AvatarUploader';

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

// Default empty profile data - completely empty with no default values
export const emptyProfileData: ProfileData = {
  name: '',
  specialization: '',
  education: '',
  experience: '',
  schedule: 'full-time', // Only keeping default for dropdown
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
  onDraftSave?: (data: Partial<ProfileData>) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  userType,
  onDraftSave,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  
  // Use local state for form data without any default values
  const [formData, setFormData] = useState<ProfileData>(emptyProfileData);
  
  // Update local state when modal opens with new initial data
  useEffect(() => {
    if (isOpen) {
      // If initialData is provided, use it; otherwise use empty data
      const dataToUse = initialData || {...emptyProfileData};
      setFormData({...dataToUse});
      setFormChanged(false);
      setPhotoRemoved(false);
      
      // Reset photo state when modal opens
      setPhoto(null);
    }
  }, [isOpen, initialData]);

  // Auto-save functionality with debouncing
  const debouncedAutoSave = useCallback(
    debounce((data: ProfileData) => {
      if (onDraftSave && formChanged) {
        onDraftSave(data);
        setLastAutoSaved(new Date());
      }
    }, 2000), // 2 second delay
    [onDraftSave, formChanged]
  );

  // Auto-save when form data changes
  useEffect(() => {
    if (formChanged && isOpen) {
      debouncedAutoSave(formData);
    }
  }, [formData, formChanged, isOpen, debouncedAutoSave]);
  
  // Track form changes with memoized handler
  const handleChange = React.useCallback((field: keyof ProfileData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return newData;
    });
    setFormChanged(true);
  }, []);
  
  // Handle image upload with proper storage
  const handleImageChange = React.useCallback((file: File | null) => {
    console.log("Image change received:", file ? file.name : "null");
    
    setPhoto(file);
    
    if (file) {
      // Create a temporary URL for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          handleChange('photoUrl', event.target.result);
          setPhotoRemoved(false);
        }
      };
      reader.readAsDataURL(file);
      setFormChanged(true);
    } else {
      // Photo was removed
      handleChange('photoUrl', '');
      setPhotoRemoved(true);
      setFormChanged(true);
    }
  }, [handleChange]);
  
  // Handle form submission with improved photo handling
  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // In a real application with a backend:
      // 1. First upload the photo to storage service and get a permanent URL
      // 2. Then save the form data with the permanent photo URL
      
      // For now, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare final form data
      let finalFormData = { ...formData };
      
      // Handle photo removal case
      if (photoRemoved) {
        finalFormData.photoUrl = '';
        console.log("Saving profile with photo removed");
      } else if (photo) {
        // New photo was uploaded and cropped
        console.log("Saving profile with new photo:", photo.name, photo.size);
        // The photoUrl is already set in formData from the handleImageChange function
      }
      
      // Save data
      onSave(finalFormData);
      
      toast({
        title: "Профиль обновлен",
        description: "Ваши изменения успешно сохранены и отображаются немедленно",
      });
      
      setFormChanged(false);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
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

  // Update local state when modal opens with new initial data
  useEffect(() => {
    if (isOpen) {
      // If initialData is provided, use it; otherwise use empty data
      const dataToUse = initialData || {...emptyProfileData};
      setFormData({...dataToUse});
      setFormChanged(false);
      setPhotoRemoved(false);
      
      // Reset photo state when modal opens
      setPhoto(null);
    }
  }, [isOpen, initialData]);
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Редактировать профиль</span>
            {lastAutoSaved && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Save className="h-4 w-4" />
                <span>Сохранен {lastAutoSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </DialogTitle>
          <DialogDescription>
            {userType === 'teacher' 
              ? 'Обновите информацию своего преподавательского профиля. Изменения автоматически сохраняются как черновик.' 
              : 'Обновите информацию о вашей школе. Изменения автоматически сохраняются как черновик.'}
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
                placeholder={userType === 'teacher' ? 'Введите ваше полное имя' : 'Введите название школы'}
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
                placeholder={userType === 'teacher' ? 'Например: Учитель английского языка' : 'Например: Языковая школа'}
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
                  placeholder={userType === 'teacher' ? 'Укажите ваше образование' : 'Укажите тип школы'}
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
                  placeholder={userType === 'teacher' ? 'Например: 5 лет' : 'Например: 2010'}
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
                  placeholder={userType === 'teacher' ? 'Например: Бишкек, центр' : 'Полный адрес школы'}
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
                placeholder={userType === 'teacher' 
                  ? 'Расскажите о своём опыте, методах преподавания и специализации' 
                  : 'Расскажите о вашей школе, программах и преимуществах'}
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
            disabled={isLoading}
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

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

export default ProfileEditModal;
