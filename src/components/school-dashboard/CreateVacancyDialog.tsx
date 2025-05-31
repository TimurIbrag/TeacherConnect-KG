
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
import { useToast } from '@/hooks/use-toast';
import VacancyFormFields from './VacancyFormFields';
import RequirementsBenefitsSection from './RequirementsBenefitsSection';

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
          <VacancyFormFields />
          
          <RequirementsBenefitsSection
            requirements={requirements}
            setRequirements={setRequirements}
            newRequirement={newRequirement}
            setNewRequirement={setNewRequirement}
            benefits={benefits}
            setBenefits={setBenefits}
            newBenefit={newBenefit}
            setNewBenefit={setNewBenefit}
          />

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
