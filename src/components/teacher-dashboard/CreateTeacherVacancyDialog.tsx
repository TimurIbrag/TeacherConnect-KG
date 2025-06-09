
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from '@/context/LanguageContext';

interface CreateTeacherVacancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVacancyCreated: (vacancy: any) => void;
  isCreating: boolean;
}

const availabilityOptions = [
  'Понедельник утром',
  'Понедельник днем',
  'Понедельник вечером',
  'Вторник утром',
  'Вторник днем',
  'Вторник вечером',
  'Среда утром',
  'Среда днем',
  'Среда вечером',
  'Четверг утром',
  'Четверг днем',
  'Четверг вечером',
  'Пятница утром',
  'Пятница днем',
  'Пятница вечером',
  'Суббота утром',
  'Суббота днем',
  'Суббота вечером',
  'Воскресенье утром',
  'Воскресенье днем',
  'Воскресенье вечером',
];

const CreateTeacherVacancyDialog: React.FC<CreateTeacherVacancyDialogProps> = ({
  open,
  onOpenChange,
  onVacancyCreated,
  isCreating,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    hourly_rate: '',
    group_rate: '',
    location: '',
    employment_type: 'part-time',
    experience_required: '0',
    availability: [] as string[],
    languages: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }

    const vacancyData = {
      title: formData.title,
      description: formData.description || null,
      subject: formData.subject || null,
      hourly_rate: formData.hourly_rate ? parseInt(formData.hourly_rate) : null,
      group_rate: formData.group_rate ? parseInt(formData.group_rate) : null,
      location: formData.location || null,
      employment_type: formData.employment_type,
      experience_required: parseInt(formData.experience_required) || 0,
      availability: formData.availability,
      languages: formData.languages,
      is_active: true,
    };

    onVacancyCreated(vacancyData);
  };

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: checked 
        ? [...prev.availability, availability]
        : prev.availability.filter(a => a !== availability)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      hourly_rate: '',
      group_rate: '',
      location: '',
      employment_type: 'part-time',
      experience_required: '0',
      availability: [],
      languages: [],
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новую услугу</DialogTitle>
          <DialogDescription>
            Заполните информацию о вашей услуге преподавания
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название услуги *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Например: Репетитор по математике"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Предмет</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Математика, Физика, Английский..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Опишите вашу услугу, методы преподавания, опыт работы..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Стоимость (индивидуально)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                placeholder="₽/час"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group_rate">Стоимость (группа)</Label>
              <Input
                id="group_rate"
                type="number"
                value={formData.group_rate}
                onChange={(e) => setFormData(prev => ({ ...prev, group_rate: e.target.value }))}
                placeholder="₽/час"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Город, район"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employment_type">Тип занятий</Label>
              <Select value={formData.employment_type} onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="part-time">Репетиторство</SelectItem>
                  <SelectItem value="full-time">Постоянная работа</SelectItem>
                  <SelectItem value="contract">Проектная работа</SelectItem>
                  <SelectItem value="freelance">Фриланс</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_required">Мин. опыт студента (лет)</Label>
              <Input
                id="experience_required"
                type="number"
                value={formData.experience_required}
                onChange={(e) => setFormData(prev => ({ ...prev, experience_required: e.target.value }))}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Доступность</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded p-3">
              {availabilityOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.availability.includes(option)}
                    onCheckedChange={(checked) => handleAvailabilityChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isCreating || !formData.title.trim()}>
              {isCreating ? 'Создание...' : 'Создать услугу'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeacherVacancyDialog;
