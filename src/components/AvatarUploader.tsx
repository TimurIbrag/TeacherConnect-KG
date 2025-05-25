
import React, { useState, ChangeEvent, useRef } from 'react';
import { Camera, X, CropIcon, RotateCcw, RotateCw, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AvatarUploaderProps {
  initialImageUrl?: string;
  onImageChange: (file: File | null) => void;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ 
  initialImageUrl = '',
  onImageChange,
  size = 'md'
}) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [isHovering, setIsHovering] = useState(false);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const inputRef = React.useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  // Update imageUrl when initialImageUrl changes
  React.useEffect(() => {
    setImageUrl(initialImageUrl);
  }, [initialImageUrl]);
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Increased file size limit to 10MB (from 2MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Ошибка загрузки",
          description: "Размер файла не должен превышать 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Неверный формат",
          description: "Пожалуйста, выберите изображение",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result.toString();
          setCroppingImageUrl(result);
          setImagePosition({ x: 0, y: 0 });
          setImageScale(1);
          setImageRotation(0);
          setShowCropDialog(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
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
      return Math.max(0.5, Math.min(3, newScale)); // Limit scale between 0.5x and 3x
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
        
        // Convert canvas to data URL
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
        setImageUrl(croppedImageUrl);
        
        // Convert data URL to File object
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], "profile_photo.jpg", {
              type: "image/jpeg"
            });
            onImageChange(croppedFile);
          }
        }, 'image/jpeg', 0.9);
        
        setShowCropDialog(false);
      }
    }
  };
  
  const handleRemoveImage = () => {
    // Clear all states
    setImageUrl('');
    setCroppingImageUrl('');
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    setImageRotation(0);
    
    // Clear the file input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Notify parent component
    onImageChange(null);
    setShowRemoveConfirm(false);
    
    toast({
      title: "Фото удалено",
      description: "Фотография профиля была удалена",
    });
  };
  
  const getInitials = () => {
    // Show "TC" (TeacherConnect) as fallback initials
    return 'TC';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${sizeClasses[size]} cursor-pointer rounded-full`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => inputRef.current?.click()}
      >
        <Avatar className={`${sizeClasses[size]}`}>
          <AvatarImage src={imageUrl} alt="Profile" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        
        {/* Camera overlay centered in the middle */}
        <div 
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 transition-opacity ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Camera className="h-8 w-8 text-white" />
        </div>
        
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      
      {/* Remove button - only shown if there's an image */}
      {imageUrl && (
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={(e) => {
            e.stopPropagation();
            setShowRemoveConfirm(true);
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Удалить фото
        </Button>
      )}
      
      {/* Image cropping dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
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
                src={croppingImageUrl} 
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
            
            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleZoom('out')}
              >
                <ZoomOut className="h-4 w-4 mr-1" />
                Уменьшить
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleZoom('in')}
              >
                <ZoomIn className="h-4 w-4 mr-1" />
                Увеличить
              </Button>
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
              onClick={() => setShowCropDialog(false)}
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
      
      {/* Confirmation dialog for removing photo */}
      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить фотографию?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить фотографию профиля? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveImage}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvatarUploader;
