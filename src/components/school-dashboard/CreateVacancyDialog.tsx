
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vacancySchema } from '@/lib/validation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
} from '@/components/ui/form';
import { Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VacancyPreviewDialog from './VacancyPreviewDialog';
import BasicInfoSection from './vacancy-form/BasicInfoSection';
import WorkConditionsSection from './vacancy-form/WorkConditionsSection';
import DescriptionSection from './vacancy-form/DescriptionSection';
import RequirementsBenefitsSection from './vacancy-form/RequirementsBenefitsSection';
import ContactInfoSection from './vacancy-form/ContactInfoSection';

interface CreateVacancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVacancyCreated: (vacancy: any) => void;
  isCreating: boolean;
  duplicateVacancy?: any;
}

const CreateVacancyDialog: React.FC<CreateVacancyDialogProps> = ({
  open,
  onOpenChange,
  onVacancyCreated,
  isCreating,
  duplicateVacancy
}) => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: duplicateVacancy?.title || '',
      vacancy_type: duplicateVacancy?.vacancy_type || 'teacher',
      subject: duplicateVacancy?.subject || '',
      employment_type: duplicateVacancy?.employment_type || 'full-time',
      location: duplicateVacancy?.location || '',
      salary_min: duplicateVacancy?.salary_min || undefined,
      salary_max: duplicateVacancy?.salary_max || undefined,
      salary_currency: duplicateVacancy?.salary_currency || 'rub',
      description: duplicateVacancy?.description || '',
      contact_name: duplicateVacancy?.contact_name || '',
      contact_phone: duplicateVacancy?.contact_phone || '',
      contact_email: duplicateVacancy?.contact_email || '',
      experience_required: duplicateVacancy?.experience_required || 0,
      requirements: duplicateVacancy?.requirements || [],
      benefits: duplicateVacancy?.benefits || [],
      housing_provided: duplicateVacancy?.housing_provided || false,
      application_deadline: duplicateVacancy?.application_deadline || '',
    },
  });

  const handlePreview = () => {
    const formData = form.getValues();
    console.log('Preview form data:', formData);
    
    if (!formData.title?.trim()) {
      toast({
        title: 'Заполните название',
        description: 'Название вакансии обязательно для предварительного просмотра',
        variant: 'destructive',
      });
      return;
    }
    
    setPreviewOpen(true);
  };

  const onSubmit = async (data: any) => {
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data:', data);
    
    if (!data.title?.trim()) {
      console.error('Missing title');
      toast({
        title: 'Ошибка валидации',
        description: 'Название вакансии обязательно',
        variant: 'destructive',
      });
      return;
    }
    
    const vacancyData = {
      title: data.title.trim(),
      vacancy_type: data.vacancy_type || 'teacher',
      subject: data.subject?.trim() || null,
      employment_type: data.employment_type || 'full-time',
      location: data.location?.trim() || null,
      salary_min: data.salary_min ? Number(data.salary_min) : null,
      salary_max: data.salary_max ? Number(data.salary_max) : null,
      salary_currency: data.salary_currency || 'rub',
      description: data.description?.trim() || null,
      contact_name: data.contact_name?.trim() || null,
      contact_phone: data.contact_phone?.trim() || null,
      contact_email: data.contact_email?.trim() || null,
      experience_required: Number(data.experience_required) || 0,
      requirements: Array.isArray(data.requirements) ? data.requirements.filter(r => r?.trim()) : [],
      benefits: Array.isArray(data.benefits) ? data.benefits.filter(b => b?.trim()) : [],
      housing_provided: Boolean(data.housing_provided),
      application_deadline: data.application_deadline || null
    };
    
    console.log('Processed vacancy data:', vacancyData);
    console.log('Calling onVacancyCreated...');
    
    try {
      await onVacancyCreated(vacancyData);
      console.log('onVacancyCreated completed successfully');
    } catch (error) {
      console.error('Error in onVacancyCreated:', error);
    }
    
    console.log('=== FORM SUBMISSION END ===');
  };

  const handlePublishFromPreview = async () => {
    setPreviewOpen(false);
    const data = form.getValues();
    await onSubmit(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {duplicateVacancy && <Copy className="h-5 w-5" />}
              {duplicateVacancy ? 'Дублировать вакансию' : 'Создать новую вакансию'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <BasicInfoSection form={form} />
              <WorkConditionsSection form={form} />
              <DescriptionSection form={form} />
              <RequirementsBenefitsSection form={form} />
              <ContactInfoSection form={form} />

              {/* Кнопки действий */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isCreating}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isCreating}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Предварительный просмотр
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreating ? 'Создаем...' : 'Опубликовать вакансию'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <VacancyPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        vacancyData={form.getValues()}
        onConfirmPublish={handlePublishFromPreview}
        isPublishing={isCreating}
      />
    </>
  );
};

export default CreateVacancyDialog;
