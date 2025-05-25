
import React, { useRef, useState } from 'react';
import { Camera, X, CropIcon, RotateCcw, RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import PhotoControls from './PhotoControls';

interface CropDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onCrop: (croppedFile: File) => void;
}

const CropDialog: React.FC<CropDialogProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onCrop
}) => {
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setImagePosition({ x: 0, y: 0 });
      setImageScale(1);
      setImageRotation(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropContainerRef.current) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setImagePosition({
      x: newX,
      y: newY
    });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setImageScale(prev => {
      const increment = 0.1;
      const newScale = direction === 'in' ? prev + increment : prev - increment;
      return Math.max(0.5, Math.min(3, newScale));
    });
  };

  // Handle rotation
  const handleRotation = (direction: 'cw' | 'ccw') => {
    setImageRotation(prev => {
      const increment = 90;
      const newRotation = direction === 'cw' ? prev + increment : prev - increment;
      return newRotation % 360;
    });
  };

  // Function to crop and save the image
  const handleCropImage = () => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const img = imageRef.current;
        
        // Set the canvas to a square size for proper cropping
        canvas.width = 300;
        canvas.height = 300;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Save the context state
        ctx.save();
        
        // Move to center of canvas
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Apply rotation
        ctx.rotate((imageRotation * Math.PI) / 180);
        
        // Apply scale
        ctx.scale(imageScale, imageScale);
        
        // Calculate the position based on image position and container
        const drawX = imagePosition.x - canvas.width / 2;
        const drawY = imagePosition.y - canvas.height / 2;
        
        // Draw the image
        ctx.drawImage(img, drawX, drawY, img.naturalWidth, img.naturalHeight);
        
        // Restore the context state
        ctx.restore();
        
        // Convert canvas to File object
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], "profile_photo.jpg", {
              type: "image/jpeg"
            });
            onCrop(croppedFile);
          }
        }, 'image/jpeg', 0.9);
        
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Настройка фотографии профиля</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div 
            ref={cropContainerRef}
            className="relative w-full max-w-[300px] h-[300px] overflow-hidden rounded-md border cursor-move"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Crop preview" 
              className="absolute select-none pointer-events-none"
              style={{
                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale}) rotate(${imageRotation}deg)`,
                cursor: isDragging ? 'grabbing' : 'grab',
                transformOrigin: 'center center'
              }}
              onMouseDown={handleMouseDown}
              draggable={false}
            />
            
            {/* Crop overlay guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-white/50 bg-black/20"></div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            <Move className="h-4 w-4 inline mr-1" />
            Перетащите изображение для позиционирования
          </div>
          
          <PhotoControls 
            onZoom={handleZoom}
            onRotation={handleRotation}
          />
          
          <canvas 
            ref={canvasRef} 
            className="hidden" 
            width={300} 
            height={300}
          />
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button 
            type="button" 
            onClick={handleCropImage}
          >
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropDialog;
