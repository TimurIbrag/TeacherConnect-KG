import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';
import AvatarUploader from '@/components/AvatarUploader';

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

  useEffect(() => {
    setFormData({
      ...initialData,
      languages: initialData.languages || []
    });
  }, [initialData]);

  // Debounced autosave - only save after user stops typing for 2 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onDraftSave && formData !== initialData) {
        onDraftSave(formData);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, onDraftSave, initialData]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    // Removed immediate autosave - now handled by debounced effect above
  };

  const handleAdditionalSpecializationChange = (value: string) => {
    setAdditionalSpecialization(value);
    // Removed immediate autosave - now handled by debounced effect above
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

  const handleImageChange = (file: File | null) => {
    if (file) {
      // Create a preview URL from the file
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <Select
              value={formData.location}
              onValueChange={(value) => handleInputChange('location', value)}
            >
              <SelectTrigger>
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
                Дополн.ая информация о предпочитаемом районе (не отображается в фильтрах)
              </p>
            </div>
          )}

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

              {/* Languages Section - Only for teachers */}
           {userType === 'teacher' && (
             <div className="space-y-4">
               <Label>Языки</Label>
               
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
                          Удалить
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
                  Добавить язык
                </Button>
              </div>
            </div>
          )}

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
