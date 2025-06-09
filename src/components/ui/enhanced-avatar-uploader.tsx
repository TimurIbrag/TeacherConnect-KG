
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Camera, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface EnhancedAvatarUploaderProps {
  currentAvatarUrl?: string | null;
  onAvatarUploaded: (url: string) => void;
  onAvatarRemoved: () => void;
  className?: string;
}

const EnhancedAvatarUploader: React.FC<EnhancedAvatarUploaderProps> = ({
  currentAvatarUrl,
  onAvatarUploaded,
  onAvatarRemoved,
  className = ""
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) {
      toast({
        title: t('error.unauthorized'),
        description: t('auth.loginError'),
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: t('error.invalidFileType'),
        description: 'Поддерживаются только JPEG, PNG и WebP файлы',
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: t('error.fileTooLarge'),
        description: 'Максимальный размер файла 5MB',
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        console.error('Storage upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update user profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      onAvatarUploaded(publicUrl);
      
      toast({
        title: t('profile.photoUploaded'),
        description: 'Фотография профиля успешно обновлена',
      });

    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: t('profile.uploadError'),
        description: error.message || t('error.fileUpload'),
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !currentAvatarUrl) return;

    setUploading(true);

    try {
      // Remove from profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Try to delete from storage (optional, don't fail if it doesn't exist)
      if (currentAvatarUrl.includes('supabase')) {
        const fileName = currentAvatarUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${fileName}`]);
        }
      }

      onAvatarRemoved();
      
      toast({
        title: t('profile.photoRemoved'),
        description: 'Фотография профиля удалена',
      });

    } catch (error: any) {
      console.error('Avatar removal error:', error);
      toast({
        title: t('common.error'),
        description: error.message || 'Не удалось удалить фотографию',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage 
            src={currentAvatarUrl || undefined} 
            alt="Profile"
            className="object-cover"
          />
          <AvatarFallback className="bg-gray-100 text-gray-600">
            <Camera className="w-8 h-8" />
          </AvatarFallback>
        </Avatar>
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <div className="text-white text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1" />
              <div className="text-xs">{uploadProgress}%</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {currentAvatarUrl ? t('profile.changePhoto') : t('profile.uploadPhoto')}
        </Button>

        {currentAvatarUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={uploading}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            {t('profile.removePhoto')}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500 text-center max-w-xs">
        Поддерживаются JPEG, PNG, WebP файлы до 5MB
      </p>
    </div>
  );
};

export default EnhancedAvatarUploader;
