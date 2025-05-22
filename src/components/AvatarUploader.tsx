
import React, { useState, ChangeEvent, useRef } from 'react';
import { Camera, X, CropIcon, RotateCcw, RotateCw } from 'lucide-react';
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
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Ошибка загрузки",
          description: "Размер файла не должен превышать 2MB",
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
          setShowCropDialog(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Function to crop and save the image
  const handleCropImage = () => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        const img = imageRef.current;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        
        // Set the canvas to a square size for proper cropping
        canvas.width = 300;
        canvas.height = 300;
        
        // Draw the image centered in the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const croppedImageUrl = canvas.toDataURL('image/jpeg');
        setImageUrl(croppedImageUrl);
        
        // Convert data URL to File object
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], "profile_photo.jpg", {
              type: "image/jpeg"
            });
            onImageChange(croppedFile);
          }
        }, 'image/jpeg');
        
        setShowCropDialog(false);
      }
    }
  };
  
  const handleRemoveImage = () => {
    setImageUrl('');
    onImageChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  const getInitials = () => {
    // Show "TC" (TeacherConnect) as fallback initials
    return 'TC';
  };
  
  const rotateImage = (direction: 'cw' | 'ccw') => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Save the context state
      ctx.save();
      
      // Move to the center of the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Rotate 90 degrees in the specified direction
      ctx.rotate(direction === 'cw' ? Math.PI / 2 : -Math.PI / 2);
      
      // Draw the image centered
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      // Restore the context state
      ctx.restore();
      
      // Update the source image
      img.src = canvas.toDataURL('image/jpeg');
    }
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
        
        {/* Centered camera overlay on hover */}
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
            handleRemoveImage();
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
            <div className="relative w-full max-w-[300px] h-[300px] overflow-hidden rounded-md border">
              <img 
                ref={imageRef}
                src={croppingImageUrl} 
                alt="Crop preview" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => rotateImage('ccw')}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Повернуть влево
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => rotateImage('cw')}
              >
                <RotateCw className="h-4 w-4 mr-1" />
                Повернуть вправо
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
    </div>
  );
};

export default AvatarUploader;
