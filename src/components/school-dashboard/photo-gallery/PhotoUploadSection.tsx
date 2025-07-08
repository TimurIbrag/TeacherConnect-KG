import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';

interface PhotoUploadSectionProps {
  remainingSlots: number;
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  remainingSlots,
  isUploading,
  onFileUpload
}) => {
  return (
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
          onChange={onFileUpload}
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
  );
};

export default PhotoUploadSection;