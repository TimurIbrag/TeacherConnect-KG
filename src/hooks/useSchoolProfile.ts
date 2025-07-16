import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface SchoolData {
  name: string;
  address: string;
  type: string;
  category: string;
  city: string;
  about: string;
  website: string;
  infrastructure: string[];
  locationVerified: boolean;
  coordinates: { lat: number; lng: number } | null;
  housing: boolean;
}

interface Stats {
  profileViews: number;
  activeVacancies: number;
  applications: number;
}

const emptySchoolData: SchoolData = {
  name: '',
  address: '',
  type: 'Государственная',
  category: 'Общеобразовательная',
  city: 'Бишкек',
  about: '',
  website: '',
  infrastructure: [],
  locationVerified: false,
  coordinates: null,
  housing: false
};

const emptyStats: Stats = {
  profileViews: 0,
  activeVacancies: 0,
  applications: 0
};

export const useSchoolProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [schoolData, setSchoolData] = useState<SchoolData>(() => {
    const savedData = localStorage.getItem('schoolProfileData');
    return savedData ? JSON.parse(savedData) : emptySchoolData;
  });
  
  const [stats, setStats] = useState<Stats>(() => {
    const savedStats = localStorage.getItem('schoolProfileStats');
    return savedStats ? JSON.parse(savedStats) : emptyStats;
  });

  // Load school profile from Supabase
  useEffect(() => {
    const loadSchoolProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('school_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading school profile:', error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          setSchoolData({
            name: profile.school_name || '',
            address: profile.address || '',
            type: profile.school_type || 'Государственная',
            category: 'Общеобразовательная',
            city: profile.address ? profile.address.split(',')[0] || 'Бишкек' : 'Бишкек',
            about: profile.description || '',
            website: profile.website_url || '',
            infrastructure: profile.facilities || [],
            locationVerified: profile.location_verified || false,
            coordinates: profile.latitude && profile.longitude ? { lat: profile.latitude, lng: profile.longitude } : null,
            housing: profile.housing_provided || false
          });

          setIsProfilePublic(profile.is_published || false);
          
          if (profile.photo_urls && profile.photo_urls.length > 0) {
            setProfilePhoto(profile.photo_urls[0]);
          }

          // Update stats with actual view count from database
          const currentVacancies = JSON.parse(localStorage.getItem('schoolVacancies') || '[]');
          const activeVacanciesCount = currentVacancies.filter((v: any) => v.status === 'active').length;
          
          setStats({
            profileViews: profile.view_count || 0,
            activeVacancies: activeVacanciesCount,
            applications: 0 // This would come from applications table in the future
          });
        }
      } catch (error) {
        console.error('Error loading school profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchoolProfile();
  }, [user]);

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

  const createPublishedSchoolProfile = () => {
    const currentVacancies = JSON.parse(localStorage.getItem('schoolVacancies') || '[]');
    const activeVacancies = currentVacancies.filter((v: any) => v.status === 'active');
    
    return {
      id: Date.now(),
      name: schoolData.name,
      photo: profilePhoto || null,
      address: schoolData.address,
      type: schoolData.type,
      city: schoolData.city,
      specialization: schoolData.category,
      openPositions: activeVacancies.map((v: any, index: number) => ({
        id: index,
        title: v.title || 'Вакансия',
      })),
      ratings: 4.5,
      views: Math.floor(Math.random() * 200) + 50,
      housing: schoolData.housing,
      locationVerified: schoolData.locationVerified,
      about: schoolData.about,
      website: schoolData.website,
      facilities: schoolData.infrastructure,
      applications: stats.applications,
      distance: undefined
    };
  };

  const updateSchoolData = async (newData: Partial<SchoolData>) => {
    if (!user) return;
    
    const updatedData = { ...schoolData, ...newData };
    setSchoolData(updatedData);

    try {
      const { error } = await supabase
        .from('school_profiles')
        .upsert({
          id: user.id,
          school_name: updatedData.name,
          address: updatedData.address,
          school_type: updatedData.type,
          description: updatedData.about,
          website_url: updatedData.website,
          facilities: updatedData.infrastructure,
          location_verified: updatedData.locationVerified,
          latitude: updatedData.coordinates?.lat || null,
          longitude: updatedData.coordinates?.lng || null,
          housing_provided: updatedData.housing,
          is_published: isProfilePublic,
          photo_urls: profilePhoto ? [profilePhoto] : []
        });

      if (error) {
        console.error('Error updating school profile:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось сохранить данные профиля",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating school profile:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить данные профиля",
        variant: "destructive"
      });
    }
  };

  const handleProfilePhotoChange = async (file: File | null) => {
    if (!user) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setProfilePhoto(e.target.result);
          
          // Update photo in database
          try {
            const { error } = await supabase
              .from('school_profiles')
              .upsert({
                id: user.id,
                school_name: schoolData.name || '',
                photo_urls: [e.target.result]
              });

            if (error) {
              console.error('Error updating profile photo:', error);
            }
          } catch (error) {
            console.error('Error updating profile photo:', error);
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePhoto(null);
      
      // Remove photo from database
      try {
        const { error } = await supabase
          .from('school_profiles')
          .upsert({
            id: user.id,
            school_name: schoolData.name || '',
            photo_urls: []
          });

        if (error) {
          console.error('Error removing profile photo:', error);
        }
      } catch (error) {
        console.error('Error removing profile photo:', error);
      }
    }
  };

  const handleProfileVisibilityChange = async (checked: boolean) => {
    if (!user) return;
    
    setIsProfilePublic(checked);
    
    const isProfileComplete = schoolData.name && schoolData.address && schoolData.about;
    
    if (!checked || !isProfileComplete) {
      try {
        const { error } = await supabase
          .from('school_profiles')
          .upsert({
            id: user.id,
            school_name: schoolData.name || '',
            is_published: false
          });

        if (error) {
          console.error('Error updating profile visibility:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось обновить видимость профиля",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        console.error('Error updating profile visibility:', error);
        toast({
          title: "Ошибка", 
          description: "Не удалось обновить видимость профиля",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Publish the profile
      try {
        const { error } = await supabase
          .from('school_profiles')
          .upsert({
            id: user.id,
            school_name: schoolData.name,
            address: schoolData.address,
            school_type: schoolData.type,
            description: schoolData.about,
            website_url: schoolData.website,
            facilities: schoolData.infrastructure,
            location_verified: schoolData.locationVerified,
            latitude: schoolData.coordinates?.lat || null,
            longitude: schoolData.coordinates?.lng || null,
            housing_provided: schoolData.housing,
            is_published: true,
            photo_urls: profilePhoto ? [profilePhoto] : []
          });

        if (error) {
          console.error('Error publishing profile:', error);
          toast({
            title: "Ошибка",
            description: "Не удалось опубликовать профиль",
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        console.error('Error publishing profile:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось опубликовать профиль", 
          variant: "destructive"
        });
        return;
      }
    }
    
    toast({
      title: checked ? "Профиль опубликован" : "Профиль скрыт",
      description: checked 
        ? "Ваш профиль теперь виден всем пользователям" 
        : "Ваш профиль скрыт от других пользователей",
    });
  };

  const isProfileComplete = Boolean(schoolData.name && schoolData.address && schoolData.about);

  return {
    schoolData,
    stats,
    profilePhoto,
    isProfilePublic,
    isProfileComplete,
    isLoading,
    setSchoolData,
    updateSchoolData,
    handleProfilePhotoChange,
    handleProfileVisibilityChange,
    toast
  };
};
