import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { 
  Award,
  BookOpen,
  Building,
  Calendar,
  Camera,
  Edit,
  Eye, 
  FileText, 
  GraduationCap, 
  Heart, 
  Home, 
  Mail, 
  MessageSquare, 
  Plus, 
  Search,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  UserRound,
  Upload
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ProfileEditModal, { emptyProfileData, ProfileData } from '@/components/ProfileEditModal';

// Types for weekdays and time slots
type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type TimeSlot = '8:00-10:00' | '10:00-12:00' | '12:00-14:00' | '14:00-16:00' | '16:00-18:00' | '18:00-20:00';

// Data for flexible schedule
const weekDays: { id: WeekDay; label: string }[] = [
  { id: 'monday', label: 'Понедельник' },
  { id: 'tuesday', label: 'Вторник' },
  { id: 'wednesday', label: 'Среда' },
  { id: 'thursday', label: 'Четверг' },
  { id: 'friday', label: 'Пятница' },
  { id: 'saturday', label: 'Суббота' },
  { id: 'sunday', label: 'Воскресенье' },
];

const timeSlots: TimeSlot[] = [
  '8:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
];

type ScheduleItem = {
  day: WeekDay;
  slots: TimeSlot[];
};

type ProfileFormData = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  education: string;
  experience: string;
  skills: string[];
  languages: string[];
  bio: string;
  cv: File | null;
  portfolio: File[];
  schedule: ScheduleItem[];
  hourlyRate: string;
  groupRate: string;
  availability: 'full-time' | 'part-time' | 'remote';
  workScheduleType: string;
  districts: string;
  about: string;
};

type CertificateType = {
  id: string;
  name: string;
  date: string;
  file?: File;
};

// Helper function to get stored profile data or empty data
const getStoredProfile = (): ProfileFormData => {
  try {
    const storedData = localStorage.getItem('teacherProfileData');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      // Ensure schedule is always an array and add missing properties
      return {
        ...parsed,
        schedule: Array.isArray(parsed.schedule) ? parsed.schedule : [],
        workScheduleType: parsed.workScheduleType || '',
        districts: parsed.districts || '',
        about: parsed.about || parsed.bio || ''
      };
    }
  } catch (error) {
    console.error("Error loading profile data:", error);
  }
  
  return {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    specialization: '',
    education: '',
    experience: '',
    skills: [],
    languages: [],
    bio: '',
    cv: null,
    portfolio: [],
    schedule: [],
    hourlyRate: '',
    groupRate: '',
    availability: 'full-time' as const,
    workScheduleType: '',
    districts: '',
    about: ''
  };
};

// Map ProfileFormData to ProfileData for the modal
const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real app, check authorization
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPublished, setIsPublished] = useState(() => {
    // Check if profile is published from localStorage
    try {
      return localStorage.getItem('teacherProfilePublished') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Initialize with empty data or data from localStorage
  const [profileData, setProfileData] = useState<ProfileFormData>(getStoredProfile());
  
  // State for profile photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    // Try to restore profile photo from localStorage
    try {
      return localStorage.getItem('userProfilePhoto') || null;
    } catch (e) {
      return null;
    }
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // State for certificates
  const [certificates, setCertificates] = useState<CertificateType[]>(() => {
    try {
      const storedCertificates = localStorage.getItem('teacherCertificates');
      return storedCertificates ? JSON.parse(storedCertificates) : [];
    } catch (e) {
      return [];
    }
  });
  const [showCertificatesDialog, setShowCertificatesDialog] = useState(false);
  
  // State for stats
  const [stats, setStats] = useState({
    profileViews: 0,
    responses: 0,
    messages: 0
  });
  
  // Using useForm with defaultValues
  const form = useForm<ProfileFormData>({
    defaultValues: profileData
  });

  // Handler for publishing profile
  const handlePublishProfile = () => {
    // Check if required fields are filled
    const requiredFields = ['fullName', 'specialization', 'education', 'experience'];
    const missingFields = requiredFields.filter(field => !profileData[field as keyof ProfileFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Заполните профиль",
        description: "Пожалуйста, заполните все обязательные поля перед публикацией профиля",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPublished(true);
      try {
        localStorage.setItem('teacherProfilePublished', 'true');
      } catch (error) {
        console.error("Error saving published status:", error);
      }
      
      setIsPublishing(false);
      
      toast({
        title: "Профиль опубликован",
        description: "Ваш профиль теперь виден в каталоге учителей",
      });
    }, 1000);
  };

  // Handler for unpublishing profile
  const handleUnpublishProfile = () => {
    setIsPublishing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsPublished(false);
      try {
        localStorage.setItem('teacherProfilePublished', 'false');
      } catch (error) {
        console.error("Error saving published status:", error);
      }
      
      setIsPublishing(false);
      
      toast({
        title: "Профиль скрыт",
        description: "Ваш профиль больше не виден в каталоге учителей",
      });
    }, 1000);
  };
  
  // Initialize form when profileData changes, but only when not in edit mode
  useEffect(() => {
    if (!editMode) {
      form.reset(profileData);
    }
  }, [profileData, form, editMode]);
  
  // Function to save profile
  const saveProfile = (data: ProfileFormData) => {
    setIsUpdating(true);
    
    // Save to localStorage
    try {
      localStorage.setItem('teacherProfileData', JSON.stringify(data));
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
    
    // Simulate API call
    setTimeout(() => {
      setProfileData(data);
      setEditMode(false);
      setIsUpdating(false);
      
      toast({
        title: "Профиль сохранен",
        description: "Ваши данные успешно обновлены",
      });
    }, 1000);
  };
  
  // Function to handle profile photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setPhotoPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handler for adding certificate
  const handleAddCertificate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCertificate: CertificateType = {
      id: Date.now().toString(),
      name: formData.get('certificateName') as string,
      date: formData.get('certificateDate') as string,
    };
    
    // Add file if uploaded
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      newCertificate.file = fileInput.files[0];
    }
    
    const updatedCertificates = [...certificates, newCertificate];
    setCertificates(updatedCertificates);
    
    // Save to localStorage
    try {
      localStorage.setItem('teacherCertificates', JSON.stringify(updatedCertificates));
    } catch (error) {
      console.error("Error saving certificates:", error);
    }
    
    // Reset form
    e.currentTarget.reset();
    
    toast({
      title: "Сертификат добавлен",
      description: `Сертификат "${newCertificate.name}" успешно добавлен`,
    });
  };
  
  // Handler for deleting certificate
  const handleDeleteCertificate = (id: string) => {
    const updatedCertificates = certificates.filter(cert => cert.id !== id);
    setCertificates(updatedCertificates);
    
    // Save to localStorage
    try {
      localStorage.setItem('teacherCertificates', JSON.stringify(updatedCertificates));
    } catch (error) {
      console.error("Error saving certificates after delete:", error);
    }
    
    toast({
      title: "Сертификат удален",
      description: "Сертификат успешно удален из вашего профиля",
    });
  };
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  // Handle profile update with photo
  const handleProfileSave = (data: ProfileData) => {
    // Convert ProfileData back to ProfileFormData for saving
    const updatedProfileData: ProfileFormData = {
      ...profileData,
      fullName: data.name,
      specialization: data.specialization,
      education: data.education,
      experience: data.experience,
      schedule: data.schedule,
      districts: data.location,
      about: data.bio,
    };
    
    // Save the profile data
    setProfileData(updatedProfileData);
    
    // If there's a photo URL in the data, save it separately
    if (data.photoUrl) {
      setProfilePhoto(data.photoUrl);
      try {
        localStorage.setItem('userProfilePhoto', data.photoUrl);
      } catch (error) {
        console.error("Error saving profile photo:", error);
      }
    }
    
    // Save the updated profile data to localStorage
    try {
      localStorage.setItem('teacherProfileData', JSON.stringify(updatedProfileData));
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };
  
  // Map ProfileFormData to ProfileData for the modal
  const mapProfileFormToProfileData = (formData: ProfileFormData): ProfileData => {
    return {
      name: formData.fullName || '',
      specialization: formData.specialization || '',
      education: formData.education || '',
      experience: formData.experience || '',
      schedule: formData.workScheduleType || '',
      location: formData.districts || '',
      bio: formData.about || '',
      photoUrl: profilePhoto || '',
    };
  };
  
  // Component dialog for editing profile
  const EditProfileDialog = () => {
    // Keep a local copy of the form state for editing
    const [localFormState, setLocalFormState] = useState<ProfileFormData>({...profileData});

    // Reset the local form state when the dialog opens
    useEffect(() => {
      if (editMode) {
        setLocalFormState({...profileData});
        setPhotoPreview(profilePhoto);
      }
    }, [editMode]);

    const handleFieldChange = (field: keyof ProfileFormData, value: any) => {
      setLocalFormState(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleLocalFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      saveProfile(localFormState);
    };

    // Handle schedule selection
    const handleScheduleChange = (day: WeekDay, slot: TimeSlot, checked: boolean) => {
      setLocalFormState(prev => {
        const newSchedule = [...(prev.schedule || [])];
        const dayIndex = newSchedule.findIndex(s => s.day === day);
        
        if (checked) {
          if (dayIndex >= 0) {
            newSchedule[dayIndex].slots.push(slot);
          } else {
            newSchedule.push({ day, slots: [slot] });
          }
        } else if (dayIndex >= 0) {
          newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter(s => s !== slot);
          if (newSchedule[dayIndex].slots.length === 0) {
            newSchedule.splice(dayIndex, 1);
          }
        }
        
        return { ...prev, schedule: newSchedule };
      });
    };
    
    return (
      <Dialog open={editMode} onOpenChange={(open) => {
        // If closing dialog, reset form and preview
        if (!open && !isUpdating) {
          setEditMode(false);
          setPhotoPreview(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование профиля</DialogTitle>
            <DialogDescription>
              Обновите информацию в вашем профиле. Нажмите Сохранить, когда закончите.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLocalFormSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Предпросмотр" />
                  ) : profilePhoto ? (
                    <AvatarImage src={profilePhoto} alt={localFormState.fullName} />
                  ) : (
                    <AvatarFallback className="text-lg">
                      {localFormState.fullName ? getInitials(localFormState.fullName) : <UserRound />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <div className="bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors cursor-pointer" onClick={() => document.getElementById('profilePhoto')?.click()}>
                    <Camera className="h-4 w-4" />
                  </div>
                  <Input 
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО</Label>
              <Input 
                id="fullName" 
                value={localFormState.fullName} 
                onChange={(e) => handleFieldChange('fullName', e.target.value)} 
                placeholder="Иванов Иван Иванович" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">Специализация</Label>
              <Input 
                id="specialization" 
                value={localFormState.specialization} 
                onChange={(e) => handleFieldChange('specialization', e.target.value)} 
                placeholder="Учитель математики" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="education">Образование</Label>
              <Input 
                id="education" 
                value={localFormState.education} 
                onChange={(e) => handleFieldChange('education', e.target.value)} 
                placeholder="Кыргызский Национальный Университет" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Опыт работы</Label>
              <Input 
                id="experience" 
                value={localFormState.experience} 
                onChange={(e) => handleFieldChange('experience', e.target.value)} 
                placeholder="5 лет" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workScheduleType">График работы</Label>
              <Input 
                id="workScheduleType" 
                value={localFormState.workScheduleType} 
                onChange={(e) => handleFieldChange('workScheduleType', e.target.value)} 
                placeholder="Полный рабочий день" 
              />
            </div>
            
            <div className="space-y-2">
              <FormLabel>Гибкий график</FormLabel>
              <div className="border rounded-md p-4 space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Выберите удобные для вас дни и временные промежутки
                </div>
                
                {weekDays.map((day) => (
                  <div key={day.id} className="space-y-2">
                    <div className="font-medium">{day.label}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const daySchedule = localFormState.schedule?.find(s => s.day === day.id);
                        const isChecked = daySchedule?.slots.includes(slot) || false;
                        
                        return (
                          <div key={`${day.id}-${slot}`} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`${day.id}-${slot}`} 
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                handleScheduleChange(day.id, slot, checked === true);
                              }}
                            />
                            <Label htmlFor={`${day.id}-${slot}`}>{slot}</Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="districts">Предпочтительные районы</Label>
              <Input 
                id="districts" 
                value={localFormState.districts} 
                onChange={(e) => handleFieldChange('districts', e.target.value)} 
                placeholder="Бишкек, центр" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about">О себе</Label>
              <Textarea 
                id="about" 
                value={localFormState.about} 
                onChange={(e) => handleFieldChange('about', e.target.value)} 
                placeholder="Расскажите о себе, своем опыте и методах преподавания..." 
                rows={5}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditMode(false);
                  setPhotoPreview(null);
                }}
                disabled={isUpdating}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Component dialog for certificates
  const CertificatesDialog = () => (
    <Dialog open={showCertificatesDialog} onOpenChange={setShowCertificatesDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Мои сертификаты</DialogTitle>
          <DialogDescription>
            Добавьте свои сертификаты и дипломы для подтверждения квалификации
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleAddCertificate} className="space-y-4 border-b pb-4">
            <div className="space-y-2">
              <Label htmlFor="certificateName">Название сертификата</Label>
              <Input id="certificateName" name="certificateName" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificateDate">Дата получения</Label>
              <Input id="certificateDate" name="certificateDate" type="date" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="certificateFile">Файл сертификата</Label>
              <Input id="certificateFile" name="certificateFile" type="file" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Добавить сертификат
            </Button>
          </form>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Загруженные сертификаты</h3>
            
            {certificates.length === 0 ? (
              <p className="text-sm text-muted-foreground">У вас пока нет загруженных сертификатов</p>
            ) : (
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border rounded-md p-2">
                    <div>
                      <div className="font-medium">{cert.name}</div>
                      <div className="text-xs text-muted-foreground">Получен: {cert.date}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCertificate(cert.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCertificatesDialog(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Use the ProfileEditModal component for editing main profile
  const openProfileEditModal = () => {
    setEditMode(true);
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет учителя</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="applications">Отклики</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
          <TabsTrigger value="saved">Сохраненные</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>Мой профиль</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1" onClick={openProfileEditModal}>
                      <Edit className="h-4 w-4" />
                      Редактировать
                    </Button>
                    {isPublished ? (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="gap-1"
                        onClick={handleUnpublishProfile}
                        disabled={isPublishing}
                      >
                        <Eye className="h-4 w-4" />
                        {isPublishing ? "Скрываем..." : "Скрыть профиль"}
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="gap-1"
                        onClick={handlePublishProfile}
                        disabled={isPublishing}
                      >
                        <Upload className="h-4 w-4" />
                        {isPublishing ? "Публикуем..." : "Опубликовать"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isPublished && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          Профиль опубликован и виден в каталоге учителей
                        </span>
                      </div>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-green-700 hover:text-green-900"
                        onClick={() => navigate('/teachers')}
                      >
                        Посмотреть в каталоге
                      </Button>
                    </div>
                  )}
                  
                  {!isPublished && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <UserRound className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800 font-medium">
                          Профиль не опубликован
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        Опубликуйте профиль, чтобы школы могли найти вас в каталоге учителей
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      {profilePhoto ? (
                        <AvatarImage src={profilePhoto} alt={profileData.fullName} />
                      ) : (
                        <AvatarFallback className="text-xl">
                          {profileData.fullName 
                            ? getInitials(profileData.fullName) 
                            : <UserRound className="h-10 w-10" />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{profileData.fullName || "Заполните ваше имя"}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {profileData.specialization || "Укажите вашу специализацию"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Образование</h4>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.education || "Не указано"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Опыт работы</h4>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.experience || "Не указано"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">График работы</h4>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.workScheduleType || "Не указано"}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Предпочтительные районы</h4>
                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <span>{profileData.districts || "Не указано"}</span>
                      </div>
                    </div>
                  </div>
                  
                  {profileData.schedule && profileData.schedule.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Гибкий график</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profileData.schedule.map((item) => (
                          <div key={item.day} className="border rounded-md p-3">
                            <div className="font-medium mb-1">
                              {weekDays.find(d => d.id === item.day)?.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.slots.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">О себе</h4>
                    <p className="text-sm">
                      {profileData.about || "Расскажите о себе, опыте работы и методах преподавания"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Заполните все разделы профиля, чтобы повысить шансы найти подходящую школу.
                  </p>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Просмотры профиля:</span>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="font-medium">{stats.profileViews}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Отклики:</span>
                      <span className="font-medium">{stats.responses}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Сообщения:</span>
                      <span className="font-medium">{stats.messages}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Действия</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start" 
                      onClick={() => navigate('/schools')}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Искать вакансии
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/messages')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Сообщения
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowCertificatesDialog(true)}
                    >
                      <Award className="mr-2 h-4 w-4" />
                      Сертификаты
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Мои отклики на вакансии</CardTitle>
              <CardDescription>
                Здесь отображаются все ваши заявки на вакансии школ
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.responses === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">У вас пока нет откликов на вакансии</p>
                  <Button onClick={() => navigate('/schools')}>
                    <Search className="mr-2 h-4 w-4" />
                    Найти вакансии
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Учитель математики</h3>
                        <p className="text-sm text-muted-foreground">Школа №12, Бишкек</p>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">На рассмотрении</span>
                    </div>
                    <p className="text-sm mb-3">
                      Дата отклика: 10 апреля 2025
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate('/vacancy/1')}>
                        <FileText className="h-4 w-4 mr-1" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate('/messages/school/1')}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Связаться
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сообщения</CardTitle>
              <CardDescription>
                Общение со школами и другими пользователями
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.messages === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">У вас пока нет сообщений</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-accent/10" onClick={() => navigate('/messages/school/1')}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Школа №12</h3>
                          <p className="text-xs text-muted-foreground">3 новых сообщения</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">10:30</span>
                    </div>
                    <p className="text-sm truncate">
                      Здравствуйте! Мы рассмотрели вашу заявку и хотели бы...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={() => navigate('/messages')}>
                <Mail className="h-4 w-4" />
                Все сообщения
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Сохраненные вакансии</CardTitle>
              <CardDescription>
                Вакансии, которые вас заинтересовали
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Учитель математики (старшие классы)</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        Школа-гимназия №1, Бишкек
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Удалено из сохраненных",
                          description: "Вакансия удалена из списка сохраненных",
                        });
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Полный день</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">35,000-45,000 сом</span>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full flex items-center gap-0.5">
                      <Home className="h-3 w-3" />
                      Жилье
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Отклик отправлен",
                          description: "Ваш отклик успешно отправлен в школу",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Откликнуться
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/vacancy/1')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                  
                  <div className="mt-4 border-t pt-3">
                    <div className="text-sm font-medium mb-2">Оставить отзыв о школе:</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Рекомендую
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Не рекомендую
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">Преподаватель информатики</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        Международная школа "Horizon", Бишкек
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Удалено из сохраненных",
                          description: "Вакансия удалена из списка сохраненных",
                        });
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Частичная занятость</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">По договоренности</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Отклик отправлен",
                          description: "Ваш отклик успешно отправлен в школу",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Откликнуться
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/vacancy/2')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                  
                  <div className="mt-4 border-t pt-3">
                    <div className="text-sm font-medium mb-2">Оставить отзыв о школе:</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Рекомендую
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => {
                          toast({
                            title: "Отзыв отправлен",
                            description: "Спасибо за вашу оценку!",
                          });
                        }}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Не рекомендую
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <ProfileEditModal 
        isOpen={editMode}
        onClose={() => setEditMode(false)}
        initialData={mapProfileFormToProfileData(profileData)}
        onSave={handleProfileSave}
        userType="teacher"
      />
      <CertificatesDialog />
    </div>
  );
};

export default TeacherDashboardPage;
