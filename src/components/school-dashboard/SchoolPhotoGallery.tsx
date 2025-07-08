import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images } from 'lucide-react';
import { useSchoolPhotos } from '@/hooks/useSchoolPhotos';
import { MAX_PHOTOS } from '@/types/photo';
import PhotoUploadSection from './photo-gallery/PhotoUploadSection';
import PhotoGrid from './photo-gallery/PhotoGrid';
import PhotoViewerDialog from './photo-gallery/PhotoViewerDialog';
import { SchoolPhoto } from '@/types/photo';

const SchoolPhotoGallery = () => {
  const {
    photos,
    isUploading,
    handleFileUpload,
    handleDeletePhoto,
    remainingSlots
  } = useSchoolPhotos();
  
  const [selectedPhoto, setSelectedPhoto] = useState<SchoolPhoto | null>(null);

  const handleViewPhoto = (photo: SchoolPhoto) => {
    setSelectedPhoto(photo);
  };

  const handleCloseViewer = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Фотогалерея школы
          </CardTitle>
          <Badge variant="outline">
            {photos.length}/{MAX_PHOTOS}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <PhotoUploadSection
            remainingSlots={remainingSlots}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
          />
          
          <PhotoGrid
            photos={photos}
            onViewPhoto={handleViewPhoto}
            onDeletePhoto={handleDeletePhoto}
          />
        </CardContent>
      </Card>

      <PhotoViewerDialog
        selectedPhoto={selectedPhoto}
        onClose={handleCloseViewer}
      />
    </div>
  );
};

export default SchoolPhotoGallery;