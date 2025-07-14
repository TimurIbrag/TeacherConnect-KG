import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Save, Upload, X, Calendar, Clock, FileText, Award, Plus, Trash2, Globe } from 'lucide-react';
import AvatarUploader from '@/components/AvatarUploader';
import { supabase } from '@/integrations/supabase/client';

export interface ProfileData {
  name: string;
  specialization: string;
  education: string;
  experience: string;
  schedule: string;
  location: string;
  locationDetails?: string;
  bio: string;
  photoUrl: string;
  additionalSpecialization?: string;
  languages?: Array<{language: string; level: string;}>;
  dateOfBirth?: string;
  certificates?: string[];
  resumeUrl?: string;
  scheduleDetails?: {
    [day: string]: {
      available: boolean;
      startTime?: string;
      endTime?: string;
    };
  };
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

const DISTRICTS = [
  'Ленинский район',
  'Первомайский район',
  'Октябрьский район',
  'Свердловский район'
];

const LANGUAGE_LEVELS = [
  'Beginner',
  'Pre-Intermediate', 
  'Intermediate',
  'Upper-Intermediate',
  'Advanced',
  'Native'
];

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' }
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
];

const POPULAR_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪' },
  { code: 'mt', name: 'Maltese', native: 'Malti', flag: '🇲🇹' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'be', name: 'Belarusian', native: 'Беларуская', flag: '🇧🇾' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦' },
  { code: 'kk', name: 'Kazakh', native: 'Қазақша', flag: '🇰🇿' },
  { code: 'ky', name: 'Kyrgyz', native: 'Кыргызча', flag: '🇰🇬' },
  { code: 'uz', name: 'Uzbek', native: 'Oʻzbekcha', flag: '🇺🇿' },
  { code: 'fa', name: 'Persian/Farsi', native: 'فارسی', flag: '🇮🇷' },
  { code: 'tg', name: 'Tajik', native: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'tm', name: 'Turkmen', native: 'Türkmençe', flag: '🇹🇲' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол', flag: '🇲🇳' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', native: 'Azərbaycan', flag: '🇦🇿' }
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
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [customLanguage, setCustomLanguage] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    setFormData({
      ...initialData,
      languages: initialData.languages || [],
      scheduleDetails: initialData.scheduleDetails || {},
      certificates: initialData.certificates || []
    });
  }, [initialData]);

  // Debounced autosave
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onDraftSave && formData !== initialData) {
        onDraftSave(formData);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, onDraftSave, initialData]);

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Имя обязательно для заполнения';
    }

    if (userType === 'teacher') {
      if (!formData.specialization.trim()) {
        errors.specialization = 'Специализация обязательна для заполнения';
      }
      if (!formData.education.trim()) {
        errors.education = 'Образование обязательно для заполнения';
      }
      if (!formData.experience.trim()) {
        errors.experience = 'Опыт работы обязателен для заполнения';
      }
      if (!formData.location.trim()) {
        errors.location = 'Местоположение обязательно для заполнения';
      }
      if (!formData.bio.trim()) {
        errors.bio = 'Описание обязательно для заполнения';
      }
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = 'Дата рождения обязательна для заполнения';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAdditionalSpecializationChange = (value: string) => {
    setAdditionalSpecialization(value);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: 'Ошибка валидации',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
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

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          handleInputChange('photoUrl', event.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      handleInputChange('photoUrl', '');
    }
  };

  const addLanguage = () => {
    const languageToAdd = customLanguage.trim() || selectedLanguage;
    if (!languageToAdd || !selectedLevel) {
      toast({
        title: 'Ошибка',
        description: 'Выберите язык и уровень',
        variant: 'destructive',
      });
      return;
    }

    const currentLanguages = formData.languages || [];
    const languageExists = currentLanguages.some(lang => lang.language === languageToAdd);
    
    if (languageExists) {
      toast({
        title: 'Ошибка',
        description: 'Этот язык уже добавлен',
        variant: 'destructive',
      });
      return;
    }

    const updatedLanguages = [...currentLanguages, { language: languageToAdd, level: selectedLevel }];
    setFormData({ ...formData, languages: updatedLanguages });
    setSelectedLanguage('');
    setSelectedLevel('');
    setCustomLanguage('');
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = formData.languages?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, languages: updatedLanguages });
  };

  const getLanguageDisplay = (languageName: string) => {
    const foundLang = POPULAR_LANGUAGES.find(lang => lang.name === languageName || lang.native === languageName);
    if (foundLang) {
      return `${foundLang.flag} ${foundLang.native}`;
    }
    return languageName;
  };

  const uploadResume = async (file: File) => {
    setUploadingResume(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('teacher-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('teacher-documents')
        .getPublicUrl(filePath);

      handleInputChange('resumeUrl', publicUrl);
      toast({
        title: 'Резюме загружено',
        description: 'Резюме успешно загружено',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить резюме',
        variant: 'destructive',
      });
    } finally {
      setUploadingResume(false);
    }
  };

  const uploadCertificate = async (file: File) => {
    setUploadingCertificate(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('teacher-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('teacher-documents')
        .getPublicUrl(filePath);

      const updatedCertificates = [...(formData.certificates || []), publicUrl];
      handleInputChange('certificates', updatedCertificates);
      toast({
        title: 'Сертификат загружен',
        description: 'Сертификат успешно загружен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить сертификат',
        variant: 'destructive',
      });
    } finally {
      setUploadingCertificate(false);
    }
  };

  const removeCertificate = (index: number) => {
    const updatedCertificates = formData.certificates?.filter((_, i) => i !== index) || [];
    handleInputChange('certificates', updatedCertificates);
  };

  const updateSchedule = (day: string, field: string, value: any) => {
    const currentSchedule = formData.scheduleDetails || {};
    const daySchedule = currentSchedule[day] || { available: false };
    
    const updatedSchedule = {
      ...currentSchedule,
      [day]: {
        ...daySchedule,
        [field]: value
      }
    };
    
    handleInputChange('scheduleDetails', updatedSchedule);
  };

  const isFieldRequired = (field: string): boolean => {
    if (userType !== 'teacher') return false;
    
    const requiredFields = ['name', 'specialization', 'education', 'experience', 'location', 'bio', 'dateOfBirth'];
    return requiredFields.includes(field);
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Редактировать профиль
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Photo Upload Section */}
          <div className="space-y-2">
            <Label>Фото профиля</Label>
            <div className="flex justify-center">
              <AvatarUploader
                initialImageUrl={formData.photoUrl}
                onImageChange={handleImageChange}
                size="lg"
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className={isFieldRequired('name') ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
              Полное имя
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Введите ваше полное имя"
              className={getFieldError('name') ? 'border-red-500' : ''}
            />
            {getFieldError('name') && (
              <p className="text-sm text-red-500">{getFieldError('name')}</p>
            )}
          </div>

          {/* Date of Birth - Only for teachers */}
          {userType === 'teacher' && (
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="after:content-['*'] after:ml-0.5 after:text-red-500">
                Дата рождения
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className={getFieldError('dateOfBirth') ? 'border-red-500' : ''}
              />
              {getFieldError('dateOfBirth') && (
                <p className="text-sm text-red-500">{getFieldError('dateOfBirth')}</p>
              )}
            </div>
          )}

          {/* Specialization - Only for teachers */}
          {userType === 'teacher' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialization" className="after:content-['*'] after:ml-0.5 after:text-red-500">
                  Предмет
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleInputChange('specialization', value)}
                >
                  <SelectTrigger className={getFieldError('specialization') ? 'border-red-500' : ''}>
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
                {getFieldError('specialization') && (
                  <p className="text-sm text-red-500">{getFieldError('specialization')}</p>
                )}
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
            <Label htmlFor="education" className={isFieldRequired('education') ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
              Образование
            </Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="Например: КНУ им. Ж. Баласагына, факультет математики"
              className={getFieldError('education') ? 'border-red-500' : ''}
            />
            {getFieldError('education') && (
              <p className="text-sm text-red-500">{getFieldError('education')}</p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience" className={isFieldRequired('experience') ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
              Опыт работы (лет)
            </Label>
            <Input
              id="experience"
              type="number"
              min="0"
              max="50"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Например: 5"
              className={getFieldError('experience') ? 'border-red-500' : ''}
            />
            {getFieldError('experience') && (
              <p className="text-sm text-red-500">{getFieldError('experience')}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className={isFieldRequired('location') ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
              {userType === 'teacher' ? 'Предпочитаемые районы' : 'Местоположение'}
            </Label>
            <Select
              value={formData.location}
              onValueChange={(value) => handleInputChange('location', value)}
            >
              <SelectTrigger className={getFieldError('location') ? 'border-red-500' : ''}>
                <SelectValue placeholder="Выберите район" />
              </SelectTrigger>
              <SelectContent>
                {DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('location') && (
              <p className="text-sm text-red-500">{getFieldError('location')}</p>
            )}
          </div>

          {/* Additional Location Details */}
          {userType === 'teacher' && (
            <div className="space-y-2">
              <Label htmlFor="locationDetails">
                Дополнительная информация о местоположении
              </Label>
              <Input
                id="locationDetails"
                value={formData.locationDetails || ''}
                onChange={(e) => handleInputChange('locationDetails', e.target.value)}
                placeholder="Например: рядом с метро, центр района..."
              />
              <p className="text-xs text-muted-foreground">
                Дополнительная информация о предпочитаемом районе (не отображается в фильтрах)
              </p>
            </div>
          )}

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className={isFieldRequired('bio') ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''}>
              О себе
            </Label>
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
              className={getFieldError('bio') ? 'border-red-500' : ''}
            />
            {getFieldError('bio') && (
              <p className="text-sm text-red-500">{getFieldError('bio')}</p>
            )}
          </div>

          {/* Languages Section - Only for teachers */}
          {userType === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Языки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Languages */}
                {formData.languages && formData.languages.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Добавленные языки:</div>
                    <div className="space-y-2">
                      {formData.languages.map((lang, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="flex items-center gap-2">
                            {getLanguageDisplay(lang.language)} ({lang.level})
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Language Form */}
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="text-sm font-medium">Добавить язык</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="language">Язык</Label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите язык" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {POPULAR_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.name}>
                              {lang.flag} {lang.native}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="level">Уровень</Label>
                      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите уровень" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customLanguage">Или введите другой язык</Label>
                    <Input
                      id="customLanguage"
                      value={customLanguage}
                      onChange={(e) => setCustomLanguage(e.target.value)}
                      placeholder="Например: Киргизский"
                      disabled={!!selectedLanguage}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={addLanguage}
                    disabled={(!selectedLanguage && !customLanguage.trim()) || !selectedLevel}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить язык
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schedule Management - Only for teachers */}
          {userType === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Расписание доступности
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedule = formData.scheduleDetails?.[day.key] || { available: false };
                  
                  return (
                    <div key={day.key} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`available-${day.key}`}
                          checked={daySchedule.available}
                          onCheckedChange={(checked) => 
                            updateSchedule(day.key, 'available', checked)
                          }
                        />
                        <Label htmlFor={`available-${day.key}`} className="font-medium">
                          {day.label}
                        </Label>
                      </div>
                      
                      {daySchedule.available && (
                        <div className="grid grid-cols-2 gap-3 ml-6">
                          <div>
                            <Label htmlFor={`start-${day.key}`}>Время начала</Label>
                            <Select
                              value={daySchedule.startTime || ''}
                              onValueChange={(value) => updateSchedule(day.key, 'startTime', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите время" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_SLOTS.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor={`end-${day.key}`}>Время окончания</Label>
                            <Select
                              value={daySchedule.endTime || ''}
                              onValueChange={(value) => updateSchedule(day.key, 'endTime', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите время" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_SLOTS.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Resume Upload - Only for teachers */}
          {userType === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Резюме
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.resumeUrl ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-800">Резюме загружено</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleInputChange('resumeUrl', '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadResume(file);
                      }}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                    <Label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {uploadingResume ? 'Загрузка...' : 'Загрузить резюме'}
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF, DOC, DOCX, JPG, PNG (макс. 10MB)
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Certificates Upload - Only for teachers */}
          {userType === 'teacher' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Сертификаты и дипломы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Certificates */}
                {formData.certificates && formData.certificates.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Загруженные документы:</div>
                    <div className="space-y-2">
                      {formData.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <span className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span className="text-sm">Сертификат {index + 1}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(cert, '_blank')}
                            >
                              Просмотр
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertificate(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Certificate */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="certificate-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadCertificate(file);
                    }}
                    className="hidden"
                    disabled={uploadingCertificate}
                  />
                  <Label htmlFor="certificate-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {uploadingCertificate ? 'Загрузка...' : 'Загрузить сертификат'}
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG (макс. 10MB)
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

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
