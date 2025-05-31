
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateVacancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVacancyCreated: (vacancy: any) => void;
  isCreating?: boolean;
}

const CreateVacancyDialog: React.FC<CreateVacancyDialogProps> = ({
  open,
  onOpenChange,
  onVacancyCreated,
  isCreating = false,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    location: '',
    salary_min: '',
    salary_max: '',
    employment_type: 'full-time',
    experience_required: '',
    application_deadline: '',
    housing_provided: false,
  });

  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements(prev => [...prev, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits(prev => [...prev, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Ошибка",
        description: "Название вакансии обязательно для заполнения",
        variant: "destructive",
      });
      return;
    }

    const vacancyData = {
      ...formData,
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      experience_required: formData.experience_required ? parseInt(formData.experience_required) : null,
      application_deadline: formData.application_deadline || null,
      requirements: requirements.length > 0 ? requirements : null,
      benefits: benefits.length > 0 ? benefits : null,
      is_active: true,
    };

    onVacancyCreated(vacancyData);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      subject: '',
      location: '',
      salary_min: '',
      salary_max: '',
      employment_type: 'full-time',
      experience_required: '',
      application_deadline: '',
      housing_provided: false,
    });
    setRequirements([]);
    setBenefits([]);
    setNewRequirement('');
    setNewBenefit('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isCreating) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новую вакансию</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Название вакансии *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Например: Учитель математики"
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">Предмет</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Например: Математика"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание вакансии</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Подробное описание вакансии, обязанностей и условий работы"
                rows={4}
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employment_type">Тип занятости</Label>
              <Select
                value={formData.employment_type}
                onValueChange={(value) => handleInputChange('employment_type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Полная занятость</SelectItem>
                  <SelectItem value="part-time">Частичная занятость</SelectItem>
                  <SelectItem value="contract">Контракт</SelectItem>
                  <SelectItem value="temporary">Временная работа</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Город или регион"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salary_min">Зарплата от (₽)</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => handleInputChange('salary_min', e.target.value)}
                placeholder="50000"
              />
            </div>

            <div>
              <Label htmlFor="salary_max">Зарплата до (₽)</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => handleInputChange('salary_max', e.target.value)}
                placeholder="80000"
              />
            </div>
          </div>

          {/* Experience and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience_required">Требуемый опыт (лет)</Label>
              <Input
                id="experience_required"
                type="number"
                value={formData.experience_required}
                onChange={(e) => handleInputChange('experience_required', e.target.value)}
                placeholder="3"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="application_deadline">Срок подачи заявок</Label>
              <Input
                id="application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => handleInputChange('application_deadline', e.target.value)}
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <Label>Требования к кандидату</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Добавить требование"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.map((req, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {req}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeRequirement(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label>Преимущества работы</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Добавить преимущество"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button type="button" onClick={addBenefit} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {benefit}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeBenefit(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isCreating}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Создание...' : 'Создать вакансию'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVacancyDialog;
