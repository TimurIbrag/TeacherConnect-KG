import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface SchoolPhotoGalleryProps {
  photos: string[];
  schoolName: string;
}

const SchoolPhotoGallery: React.FC<SchoolPhotoGalleryProps> = ({ photos, schoolName }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return null;
  }

  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closePhotoViewer = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === 0 ? photos.length - 1 : selectedPhotoIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex(selectedPhotoIndex === photos.length - 1 ? 0 : selectedPhotoIndex + 1);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      goToPrevious();
    } else if (event.key === 'ArrowRight') {
      goToNext();
    } else if (event.key === 'Escape') {
      closePhotoViewer();
    }
  };

  return (
    <>
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
                  onClick={() => openPhotoViewer(index)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Viewer Dialog */}
      <Dialog open={selectedPhotoIndex !== null} onOpenChange={closePhotoViewer}>
        <DialogContent 
          className="max-w-screen-lg w-[90vw] h-[90vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={closePhotoViewer}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {photos.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Next Button */}
            {photos.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image */}
            {selectedPhotoIndex !== null && (
              <div className="w-full h-full flex items-center justify-center p-8">
                <img
                  src={photos[selectedPhotoIndex]}
                  alt={`${schoolName} - фото ${selectedPhotoIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Photo Counter */}
            {selectedPhotoIndex !== null && photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedPhotoIndex + 1} / {photos.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SchoolPhotoGallery;