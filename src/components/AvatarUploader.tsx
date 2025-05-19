
import React, { useState, ChangeEvent } from 'react';
import { Camera, X } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';

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
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Проверка размера файла (макс. 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Ошибка загрузки",
          description: "Размер файла не должен превышать 2MB",
          variant: "destructive",
        });
        return;
      }
      
      // Проверка типа файла
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
          setImageUrl(event.target.result.toString());
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
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
    // Если пользователь не передал аватарку, показать инициалы "TC" (TeacherConnect)
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
        
        {/* Overlay при наведении */}
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
      
      {/* Кнопка удаления, отображается только если есть изображение */}
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
    </div>
  );
};

export default AvatarUploader;
