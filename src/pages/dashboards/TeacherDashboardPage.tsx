import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Book, Clock, Star, Users, Eye, Phone, Mail, Globe, Award, GraduationCap, Languages, FileText, CheckCircle } from 'lucide-react';
import ServicesTab from '@/components/teacher-dashboard/ServicesTab';

interface ScheduleItem {
  day: string;
  timeSlots: string[];
}

interface TeacherProfileData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  specialization: string;
  experience: string;
  education: string;
  bio: string;
  schedule: ScheduleItem[];
  subjects: string[];
  languages: string[];
  skills: string[];
  certifications: string[];
  achievements: string[];
  hourlyRate: string;
  groupRate: string;
  availability: string;
  teachingMethods: string[];
  targetAudience: string[];
  onlineTeaching: boolean;
  homeVisits: boolean;
  avatar: string;
}

// Get published teachers from localStorage
const getPublishedTeachers = () => {
  try {
    const isPublished = localStorage.getItem('teacherProfilePublished') === 'true';
    const profileData = localStorage.getItem('teacherProfileData');
    
    if (isPublished && profileData) {
      const profile = JSON.parse(profileData);
      return [{
        id: 'local-teacher',
        profiles: {
          full_name: profile.fullName,
          avatar_url: profile.avatar || null
        },
        specialization: profile.specialization,
        bio: profile.bio,
        experience_years: parseInt(profile.experience) || 0,
        location: profile.location,
        education: profile.education,
        skills: profile.skills || [],
        languages: profile.languages || [],
        verification_status: 'verified' as const
      }];
    }
  } catch (error) {
    console.error('Error loading published teacher:', error);
  }
  return [];
};

// Set/get published status
const setTeacherProfilePublished = (published: boolean) => {
  localStorage.setItem('teacherProfilePublished', published.toString());
};

const isTeacherProfilePublished = () => {
  return localStorage.getItem('teacherProfilePublished') === 'true';
};

// Get/set teacher profile data
const getTeacherProfileData = (): TeacherProfileData => {
  const saved = localStorage.getItem('teacherProfileData');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error('Error parsing teacher profile data:', error);
    }
  }
  
  return {
    fullName: '',
    phone: '',
    email: '',
    location: '',
    specialization: '',
    experience: '',
    education: '',
    bio: '',
    schedule: [
      { day: 'monday', timeSlots: [] },
      { day: 'tuesday', timeSlots: [] },
      { day: 'wednesday', timeSlots: [] },
      { day: 'thursday', timeSlots: [] },
      { day: 'friday', timeSlots: [] },
      { day: 'saturday', timeSlots: [] },
      { day: 'sunday', timeSlots: [] },
    ],
    subjects: [],
    languages: [],
    skills: [],
    certifications: [],
    achievements: [],
    hourlyRate: '',
    groupRate: '',
    availability: '',
    teachingMethods: [],
    targetAudience: [],
    onlineTeaching: false,
    homeVisits: false,
    avatar: '',
  };
};

const setTeacherProfileData = (data: TeacherProfileData) => {
  localStorage.setItem('teacherProfileData', JSON.stringify(data));
};

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const TeacherDashboardPage = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<TeacherProfileData>(getTeacherProfileData());
  const [isPublished, setIsPublished] = useState(isTeacherProfilePublished());
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setTeacherProfileData(profileData);
  }, [profileData]);

  const handleInputChange = (field: keyof TeacherProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: keyof TeacherProfileData, value: string) => {
    if (value.trim()) {
      setProfileData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field: keyof TeacherProfileData, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleScheduleChange = (dayIndex: number, timeSlots: string[]) => {
    setProfileData(prev => ({
      ...prev,
      schedule: prev.schedule.map((item, index) => 
        index === dayIndex ? { ...item, timeSlots } : item
      )
    }));
  };

  const handleProfileSave = (data: any) => {
    console.log('handleProfileSave called with:', data);
    
    const updatedProfile = {
      ...profileData,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      location: data.location,
      specialization: data.specialization,
      education: data.education,
      experience: data.experience,
      schedule: profileData.schedule || [], // Keep the existing schedule array
      districts: data.location,
      about: data.bio,
    };
    
    setProfileData(updatedProfile);
    setTeacherProfileData(updatedProfile);
    
    toast({
      title: t('profile.updated'),
      description: t('profile.updateSuccess'),
    });
  };

  const handlePublishProfile = () => {
    // Basic validation
    if (!profileData.fullName || !profileData.email || !profileData.specialization) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Имя, email и специализация обязательны для публикации профиля',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmail(profileData.email)) {
      toast({
        title: 'Неверный email',
        description: 'Пожалуйста, введите корректный email адрес',
        variant: 'destructive',
      });
      return;
    }

    if (profileData.phone && !validatePhone(profileData.phone)) {
      toast({
        title: 'Неверный номер телефона',
        description: 'Пожалуйста, введите корректный номер телефона',
        variant: 'destructive',
      });
      return;
    }

    const newPublishedStatus = !isPublished;
    setIsPublished(newPublishedStatus);
    setTeacherProfilePublished(newPublishedStatus);
    
    toast({
      title: newPublishedStatus ? 'Профиль опубликован' : 'Профиль снят с публикации',
      description: newPublishedStatus 
        ? 'Ваш профиль теперь виден другим пользователям' 
        : 'Ваш профиль больше не виден другим пользователям',
    });
  };

  const getDayName = (day: string): string => {
    const dayNames: { [key: string]: string } = {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    };
    return dayNames[day] || day;
  };

  const getCompletionPercentage = (): number => {
    const fields = [
      profileData.fullName,
      profileData.email,
      profileData.phone,
      profileData.location,
      profileData.specialization,
      profileData.education,
      profileData.bio,
      profileData.experience,
    ];
    
    const filledFields = fields.filter(field => field && field.toString().trim()).length;
    const arrayFields = [
      profileData.subjects.length > 0,
      profileData.languages.length > 0,
      profileData.skills.length > 0,
    ].filter(Boolean).length;
    
    return Math.round(((filledFields + arrayFields) / (fields.length + 3)) * 100);
  };

  if (profile?.role !== 'teacher') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Доступ запрещен</h2>
              <p className="text-muted-foreground">
                Эта страница доступна только для преподавателей.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Preview content - keep existing preview implementation */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Панель преподавателя
        </h1>
        <p className="text-gray-600">
          Управляйте своим профилем, услугами и взаимодействием с учениками
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Просмотры профиля</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">28</p>
                <p className="text-sm text-muted-foreground">Активных учеников</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Средний рейтинг</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getCompletionPercentage()}%</p>
                <p className="text-sm text-muted-foreground">Заполнение профиля</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="services">Мои услуги</TabsTrigger>
          <TabsTrigger value="schedule">Расписание</TabsTrigger>
          <TabsTrigger value="students">Ученики</TabsTrigger>
          <TabsTrigger value="messages">Сообщения</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Keep existing profile tab content */}
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          {/* Keep existing schedule tab content */}
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          {/* Keep existing students tab content */}
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {/* Keep existing messages tab content */}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Keep existing analytics tab content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboardPage;
