
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, Eye, FilePlus, MapPin, MessageSquare, Search, Camera } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ProfileTab = () => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [schoolData, setSchoolData] = useState({
    name: 'Школа-гимназия №5',
    address: 'г. Бишкек, ул. Московская, 145',
    type: 'Государственная',
    category: 'Общеобразовательная',
    about: 'Школа-гимназия №5 - одна из старейших школ Бишкека с богатыми традициями. Наша миссия - дать качественное образование, помочь ученикам раскрыть свои таланты и подготовить их к успешной жизни в современном мире.',
    website: '',
    infrastructure: ['Компьютерный класс', 'Спортзал', 'Библиотека', 'Столовая']
  });
  
  // Стейт для фото профиля
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Статистика
  const [stats, setStats] = useState({
    profileViews: 56,
    activeVacancies: 3,
    applications: 12
  });
  
  // Обработчик обновления данных
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      about: formData.get('about') as string,
      website: formData.get('website') as string,
      infrastructure: schoolData.infrastructure // Пока оставляем без изменений
    };
    
    // Имитация обращения к API
    setTimeout(() => {
      setSchoolData(updatedData);
      setEditMode(false);
      setIsUpdating(false);
      
      toast({
        title: "Профиль обновлен",
        description: "Данные школы успешно сохранены",
      });
    }, 1000);
  };
  
  // Функция для обработки загрузки фото профиля
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Создаем превью
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setPhotoPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Сохранение фото после редактирования
  const saveProfilePhoto = () => {
    if (photoPreview) {
      setProfilePhoto(photoPreview);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Профиль школы</CardTitle>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setEditMode(true)}>
              <Edit className="h-4 w-4" />
              Редактировать
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {profilePhoto ? (
                  <AvatarImage src={profilePhoto} alt={schoolData.name} />
                ) : (
                  <AvatarFallback className="bg-muted">
                    <Building className="h-10 w-10 text-muted-foreground" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{schoolData.name}</h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {schoolData.address}
                </p>
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
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{schoolData.type}</Badge>
              <Badge variant="secondary">{schoolData.category}</Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">О школе</h4>
              <p className="text-sm">
                {schoolData.about}
              </p>
            </div>
            
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
          </CardContent>
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
              <Button variant="outline" className="w-full justify-start">
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
        if (!open) {
          setPhotoPreview(null);
        }
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
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Предпросмотр" />
                  ) : profilePhoto ? (
                    <AvatarImage src={profilePhoto} alt={schoolData.name} />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <Building className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="profilePhoto" className="cursor-pointer bg-primary text-white rounded-full p-1.5 hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                  </Label>
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
              <Label htmlFor="name">Название школы</Label>
              <Input id="name" name="name" defaultValue={schoolData.name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Адрес</Label>
              <Input id="address" name="address" defaultValue={schoolData.address} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Тип школы</Label>
                <Input id="type" name="type" defaultValue={schoolData.type} required />
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
              <Button 
                type="submit" 
                disabled={isUpdating}
                onClick={() => {
                  saveProfilePhoto();
                }}
              >
                {isUpdating ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileTab;
