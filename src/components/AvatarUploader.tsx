
import React, { useState, ChangeEvent, useRef } from 'react';
import { Camera, X, CropIcon, RotateCcw, RotateCw, Move } from 'lucide-react';
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
          setImagePosition({ x: 0, y: 0 }); // Reset position
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
    
    // Constrain movement within container bounds
    const containerRect = cropContainerRef.current.getBoundingClientRect();
    const maxX = containerRect.width - 100; // Account for image size
    const maxY = containerRect.height - 100;
    
    setImagePosition({
      x: Math.max(-50, Math.min(maxX, newX)),
      y: Math.max(-50, Math.min(maxY, newY))
    });
  };
  
  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
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
        
        // Calculate the source crop area based on image position
        const scale = img.naturalWidth / img.offsetWidth;
        const sourceX = Math.abs(imagePosition.x) * scale;
        const sourceY = Math.abs(imagePosition.y) * scale;
        const sourceWidth = 300 * scale;
        const sourceHeight = 300 * scale;
        
        // Draw the cropped portion of the image
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, canvas.width, canvas.height
        );
        
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
      
      // Reset position after rotation
      setImagePosition({ x: 0, y: 0 });
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
                className="absolute select-none"
                style={{
                  transform: `translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  minWidth: '100%',
                  minHeight: '100%'
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
