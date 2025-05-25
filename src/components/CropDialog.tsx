
import React, { useRef, useState, useCallback } from 'react';
import { Move, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

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

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    
    setImageScale(prev => {
      const newScale = prev + delta;
      return Math.max(0.5, Math.min(3, newScale));
    });
  }, []);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  }, [imagePosition]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setImagePosition({ x: newX, y: newY });
  }, [isDragging, dragStart]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle rotation
  const handleRotation = useCallback((direction: 'cw' | 'ccw') => {
    setImageRotation(prev => {
      const increment = 90;
      const newRotation = direction === 'cw' ? prev + increment : prev - increment;
      return newRotation % 360;
    });
  }, []);

  // Function to crop and save the image
  const handleCropImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx) return;

    // Set canvas size to crop area (300x300)
    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, cropSize, cropSize);
    
    // Save context
    ctx.save();
    
    // Move to center of canvas
    ctx.translate(cropSize / 2, cropSize / 2);
    
    // Apply rotation
    ctx.rotate((imageRotation * Math.PI) / 180);
    
    // Apply scale
    ctx.scale(imageScale, imageScale);
    
    // Calculate image dimensions to maintain aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let drawWidth = img.naturalWidth;
    let drawHeight = img.naturalHeight;
    
    // Adjust size to fit within crop area while maintaining aspect ratio
    if (imgAspect > 1) {
      // Landscape image
      drawWidth = cropSize;
      drawHeight = cropSize / imgAspect;
    } else {
      // Portrait or square image
      drawHeight = cropSize;
      drawWidth = cropSize * imgAspect;
    }
    
    // Apply position offset
    const offsetX = imagePosition.x / imageScale;
    const offsetY = imagePosition.y / imageScale;
    
    // Draw image centered with position offset
    ctx.drawImage(
      img,
      -drawWidth / 2 + offsetX,
      -drawHeight / 2 + offsetY,
      drawWidth,
      drawHeight
    );
    
    // Restore context
    ctx.restore();
    
    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], "profile_photo.jpg", {
          type: "image/jpeg"
        });
        onCrop(croppedFile);
      }
    }, 'image/jpeg', 0.9);
  }, [imagePosition, imageScale, imageRotation, onCrop]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Настройка фотографии профиля</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div 
            ref={cropContainerRef}
            className="relative w-full max-w-[300px] h-[300px] overflow-hidden rounded-md border cursor-move select-none"
            onWheel={handleWheel}
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
                transformOrigin: 'center center',
                maxWidth: 'none',
                maxHeight: 'none'
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
            Перетащите изображение для позиционирования • Прокрутите для масштабирования
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleRotation('ccw')}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Влево
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleRotation('cw')}
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Вправо
            </Button>
          </div>
          
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
