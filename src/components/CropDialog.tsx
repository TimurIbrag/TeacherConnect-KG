
import React, { useRef, useState, useCallback } from 'react';
import { Move, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
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
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
      setImageLoaded(false);
    }
  }, [isOpen]);

  // Handle image load to ensure it's ready for manipulation
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    if (imageRef.current) {
      // Auto-fit the image initially
      const img = imageRef.current;
      const containerSize = 300;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      
      // Calculate initial scale to fit the image in the container
      let initialScale = 1;
      if (imgAspect > 1) {
        // Landscape - fit by height
        initialScale = containerSize / img.naturalHeight;
      } else {
        // Portrait or square - fit by width
        initialScale = containerSize / img.naturalWidth;
      }
      
      // Ensure minimum scale for visibility
      setImageScale(Math.max(0.5, Math.min(initialScale, 2)));
    }
  }, []);

  // Handle mouse wheel for zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    
    setImageScale(prev => {
      const newScale = prev + delta;
      return Math.max(0.3, Math.min(4, newScale));
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
    if (!isDragging || !imageLoaded) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setImagePosition({ x: newX, y: newY });
  }, [isDragging, dragStart, imageLoaded]);

  // Handle mouse up to stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle rotation (90 degrees at a time)
  const handleRotation = useCallback(() => {
    setImageRotation(prev => (prev + 90) % 360);
  }, []);

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    setImageScale(prev => Math.min(4, prev + 0.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setImageScale(prev => Math.max(0.3, prev - 0.2));
  }, []);

  // Handle scale slider change
  const handleScaleChange = useCallback((value: number[]) => {
    setImageScale(value[0]);
  }, []);

  // Function to crop and save the image as circular
  const handleCropImage = useCallback(() => {
    if (!imageRef.current || !canvasRef.current || !imageLoaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx) return;

    // Set canvas size to crop area (300x300 for circle)
    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;
    
    // Clear canvas
    ctx.clearRect(0, 0, cropSize, cropSize);
    
    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
    ctx.clip();
    
    // Move to center of canvas
    ctx.translate(cropSize / 2, cropSize / 2);
    
    // Apply rotation
    ctx.rotate((imageRotation * Math.PI) / 180);
    
    // Apply scale
    ctx.scale(imageScale, imageScale);
    
    // Calculate image dimensions
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    // Apply position offset (adjusted for scale)
    const offsetX = imagePosition.x / imageScale;
    const offsetY = imagePosition.y / imageScale;
    
    // Draw image centered with position offset
    ctx.drawImage(
      img,
      -imgWidth / 2 + offsetX,
      -imgHeight / 2 + offsetY,
      imgWidth,
      imgHeight
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
  }, [imagePosition, imageScale, imageRotation, onCrop, imageLoaded]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Настройка фотографии профиля</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div 
            ref={cropContainerRef}
            className="relative w-[300px] h-[300px] overflow-hidden rounded-full border-2 border-dashed border-gray-300 cursor-move select-none bg-gray-50"
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Crop preview" 
              className="absolute select-none pointer-events-auto"
              style={{
                transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imageScale}) rotate(${imageRotation}deg)`,
                transformOrigin: 'center center',
                maxWidth: 'none',
                maxHeight: 'none',
                left: '50%',
                top: '50%',
                marginLeft: '-50%',
                marginTop: '-50%'
              }}
              onMouseDown={handleMouseDown}
              onLoad={handleImageLoad}
              draggable={false}
            />
            
            {/* Circular crop overlay guide */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full rounded-full border-2 border-white/70 shadow-lg"></div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            <Move className="h-4 w-4 inline mr-1" />
            Перетащите фото • Прокрутите для масштабирования
          </div>
          
          {/* Zoom Slider */}
          <div className="w-full max-w-[250px] space-y-2">
            <label className="text-sm font-medium">Масштаб: {Math.round(imageScale * 100)}%</label>
            <Slider
              value={[imageScale]}
              onValueChange={handleScaleChange}
              min={0.3}
              max={4}
              step={0.1}
              className="w-full"
            />
          </div>
          
          {/* Control buttons */}
          <div className="flex gap-2 justify-center flex-wrap">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomOut}
              disabled={imageScale <= 0.3}
            >
              <ZoomOut className="h-4 w-4 mr-1" />
              Уменьшить
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleZoomIn}
              disabled={imageScale >= 4}
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              Увеличить
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRotation}
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Повернуть
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
            disabled={!imageLoaded}
          >
            Сохранить изменения
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropDialog;
