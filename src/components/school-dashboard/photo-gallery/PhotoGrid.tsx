import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Images } from 'lucide-react';
import { SchoolPhoto } from '@/types/photo';

interface PhotoGridProps {
  photos: SchoolPhoto[];
  onViewPhoto: (photo: SchoolPhoto) => void;
  onDeletePhoto: (photoId: string) => void;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  onViewPhoto,
  onDeletePhoto
}) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-8">
        <Images className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          Фотографии не добавлены. Загрузите первые фотографии школы.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={photo.url}
              alt={photo.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onViewPhoto(photo)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeletePhoto(photo.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {photo.name}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;