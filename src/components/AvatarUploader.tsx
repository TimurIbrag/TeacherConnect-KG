
import React, { useState, ChangeEvent } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import CropDialog from './CropDialog';
import RemovePhotoDialog from './RemovePhotoDialog';
import { validateImageFile, readFileAsDataURL } from '@/utils/imageUtils';

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
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [croppingImageUrl, setCroppingImageUrl] = useState<string>('');
  const inputRef = React.useRef<HTMLInputElement>(null);
  
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
  
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Ошибка загрузки",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Show the full original image for editing
      const dataUrl = await readFileAsDataURL(file);
      setCroppingImageUrl(dataUrl);
      setShowCropDialog(true);
      
      toast({
        title: "Фото загружено",
        description: "Теперь настройте позицию и масштаб фотографии",
      });
    } catch (error) {
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    }
  };
  
  const handleCropComplete = (croppedFile: File) => {
    // Create a preview URL from the cropped file
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result && typeof event.target.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(croppedFile);
    
    // Notify parent component with the final cropped file
    onImageChange(croppedFile);
    setShowCropDialog(false);
    
    console.log("Photo edited and saved:", croppedFile.name, croppedFile.size);
    
    toast({
      title: "Фото сохранено",
      description: "Отредактированное фото применено к профилю",
    });
  };
  
  const handleFirstRemoveConfirm = () => {
    setShowRemoveConfirm(false);
    setShowSecondConfirm(true);
  };
  
  const handleFinalRemoveConfirm = () => {
    // Clear all states completely
    setImageUrl('');
    setCroppingImageUrl('');
    
    // Clear the file input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Notify parent component with null to indicate no image
    onImageChange(null);
    setShowSecondConfirm(false);
    
    console.log("Photo removed completely");
    
    toast({
      title: "Фото удалено",
      description: "Фотография профиля была удалена",
    });
  };
  
  const getInitials = () => {
    return 'TC';
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${sizeClasses[size]} cursor-pointer rounded-full overflow-hidden border-2 border-gray-200`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => inputRef.current?.click()}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-400">{getInitials()}</div>
            </div>
          </div>
        )}
        
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
          accept="image/jpeg,image/jpg,image/png,image/gif"
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
      
      {/* Enhanced Image editing dialog */}
      <CropDialog
        isOpen={showCropDialog}
        onClose={() => setShowCropDialog(false)}
        imageUrl={croppingImageUrl}
        onCrop={handleCropComplete}
      />
      
      {/* First confirmation dialog for removing photo */}
      <RemovePhotoDialog
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleFirstRemoveConfirm}
        title="Удалить фотографию?"
        description="Вы уверены, что хотите удалить фотографию профиля?"
        confirmText="Удалить"
      />
      
      {/* Second confirmation dialog */}
      <RemovePhotoDialog
        isOpen={showSecondConfirm}
        onClose={() => setShowSecondConfirm(false)}
        onConfirm={handleFinalRemoveConfirm}
        title="Подтвердите удаление"
        description="Это действие нельзя отменить. Фотография будет удалена навсегда."
        confirmText="Да, удалить навсегда"
      />
    </div>
  );
};

export default AvatarUploader;
