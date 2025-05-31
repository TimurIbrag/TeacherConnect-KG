
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';

interface CreateVacancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVacancyCreated: (vacancy: any) => void;
}

const CreateVacancyDialog: React.FC<CreateVacancyDialogProps> = ({
  open,
  onOpenChange,
  onVacancyCreated
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [schoolProfile, setSchoolProfile] = useState<any>(null);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');

  // Load school profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem('schoolProfileData');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setSchoolProfile(profile);
      console.log('Loaded school profile for vacancy:', profile);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Vacancy form submission started');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    const newVacancy = {
      id: Date.now(),
      // Job-specific information
      position: formData.get('position') as string,
      subject: formData.get('subject') as string,
      description: formData.get('description') as string,
      salaryMin: parseInt(formData.get('salaryMin') as string) || 0,
      salaryMax: parseInt(formData.get('salaryMax') as string) || 0,
      schedule: formData.get('schedule') as string,
      experience: formData.get('experience') as string,
      education: formData.get('education') as string,
      requirements,
      benefits,
      
      // School information from profile
      schoolName: schoolProfile?.name || 'Не указано',
      schoolAddress: schoolProfile?.address || 'Не указано',
      schoolType: schoolProfile?.type || 'Не указано',
      schoolWebsite: schoolProfile?.website || '',
      schoolInfrastructure: schoolProfile?.infrastructure || [],
      
      // Status and metadata
      status: 'active',
      createdAt: new Date().toISOString(),
      views: 0,
      applications: 0
    };

    console.log('New vacancy object created:', newVacancy);

    // Save to localStorage
    const existingVacancies = JSON.parse(localStorage.getItem('schoolVacancies') || '[]');
    const updatedVacancies = [...existingVacancies, newVacancy];
    localStorage.setItem('schoolVacancies', JSON.stringify(updatedVacancies));

    onVacancyCreated(newVacancy);
    onOpenChange(false);
    setIsSubmitting(false);

    // Reset form
    setRequirements([]);
    setBenefits([]);
    setNewRequirement('');
    setNewBenefit('');

    toast({
      title: "Вакансия создана",
      description: "Новая вакансия успешно добавлена",
    });
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новую вакансию</DialogTitle>
          <DialogDescription>
            Информация о школе будет взята из вашего профиля. Заполните детали вакансии.
          </DialogDescription>
        </DialogHeader>

        {/* School Info Preview */}
        {schoolProfile && (
          <div className="bg-muted/50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-sm mb-2">Информация о школе:</h4>
            <p className="text-sm text-muted-foreground">
              {schoolProfile.name} • {schoolProfile.address}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Должность</Label>
              <Input 
                id="position" 
                name="position" 
                placeholder="Например: Учитель"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Предмет</Label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="Например: Математика"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание работы</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={3}
              placeholder="Опишите основные обязанности и условия работы..."
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Зарплата от (сом)</Label>
              <Input 
                id="salaryMin" 
                name="salaryMin" 
                type="number"
                placeholder="25000"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Зарплата до (сом)</Label>
              <Input 
                id="salaryMax" 
                name="salaryMax" 
                type="number"
                placeholder="40000"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">График работы</Label>
              <Input 
                id="schedule" 
                name="schedule" 
                placeholder="Полный день, 5/2"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Опыт работы</Label>
              <Input 
                id="experience" 
                name="experience" 
                placeholder="От 2 лет"
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Требования к образованию</Label>
            <Input 
              id="education" 
              name="education" 
              placeholder="Высшее педагогическое образование"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>Требования к кандидату</Label>
            <div className="border rounded-md p-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="py-1">
                    {req}
                    <button 
                      type="button"
                      className="ml-1 hover:text-destructive" 
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Добавить требование"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={addRequirement}
                  disabled={!newRequirement.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Что мы предлагаем</Label>
            <div className="border rounded-md p-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit, index) => (
                  <Badge key={index} variant="outline" className="py-1">
                    {benefit}
                    <button 
                      type="button"
                      className="ml-1 hover:text-destructive" 
                      onClick={() => removeBenefit(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Добавить преимущество"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                />
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={addBenefit}
                  disabled={!newBenefit.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Создание..." : "Создать вакансию"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVacancyDialog;
