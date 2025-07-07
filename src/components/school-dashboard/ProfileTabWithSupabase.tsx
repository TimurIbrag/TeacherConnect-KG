import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building, Edit, Eye, Globe, Lock, Settings } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileTabWithSupabaseProps {
  onNavigateToVacancies?: () => void;
}

const ProfileTabWithSupabase: React.FC<ProfileTabWithSupabaseProps> = ({ onNavigateToVacancies }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile data state
  const [schoolData, setSchoolData] = useState({
    school_name: '',
    address: '',
    school_type: 'Государственная',
    description: '',
    website_url: '',
    facilities: [] as string[],
    housing_provided: false,
    is_published: false,
    photo_urls: null as string[] | null
  });

  const schoolTypes = [
    'Государственная',
    'Частная', 
    'Международная',
    'Специализированная'
  ];

  // Load school profile data from Supabase
  useEffect(() => {
    const loadSchoolProfile = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('school_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading school profile:', error);
          return;
        }

        if (data) {
          setSchoolData({
            school_name: data.school_name || '',
            address: data.address || '',
            school_type: data.school_type || 'Государственная',
            description: data.description || '',
            website_url: data.website_url || '',
            facilities: data.facilities || [],
            housing_provided: data.housing_provided || false,
            is_published: data.is_published || false,
            photo_urls: data.photo_urls
          });
        }
      } catch (error) {
        console.error('Error loading school profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchoolProfile();
  }, [user?.id]);

  // Auto-save changes with debouncing
  useEffect(() => {
    if (!user?.id || isLoading) return;

    const saveTimeout = setTimeout(async () => {
      if (isSaving) return;
      
      setIsSaving(true);
      try {
        const { error } = await supabase
          .from('school_profiles')
          .upsert({
            id: user.id,
            ...schoolData
          });

        if (error) {
          console.error('Error saving school profile:', error);
        } else {
          console.log('✅ Profile auto-saved');
        }
      } catch (error) {
        console.error('Error auto-saving profile:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(saveTimeout);
  }, [schoolData, user?.id, isLoading]);

  // Handle profile visibility toggle
  const handleProfileVisibilityChange = async (checked: boolean) => {
    if (!user?.id) return;

    try {
      const updatedData = { ...schoolData, is_published: checked };
      
      const { error } = await supabase
        .from('school_profiles')
        .update({ is_published: checked })
        .eq('id', user.id);

      if (error) throw error;

      setSchoolData(updatedData);
      
      toast({
        title: checked ? "Профиль опубликован" : "Профиль скрыт",
        description: checked 
          ? "Ваш профиль теперь виден в публичном списке школ" 
          : "Ваш профиль скрыт от публичного просмотра",
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить видимость профиля",
        variant: "destructive",
      });
    }
  };

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setSchoolData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add facility
  const handleAddFacility = (facility: string) => {
    if (facility.trim() && !schoolData.facilities.includes(facility.trim())) {
      handleFieldChange('facilities', [...schoolData.facilities, facility.trim()]);
    }
  };

  // Remove facility
  const handleRemoveFacility = (index: number) => {
    const updatedFacilities = [...schoolData.facilities];
    updatedFacilities.splice(index, 1);
    handleFieldChange('facilities', updatedFacilities);
  };

  // Navigate to school profile page
  const handleViewProfile = () => {
    if (user?.id) {
      navigate(`/school/${user.id}`);
    }
  };

  const isProfileComplete = schoolData.school_name && schoolData.address && schoolData.description;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        {/* Profile Visibility Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {schoolData.is_published ? (
                <Globe className="h-5 w-5 text-green-600" />
              ) : (
                <Lock className="h-5 w-5 text-muted-foreground" />
              )}
              Видимость профиля
              {isSaving && (
                <Badge variant="outline" className="ml-auto">
                  Сохранение...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {schoolData.is_published ? "Профиль опубликован" : "Профиль скрыт"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {schoolData.is_published 
                    ? "Ваш профиль виден в публичном списке школ"
                    : "Только вы можете видеть ваш профиль"
                  }
                </p>
              </div>
              <Switch
                checked={schoolData.is_published}
                onCheckedChange={handleProfileVisibilityChange}
                disabled={!isProfileComplete}
              />
            </div>
            
            {!isProfileComplete && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Заполните обязательные поля (название, адрес, описание) для публикации
                </p>
              </div>
            )}

            {schoolData.is_published && isProfileComplete && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 flex-1">
                  ✓ Ваш профиль опубликован и доступен для поиска
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleViewProfile}
                  className="gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Посмотреть
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Информация о школе</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditMode(!editMode)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              {editMode ? 'Закончить' : 'Редактировать'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* School Photo Section */}
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 relative bg-muted/50 flex items-center justify-center">
                {schoolData.photo_urls?.[0] ? (
                  <img 
                    src={schoolData.photo_urls[0]} 
                    alt={schoolData.school_name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-center">
                    <Building className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Фото школы</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {schoolData.school_name || 'Название школы не указано'}
                </h3>
                <p className="text-muted-foreground">
                  {schoolData.address || 'Адрес не указан'}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="school_name">Название школы *</Label>
                <Input
                  id="school_name"
                  value={schoolData.school_name}
                  onChange={(e) => handleFieldChange('school_name', e.target.value)}
                  placeholder="Введите название школы"
                  disabled={!editMode}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Адрес *</Label>
                <Input
                  id="address"
                  value={schoolData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Введите адрес школы"
                  disabled={!editMode}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="school_type">Тип школы</Label>
                <Select 
                  value={schoolData.school_type} 
                  onValueChange={(value) => handleFieldChange('school_type', value)}
                  disabled={!editMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Описание школы *</Label>
                <Textarea
                  id="description"
                  value={schoolData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="Расскажите о вашей школе..."
                  disabled={!editMode}
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website_url">Веб-сайт</Label>
                <Input
                  id="website_url"
                  value={schoolData.website_url}
                  onChange={(e) => handleFieldChange('website_url', e.target.value)}
                  placeholder="https://example.com"
                  disabled={!editMode}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="housing"
                  checked={schoolData.housing_provided}
                  onCheckedChange={(checked) => handleFieldChange('housing_provided', checked)}
                  disabled={!editMode}
                />
                <Label htmlFor="housing">Предоставляем жилье для учителей</Label>
              </div>
            </div>

            {/* Facilities Section */}
            <div className="space-y-3">
              <Label>Инфраструктура</Label>
              <div className="flex flex-wrap gap-2">
                {schoolData.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {facility}
                    {editMode && (
                      <button
                        onClick={() => handleRemoveFacility(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {editMode && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить элемент инфраструктуры"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddFacility(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleAddFacility(input.value);
                      input.value = '';
                    }}
                  >
                    Добавить
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={onNavigateToVacancies} 
              className="w-full gap-2"
            >
              <Building className="h-4 w-4" />
              Управление вакансиями
            </Button>
            
            {schoolData.is_published && (
              <Button 
                variant="outline" 
                onClick={handleViewProfile}
                className="w-full gap-2"
              >
                <Eye className="h-4 w-4" />
                Посмотреть профиль
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Profile Completeness */}
        <Card>
          <CardHeader>
            <CardTitle>Полнота профиля</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Прогресс</span>
                <span>{isProfileComplete ? '100%' : '60%'}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: isProfileComplete ? '100%' : '60%' }}
                />
              </div>
              {!isProfileComplete && (
                <p className="text-xs text-muted-foreground mt-2">
                  Заполните все обязательные поля для публикации профиля
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileTabWithSupabase;