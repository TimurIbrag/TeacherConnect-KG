import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { validateImageFile, readFileAsDataURL } from '@/utils/imageUtils';
import { SchoolPhoto, MAX_PHOTOS } from '@/types/photo';

export const useSchoolPhotos = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<SchoolPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load photos from Supabase and localStorage on component mount
  useEffect(() => {
    loadPhotos();
  }, [user]);

  const loadPhotos = async () => {
    if (!user) return;

    try {
      // First try to load from Supabase
      const { data: schoolProfile, error } = await supabase
        .from('school_profiles')
        .select('photo_urls')
        .eq('id', user.id)
        .single();

      if (!error && schoolProfile?.photo_urls) {
        const supabasePhotos: SchoolPhoto[] = schoolProfile.photo_urls.map((url, index) => ({
          id: `supabase-${index}`,
          url,
          name: `Photo ${index + 1}`,
          uploadedAt: new Date().toISOString(),
        }));
        setPhotos(supabasePhotos);
        return;
      }
    } catch (error) {
      console.error('Error loading photos from Supabase:', error);
    }

    // Fallback to localStorage
    const savedPhotos = localStorage.getItem('schoolPhotos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  };

  // Save photos to both Supabase and localStorage
  const savePhotos = async (newPhotos: SchoolPhoto[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('schoolPhotos', JSON.stringify(newPhotos));

    if (user) {
      try {
        const photoUrls = newPhotos.map(photo => photo.url);
        
        // Get existing school profile to preserve other fields
        const { data: existingProfile } = await supabase
          .from('school_profiles')
          .select('school_name')
          .eq('id', user.id)
          .single();

        await supabase
          .from('school_profiles')
          .upsert({
            id: user.id,
            school_name: existingProfile?.school_name || '',
            photo_urls: photoUrls
          });
      } catch (error) {
        console.error('Error saving photos to Supabase:', error);
        toast({
          title: "Ошибка сохранения",
          description: "Не удалось сохранить фотографии в базе данных",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const currentPhotoCount = photos.length;
    const filesToUpload = Array.from(files).slice(0, MAX_PHOTOS - currentPhotoCount);

    if (filesToUpload.length === 0) {
      toast({
        title: "Достигнут лимит фотографий",
        description: `Максимальное количество фотографий: ${MAX_PHOTOS}`,
        variant: "destructive",
      });
      return;
    }

    if (filesToUpload.length < files.length) {
      toast({
        title: "Некоторые файлы не загружены",
        description: `Загружено ${filesToUpload.length} из ${files.length} файлов из-за лимита`,
      });
    }

    setIsUploading(true);

    try {
      const newPhotos: SchoolPhoto[] = [];

      for (const file of filesToUpload) {
        const validation = validateImageFile(file);
        if (!validation.isValid) {
          toast({
            title: "Ошибка загрузки",
            description: validation.error,
            variant: "destructive",
          });
          continue;
        }

        try {
          const dataUrl = await readFileAsDataURL(file);
          const newPhoto: SchoolPhoto = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url: dataUrl,
            name: file.name,
            uploadedAt: new Date().toISOString(),
          };
          newPhotos.push(newPhoto);
        } catch (error) {
          toast({
            title: "Ошибка загрузки файла",
            description: `Не удалось загрузить ${file.name}`,
            variant: "destructive",
          });
        }
      }

      if (newPhotos.length > 0) {
        const updatedPhotos = [...photos, ...newPhotos];
        await savePhotos(updatedPhotos);
        toast({
          title: "Фотографии загружены",
          description: `Успешно загружено ${newPhotos.length} фотографий`,
        });
      }
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    await savePhotos(updatedPhotos);
    toast({
      title: "Фотография удалена",
      description: "Фотография была удалена из галереи",
    });
  };

  return {
    photos,
    isUploading,
    handleFileUpload,
    handleDeletePhoto,
    remainingSlots: MAX_PHOTOS - photos.length
  };
};