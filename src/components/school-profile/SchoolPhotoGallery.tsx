import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SchoolPhotoGalleryProps {
  photos: string[];
  schoolName: string;
}

const SchoolPhotoGallery: React.FC<SchoolPhotoGalleryProps> = ({ photos, schoolName }) => {
  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Фотогалерея школы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-video overflow-hidden rounded-lg border">
              <img 
                src={photo} 
                alt={`${schoolName} - фото ${index + 1}`}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => {
                  // Open image in new tab for full view
                  window.open(photo, '_blank');
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolPhotoGallery;