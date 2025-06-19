import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building, Edit, Eye, FilePlus, MapPin, MessageSquare, Search, Plus, X, Globe, Lock, CheckCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import AvatarUploader from '@/components/AvatarUploader';
import SchoolPhotoGallery from './SchoolPhotoGallery';
import LocationVerificationModal from '@/components/LocationVerificationModal';

interface ProfileTabProps {
  onNavigateToVacancies?: () => void;
}

// Initial empty school profile data
const emptySchoolData = {
  name: '',
  address: '',
  type: 'Государственная',
  category: 'Общеобразовательная',
  city: 'Бишкек',
  about: '',
  website: '',
  infrastructure: ['Компьютерный класс', 'Спортзал', 'Библиотека', 'Столовая'],
  locationVerified: false,
  coordinates: null as { lat: number; lng: number } | null
};

// Initial empty stats
const emptyStats = {
  profileViews: 0,
  activeVacancies: 0,
  applications: 0
};

const ProfileTab: React.FC<ProfileTabProps> = ({ onNavigateToVacancies }) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [newInfrastructure, setNewInfrastructure] = useState('');
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [showLocationVerification, setShowLocationVerification] = useState(false);
  
  // Initialize with empty data from localStorage or use defaults
  const [schoolData, setSchoolData] = useState(() => {
    const savedData = localStorage.getItem('schoolProfileData');
    return savedData ? JSON.parse(savedData) : emptySchoolData;
  });
  
  // Initialize stats with empty data or from localStorage
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('schoolProfileStats');
    return savedStats ? JSON.parse(savedStats) : emptyStats;
  });

  const schoolTypes = [
    'Государственная',
    'Частная', 
    'Международная',
    'Специализированная'
  ];

  const cities = [
    'Бишкек',
    'Ош',
    'Джалал-Абад',
    'Каракол',
    'Токмок',
    'Кара-Балта',
    'Балыкчы',
    'Кызыл-Кия',
    'Баткен',
    'Нарын',
    'Талас',
    'Кант',
    'Таш-Кумыр',
    'Кочкор-Ата',
    'Исфана',
    'Сулюкта',
    'Ноокат',
    'Чолпон-Ата',
    'Ат-Башы',
    'Токтогул',
    'Ала-Бука',
    'Кемин',
    'Таш-Короо',
    'Уч-Коргон',
    'Ак-Суу',
    'Шопоков'
  ];

  // Load profile photo and visibility setting from localStorage on component mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem('schoolProfilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
    
    const savedVisibility = localStorage.getItem('schoolProfilePublic');
    if (savedVisibility) {
      setIsProfilePublic(JSON.parse(savedVisibility));
    }
  }, []);

  // Update stats when profile becomes public/private
  useEffect(() => {
    const currentVacancies = JSON.parse(localStorage.getItem('schoolVacancies') || '[]');
    const activeVacanciesCount = currentVacancies.filter((v: any) => v.status === 'active').length;
    
    const updatedStats = {
      ...stats,
      activeVacancies: activeVacanciesCount
    };
    
    setStats(updatedStats);
    localStorage.setItem('schoolProfileStats', JSON.stringify(updatedStats));
  }, [isProfilePublic]);
  
  // Function to create a school profile object for publishing
  const createPublishedSchoolProfile = () => {
    const currentVacancies = JSON.parse(localStorage.getItem('schoolVacancies') || '[]');
    const activeVacancies = currentVacancies.filter((v: any) => v.status === 'active');
    
    return {
      id: Date.now(), // Generate a unique ID based on timestamp
      name: schoolData.name,
      photo: profilePhoto || '/placeholder.svg',
      address: schoolData.address,
      type: schoolData.type,
      city: schoolData.city,
      specialization: schoolData.category,
      openPositions: activeVacancies.map((v: any, index: number) => ({
        id: index,
        title: v.title || 'Вакансия',
      })),
      ratings: 4.5, // Default rating
      views: Math.floor(Math.random() * 200) + 50, // Random views between 50-250
      housing: false, // Can be extended later
      locationVerified: schoolData.locationVerified,
      about: schoolData.about,
      website: schoolData.website,
      facilities: schoolData.infrastructure,
      applications: stats.applications,
      distance: undefined // Will be calculated if needed
    };
  };
  
  // Handler for updating profile data
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      city: formData.get('city') as string,
      about: formData.get('about') as string,
      website: formData.get('website') as string,
      infrastructure: schoolData.infrastructure,
      locationVerified: schoolData.locationVerified,
      coordinates: schoolData.coordinates
    };
    
    // Save to localStorage and update state
    localStorage.setItem('schoolProfileData', JSON.stringify(updatedData));
    setSchoolData(updatedData);
    
    // Save photo separately
    if (profilePhoto) {
      localStorage.setItem('schoolProfilePhoto', profilePhoto);
    }
    
    // Update published profile if it's currently public
    if (isProfilePublic) {
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      const updatedSchools = publishedSchools.filter((s: any) => s.name !== schoolData.name);
      const newProfile = createPublishedSchoolProfile();
      updatedSchools.push(newProfile);
      localStorage.setItem('publishedSchools', JSON.stringify(updatedSchools));
    }
    
    setEditMode(false);
    setIsUpdating(false);
    
    toast({
      title: "Профиль обновлен",
      description: "Данные школы успешно сохранены",
    });
  };
  
  // Handle profile photo change using AvatarUploader
  const handleProfilePhotoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setProfilePhoto(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePhoto(null);
      localStorage.removeItem('schoolProfilePhoto');
    }
  };

  // Handle profile visibility toggle
  const handleProfileVisibilityChange = (checked: boolean) => {
    setIsProfilePublic(checked);
    localStorage.setItem('schoolProfilePublic', JSON.stringify(checked));
    
    // Add school to published profiles list
    if (checked && isProfileComplete) {
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      const schoolProfile = createPublishedSchoolProfile();
      
      // Remove any existing profile for this school and add the new one
      const updatedSchools = publishedSchools.filter((s: any) => s.name !== schoolData.name);
      updatedSchools.push(schoolProfile);
      localStorage.setItem('publishedSchools', JSON.stringify(updatedSchools));
      
      // Trigger a storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'publishedSchools',
        newValue: JSON.stringify(updatedSchools),
        oldValue: JSON.stringify(publishedSchools)
      }));
    } else if (!checked) {
      // Remove school from published profiles
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      const updatedSchools = publishedSchools.filter((s: any) => s.name !== schoolData.name);
      localStorage.setItem('publishedSchools', JSON.stringify(updatedSchools));
      
      // Trigger a storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'publishedSchools',
        newValue: JSON.stringify(updatedSchools),
        oldValue: JSON.stringify(publishedSchools)
      }));
    }
    
    toast({
      title: checked ? "Профиль опубликован" : "Профиль скрыт",
      description: checked 
        ? "Ваш профиль и вакансии теперь видны соискателям" 
        : "Ваш профиль и вакансии скрыты от соискателей",
    });
  };
  
  // Handle location verification
  const handleLocationVerification = (verifiedData: { address: string; coordinates: { lat: number; lng: number } }) => {
    const updatedData = {
      ...schoolData,
      address: verifiedData.address,
      locationVerified: true,
      coordinates: verifiedData.coordinates
    };
    
    setSchoolData(updatedData);
    localStorage.setItem('schoolProfileData', JSON.stringify(updatedData));
    setShowLocationVerification(false);
  };
  
  // Add new infrastructure item
  const handleAddInfrastructure = () => {
    if (newInfrastructure.trim()) {
      const updatedInfrastructure = [...schoolData.infrastructure, newInfrastructure.trim()];
      setSchoolData({
        ...schoolData,
        infrastructure: updatedInfrastructure
      });
      
      // Save to localStorage
      localStorage.setItem('schoolProfileData', JSON.stringify({
        ...schoolData, 
        infrastructure: updatedInfrastructure
      }));
      
      setNewInfrastructure('');
      
      toast({
        title: "Элемент добавлен",
        description: `"${newInfrastructure}" добавлен в инфраструктуру`,
      });
    }
  };
  
  // Remove infrastructure item
  const handleRemoveInfrastructure = (index: number) => {
    const updatedInfrastructure = [...schoolData.infrastructure];
    updatedInfrastructure.splice(index, 1);
    
    setSchoolData({
      ...schoolData,
      infrastructure: updatedInfrastructure
    });
    
    // Save to localStorage
    localStorage.setItem('schoolProfileData', JSON.stringify({
      ...schoolData,
      infrastructure: updatedInfrastructure
    }));
    
    toast({
      title: "Элемент удален",
      description: "Элемент инфраструктуры был удален",
    });
  };
  
  // Reset all profile data
  const resetProfileData = () => {
    setSchoolData({...emptySchoolData});
    setStats({...emptyStats});
    setProfilePhoto(null);
    setIsProfilePublic(false);
    
    // Clear from localStorage
    localStorage.removeItem('schoolProfileData');
    localStorage.removeItem('schoolProfileStats');
    localStorage.removeItem('schoolProfilePhoto');
    localStorage.removeItem('schoolProfilePublic');
    
    toast({
      title: "Профиль сброшен",
      description: "Все данные профиля были сброшены до значений по умолчанию",
    });
  };

  const isProfileComplete = schoolData.name && schoolData.address && schoolData.about;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Profile Visibility Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isProfilePublic ? (
                <Globe className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              Видимость профиля
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isProfilePublic ? "Профиль опубликован" : "Профиль скрыт"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isProfilePublic 
                    ? "Ваш профиль и активные вакансии видны соискателям"
                    : "Только вы можете видеть ваш профиль и вакансии"
                  }
                </p>
              </div>
              <Switch
                checked={isProfilePublic}
                onCheckedChange={handleProfileVisibilityChange}
                disabled={!isProfileComplete}
              />
            </div>
            
            {!isProfileComplete && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Заполните обязательные поля профиля (название, адрес, описание) для публикации
                </p>
              </div>
            )}

            {isProfilePublic && isProfileComplete && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  ✓ Ваш профиль опубликован и доступен для поиска
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Профиль школы</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditMode(true)}>
                <Edit className="h-4 w-4" />
                Редактировать
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {/* Rectangular school photo */}
              <div className="w-32 h-20 rounded-lg overflow-hidden border-2 border-muted-foreground/20">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={schoolData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Building className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">{schoolData.name || "Название школы не указано"}</h3>
                {schoolData.address && (
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {schoolData.address}
                    </p>
                    {schoolData.locationVerified ? (
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Подтверждено
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setShowLocationVerification(true)}
                      >
                        Подтвердить адрес
                      </Button>
                    )}
                  </div>
                )}
                {schoolData.city && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Город: {schoolData.city}
                  </p>
                )}
                {schoolData.website && (
                  <a 
                    href={schoolData.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                  >
                    {schoolData.website}
                  </a>
                )}
              </div>
            </div>
            
            {(schoolData.type || schoolData.category) && (
              <div className="flex flex-wrap gap-2">
                {schoolData.type && <Badge variant="outline">{schoolData.type}</Badge>}
                {schoolData.category && <Badge variant="secondary">{schoolData.category}</Badge>}
              </div>
            )}
            
            {schoolData.about && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">О школе</h4>
                <p className="text-sm">
                  {schoolData.about}
                </p>
              </div>
            )}
            
            {schoolData.infrastructure.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Инфраструктура</h4>
                <div className="grid grid-cols-2 gap-2">
                  {schoolData.infrastructure.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 border p-2 rounded">
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!schoolData.name && !schoolData.about && !schoolData.address && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Информация о школе не заполнена. Нажмите "Редактировать", чтобы добавить данные.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photo Gallery Section */}
        <SchoolPhotoGallery />
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
                <span className="text-muted-foreground">Активные вакансии:</span>
                <span className="font-medium">{stats.activeVacancies}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Получено откликов:</span>
                <span className="font-medium">{stats.applications}</span>
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
                onClick={onNavigateToVacancies}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Добавить вакансию
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Search className="mr-2 h-4 w-4" />
                Поиск учителей
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Сообщения
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Диалог редактирования профиля */}
      <Dialog open={editMode} onOpenChange={(open) => {
        setEditMode(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Редактирование профиля школы</DialogTitle>
            <DialogDescription>
              Обновите информацию о вашей школе. Нажмите сохранить, когда закончите.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="space-y-2">
                <Label>Главное фото школы</Label>
                <div className="w-48 h-32 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 relative">
                  {profilePhoto ? (
                    <>
                      <img src={profilePhoto} alt="School" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProfilePhoto(null)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
                      <Building className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground text-center px-2">Добавить фото школы</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProfilePhotoChange(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Название школы</Label>
              <Input id="name" name="name" defaultValue={schoolData.name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Input id="address" name="address" defaultValue={schoolData.address} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Город</Label>
              <Select name="city" defaultValue={schoolData.city}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Тип школы</Label>
                <Select name="type" defaultValue={schoolData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип школы" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Категория</Label>
                <Input id="category" name="category" defaultValue={schoolData.category} required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website">Официальный сайт</Label>
              <Input 
                id="website" 
                name="website" 
                type="url" 
                placeholder="https://school-example.kg"
                defaultValue={schoolData.website} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="about">О школе</Label>
              <Textarea 
                id="about" 
                name="about" 
                rows={5}
                defaultValue={schoolData.about} 
                required
              />
            </div>
            
            {/* Infrastructure section */}
            <div className="space-y-2">
              <Label>Инфраструктура</Label>
              <div className="border rounded-md p-3 space-y-2">
                {/* Current infrastructure items */}
                <div className="flex flex-wrap gap-2">
                  {schoolData.infrastructure.map((item, index) => (
                    <Badge key={index} variant="secondary" className="py-1">
                      {item}
                      <button 
                        type="button"
                        className="ml-1 hover:text-destructive" 
                        onClick={() => handleRemoveInfrastructure(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                {/* Add new infrastructure item */}
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Добавить элемент инфраструктуры"
                    value={newInfrastructure}
                    onChange={(e) => setNewInfrastructure(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddInfrastructure} 
                    disabled={!newInfrastructure.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditMode(false);
                }}
                disabled={isUpdating}
              >
                Отмена
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdating}
              >
                {isUpdating ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Location Verification Modal */}
      <LocationVerificationModal
        isOpen={showLocationVerification}
        onClose={() => setShowLocationVerification(false)}
        currentAddress={schoolData.address}
        onVerify={handleLocationVerification}
      />
    </div>
  );
};

export default ProfileTab;
