import React, { useState } from 'react';
import { useSchoolProfile } from '@/hooks/useSchoolProfile';
import ProfileVisibilityCard from './profile/ProfileVisibilityCard';
import ProfileDisplayCard from './profile/ProfileDisplayCard';
import ProfileStatsCard from './profile/ProfileStatsCard';
import ProfileActionsCard from './profile/ProfileActionsCard';
import ProfileEditDialog from './profile/ProfileEditDialog';
import SchoolPhotoGallery from './SchoolPhotoGallery';
import LocationVerificationModal from '@/components/LocationVerificationModal';

interface ProfileTabProps {
  onNavigateToVacancies?: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ onNavigateToVacancies }) => {
  const {
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
  } = useSchoolProfile();

  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLocationVerification, setShowLocationVerification] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    let websiteUrl = formData.get('website') as string;
    
    if (websiteUrl && !websiteUrl.match(/^https?:\/\//)) {
      websiteUrl = 'https://' + websiteUrl;
    }
    
    const updatedData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      type: formData.get('type') as string,
      category: formData.get('category') as string,
      city: formData.get('city') as string,
      about: formData.get('about') as string,
      website: websiteUrl,
      infrastructure: schoolData.infrastructure,
      locationVerified: schoolData.locationVerified,
      coordinates: schoolData.coordinates,
      housing: schoolData.housing
    };
    
    updateSchoolData(updatedData);
    setEditMode(false);
    setIsUpdating(false);
    
    toast({
      title: "Профиль обновлен",
      description: "Данные школы успешно сохранены",
    });
  };

  const handleHousingToggle = (checked: boolean) => {
    updateSchoolData({ housing: checked });
    
    toast({
      title: checked ? "Жилье включено" : "Жилье отключено",
      description: checked 
        ? "Школа теперь предоставляет жилье для учителей" 
        : "Школа больше не предоставляет жилье для учителей",
    });
  };

  const handleLocationVerification = (verifiedData: { address: string; coordinates: { lat: number; lng: number } }) => {
    updateSchoolData({
      address: verifiedData.address,
      locationVerified: true,
      coordinates: verifiedData.coordinates
    });
    setShowLocationVerification(false);
  };

  const handleAddInfrastructure = (item: string) => {
    const updatedInfrastructure = [...schoolData.infrastructure, item];
    updateSchoolData({ infrastructure: updatedInfrastructure });
    
    toast({
      title: "Элемент добавлен",
      description: `"${item}" добавлен в инфраструктуру`,
    });
  };

  const handleRemoveInfrastructure = (index: number) => {
    const updatedInfrastructure = [...schoolData.infrastructure];
    updatedInfrastructure.splice(index, 1);
    
    updateSchoolData({ infrastructure: updatedInfrastructure });
    
    toast({
      title: "Элемент удален",
      description: "Элемент инфраструктуры был удален",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <ProfileVisibilityCard
          isProfilePublic={isProfilePublic}
          isProfileComplete={isProfileComplete}
          onVisibilityChange={handleProfileVisibilityChange}
        />

        <ProfileDisplayCard
          schoolData={schoolData}
          profilePhoto={profilePhoto}
          onEditClick={() => setEditMode(true)}
          onPhotoChange={handleProfilePhotoChange}
          onLocationVerificationClick={() => setShowLocationVerification(true)}
        />

        <SchoolPhotoGallery />
      </div>
      
      <div className="space-y-6">
        <ProfileStatsCard stats={stats} />
        <ProfileActionsCard onNavigateToVacancies={onNavigateToVacancies} />
      </div>
      
      <ProfileEditDialog
        isOpen={editMode}
        onClose={() => setEditMode(false)}
        schoolData={schoolData}
        profilePhoto={profilePhoto}
        isUpdating={isUpdating}
        onSubmit={handleUpdateProfile}
        onPhotoChange={handleProfilePhotoChange}
        onHousingToggle={handleHousingToggle}
        onAddInfrastructure={handleAddInfrastructure}
        onRemoveInfrastructure={handleRemoveInfrastructure}
      />
      
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
