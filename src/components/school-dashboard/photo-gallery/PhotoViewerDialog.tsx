import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SchoolPhoto } from '@/types/photo';

interface PhotoViewerDialogProps {
  selectedPhoto: SchoolPhoto | null;
  onClose: () => void;
}

const PhotoViewerDialog: React.FC<PhotoViewerDialogProps> = ({
  selectedPhoto,
  onClose
}) => {
  return (
    <Dialog open={!!selectedPhoto} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedPhoto?.name}</DialogTitle>
        </DialogHeader>
        {selectedPhoto && (
          <div className="max-h-[70vh] overflow-hidden rounded-lg">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewerDialog;