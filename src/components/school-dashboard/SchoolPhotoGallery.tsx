
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Images, Upload, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile, readFileAsDataURL } from '@/utils/imageUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MAX_PHOTOS = 20;

interface SchoolPhoto {
  id: string;
  url: string;
  name: string;
  uploadedAt: string;
}

const SchoolPhotoGallery = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<SchoolPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<SchoolPhoto | null>(null);

  // Load photos from localStorage on component mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('schoolPhotos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Save photos to localStorage whenever photos change
  const savePhotos = (newPhotos: SchoolPhoto[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('schoolPhotos', JSON.stringify(newPhotos));
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
        savePhotos(updatedPhotos);
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

  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    savePhotos(updatedPhotos);
    toast({
      title: "Фотография удалена",
      description: "Фотография была удалена из галереи",
    });
  };

  const remainingSlots = MAX_PHOTOS - photos.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Фотогалерея школы
          </CardTitle>
          <Badge variant="outline">
            {photos.length}/{MAX_PHOTOS}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Загрузить фотографии</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Добавьте до {remainingSlots} фотографий. Поддерживаются форматы JPG, PNG, GIF (до 10MB)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading || remainingSlots === 0}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button
                  variant="outline"
                  disabled={isUploading || remainingSlots === 0}
                  className="cursor-pointer"
                  asChild
                >
                  <span>
                    {isUploading ? "Загрузка..." : "Выбрать файлы"}
                  </span>
                </Button>
              </label>
              {remainingSlots === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Достигнут максимальный лимит фотографий
                </p>
              )}
            </div>
          </div>

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedPhoto(photo)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {photo.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {photos.length === 0 && (
            <div className="text-center py-8">
              <Images className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Фотографии не добавлены. Загрузите первые фотографии школы.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photo Preview Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.name}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="max-h-[70vh] overflow-hidden rounded-lg">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolPhotoGallery;
