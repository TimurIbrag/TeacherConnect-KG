import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, X } from 'lucide-react';

interface SchoolData {
  name: string;
  address: string;
  type: string;
  category: string;
  city: string;
  about: string;
  website: string;
  infrastructure: string[];
  housing: boolean;
}

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schoolData: SchoolData;
  profilePhoto: string | null;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPhotoChange: (file: File | null) => void;
  onHousingToggle: (checked: boolean) => void;
  onAddInfrastructure: (item: string) => void;
  onRemoveInfrastructure: (index: number) => void;
}

const schoolTypes = [
  'Государственная',
  'Частная', 
  'Международная',
  'Специализированная'
];

const cities = [
  'Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Токмок', 'Кара-Балта',
  'Балыкчы', 'Кызыл-Кия', 'Баткен', 'Нарын', 'Талас', 'Кант',
  'Таш-Кумыр', 'Кочкор-Ата', 'Исфана', 'Сулюкта', 'Ноокат',
  'Чолпон-Ата', 'Ат-Башы', 'Токтогул', 'Ала-Бука', 'Кемин',
  'Таш-Короо', 'Уч-Коргон', 'Ак-Суу', 'Шопоков'
];

const ProfileEditDialog: React.FC<ProfileEditDialogProps> = ({
  isOpen,
  onClose,
  schoolData,
  profilePhoto,
  isUpdating,
  onSubmit,
  onPhotoChange,
  onHousingToggle,
  onAddInfrastructure,
  onRemoveInfrastructure
}) => {
  const [newInfrastructure, setNewInfrastructure] = useState('');

  const handleAddInfrastructure = () => {
    if (newInfrastructure.trim()) {
      onAddInfrastructure(newInfrastructure.trim());
      setNewInfrastructure('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактирование профиля школы</DialogTitle>
          <DialogDescription>
            Обновите информацию о вашей школе. Нажмите сохранить, когда закончите.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="space-y-2">
              <Label>Главное фото школы</Label>
              <div className="w-48 h-32 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 relative">
                {profilePhoto ? (
                  <>
                    <img src={profilePhoto} alt="School" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onPhotoChange(null)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
                    <Building className="h-6 w-6 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground text-center px-2">Добавить фото школы</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onPhotoChange(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Название школы</Label>
            <Input id="name" name="name" defaultValue={schoolData.name} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Адрес</Label>
            <Input id="address" name="address" defaultValue={schoolData.address} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Город</Label>
            <Select name="city" defaultValue={schoolData.city}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите город" />
              </SelectTrigger>
              <SelectContent>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Тип школы</Label>
              <Select name="type" defaultValue={schoolData.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип школы" />
                </SelectTrigger>
                <SelectContent>
                  {schoolTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Input id="category" name="category" defaultValue={schoolData.category} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Официальный сайт</Label>
            <Input 
              id="website" 
              name="website" 
              placeholder="school-example.kg или www.school.com или https://school.edu.kg"
              defaultValue={schoolData.website} 
            />
            <p className="text-xs text-muted-foreground">
              Можно вводить адрес с www., без https:// или полный URL
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="about">О школе</Label>
            <Textarea 
              id="about" 
              name="about" 
              rows={5}
              defaultValue={schoolData.about} 
              required
            />
          </div>
          
          {/* Infrastructure section */}
          <div className="space-y-2">
            <Label>Инфраструктура</Label>
            <div className="border rounded-md p-3 space-y-2">
              {/* Current infrastructure items */}
              <div className="flex flex-wrap gap-2">
                {schoolData.infrastructure.map((item, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {item}
                    <button 
                      type="button"
                      className="ml-1 hover:text-destructive" 
                      onClick={() => onRemoveInfrastructure(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {/* Add new infrastructure item */}
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Добавить элемент инфраструктуры"
                  value={newInfrastructure}
                  onChange={(e) => setNewInfrastructure(e.target.value)}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleAddInfrastructure} 
                  disabled={!newInfrastructure.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Housing switcher */}
          <div className="space-y-2">
            <Label>Предоставление жилья</Label>
            <div className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">С жильем</p>
                  <p className="text-sm text-muted-foreground">
                    Указывает, предоставляет ли школа жилье для учителей
                  </p>
                </div>
                <Switch
                  checked={schoolData.housing}
                  onCheckedChange={onHousingToggle}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isUpdating}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating}
            >
              {isUpdating ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;