import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  
  const [schoolData, setSchoolData] = useState<SchoolData>(() => {
    const savedData = localStorage.getItem('schoolProfileData');
    return savedData ? JSON.parse(savedData) : emptySchoolData;
  });
  
  const [stats, setStats] = useState<Stats>(() => {
    const savedStats = localStorage.getItem('schoolProfileStats');
    return savedStats ? JSON.parse(savedStats) : emptyStats;
  });

  // Load profile photo and visibility setting from localStorage on component mount
  useEffect(() => {
    const savedPhoto = localStorage.getItem('schoolProfilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
    
    const savedVisibility = localStorage.getItem('schoolProfilePublic');
    setIsProfilePublic(savedVisibility ? JSON.parse(savedVisibility) : false);
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

  const updateSchoolData = (newData: Partial<SchoolData>) => {
    const updatedData = { ...schoolData, ...newData };
    setSchoolData(updatedData);
    localStorage.setItem('schoolProfileData', JSON.stringify(updatedData));
    
    // Update published profile if it's currently public
    if (isProfilePublic) {
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      const updatedSchools = publishedSchools.filter((s: any) => s.name !== schoolData.name);
      const newProfile = createPublishedSchoolProfile();
      updatedSchools.push(newProfile);
      localStorage.setItem('publishedSchools', JSON.stringify(updatedSchools));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'publishedSchools',
        newValue: JSON.stringify(updatedSchools),
        oldValue: JSON.stringify(publishedSchools)
      }));
    }
  };

  const handleProfilePhotoChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setProfilePhoto(e.target.result);
          localStorage.setItem('schoolProfilePhoto', e.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePhoto(null);
      localStorage.removeItem('schoolProfilePhoto');
    }
  };

  const handleProfileVisibilityChange = (checked: boolean) => {
    setIsProfilePublic(checked);
    localStorage.setItem('schoolProfilePublic', JSON.stringify(checked));
    
    const isProfileComplete = schoolData.name && schoolData.address && schoolData.about;
    
    if (checked && isProfileComplete) {
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      const schoolProfile = createPublishedSchoolProfile();
      
      const updatedSchools = publishedSchools.filter((s: any) => s.name !== schoolData.name);
      updatedSchools.push(schoolProfile);
      localStorage.setItem('publishedSchools', JSON.stringify(updatedSchools));
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'publishedSchools',
        newValue: JSON.stringify(updatedSchools),
        oldValue: JSON.stringify(publishedSchools)
      }));
    } else if (!checked) {
      const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
      const updatedSchools = publishedSchools.filter((s: any) => s.name !== schoolData.name);
      localStorage.setItem('publishedSchools', JSON.stringify(updatedSchools));
      
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

  const isProfileComplete = Boolean(schoolData.name && schoolData.address && schoolData.about);

  return {
    schoolData,
    stats,
    profilePhoto,
    isProfilePublic,
    isProfileComplete,
    setSchoolData,
    updateSchoolData,
    handleProfilePhotoChange,
    handleProfileVisibilityChange,
    toast
  };
};