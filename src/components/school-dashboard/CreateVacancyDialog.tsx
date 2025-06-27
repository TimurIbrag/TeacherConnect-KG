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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VacancyPreviewDialog from './VacancyPreviewDialog';

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
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

  const form = useForm({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: duplicateVacancy?.title || '',
      vacancy_type: duplicateVacancy?.vacancy_type || 'teacher',
      subject: duplicateVacancy?.subject || '',
      education_level: duplicateVacancy?.education_level || 'any',
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
    },
  });

  const requirements = form.watch('requirements') || [];
  const benefits = form.watch('benefits') || [];

  const addRequirement = () => {
    if (newRequirement.trim()) {
      form.setValue('requirements', [...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    form.setValue('requirements', requirements.filter((_, i) => i !== index));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      form.setValue('benefits', [...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    form.setValue('benefits', benefits.filter((_, i) => i !== index));
  };

  const handlePreview = () => {
    form.trigger().then((isValid) => {
      if (isValid) {
        setPreviewOpen(true);
      } else {
        toast({
          title: 'Проверьте форму',
          description: 'Пожалуйста, исправьте ошибки в форме перед предварительным просмотром',
          variant: 'destructive',
        });
      }
    });
  };

  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    
    // Ensure all required fields are present
    const vacancyData = {
      title: data.title,
      vacancy_type: data.vacancy_type || 'teacher',
      subject: data.subject,
      education_level: data.education_level || 'any',
      employment_type: data.employment_type || 'full-time',
      location: data.location,
      salary_min: data.salary_min || null,
      salary_max: data.salary_max || null,
      salary_currency: data.salary_currency || 'rub',
      description: data.description,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      experience_required: data.experience_required || 0,
      requirements: data.requirements || [],
      benefits: data.benefits || [],
      is_active: true, // Automatically publish
    };
    
    onVacancyCreated(vacancyData);
  };

  const handlePublishFromPreview = () => {
    const data = form.getValues();
    setPreviewOpen(false);
    
    const vacancyData = {
      title: data.title,
      vacancy_type: data.vacancy_type || 'teacher',
      subject: data.subject,
      education_level: data.education_level || 'any',
      employment_type: data.employment_type || 'full-time',
      location: data.location,
      salary_min: data.salary_min || null,
      salary_max: data.salary_max || null,
      salary_currency: data.salary_currency || 'rub',
      description: data.description,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      experience_required: data.experience_required || 0,
      requirements: data.requirements || [],
      benefits: data.benefits || [],
      is_active: true, // Automatically publish
    };
    
    onVacancyCreated(vacancyData);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Основная информация</h3>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название вакансии *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Например: Учитель математики" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vacancy_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Тип вакансии *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип вакансии" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="teacher">Учитель</SelectItem>
                            <SelectItem value="tutor">Репетитор</SelectItem>
                            <SelectItem value="assistant">Ассистент</SelectItem>
                            <SelectItem value="coordinator">Координатор</SelectItem>
                            <SelectItem value="other">Другое</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Предмет / Специализация *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Например: Математика, Физика" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="education_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Требуемый уровень образования *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите уровень" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="any">Не важно</SelectItem>
                            <SelectItem value="bachelor">Бакалавр</SelectItem>
                            <SelectItem value="master">Магистр</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Условия работы */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Условия работы</h3>
                  
                  <FormField
                    control={form.control}
                    name="employment_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>График работы *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите график" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full-time">Полный день</SelectItem>
                            <SelectItem value="part-time">Частичная занятость</SelectItem>
                            <SelectItem value="online">Онлайн</SelectItem>
                            <SelectItem value="flexible">Гибкий график</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Город / Локация *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Например: Москва, Санкт-Петербург" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Зарплата (по желанию)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="salary_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="От"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="salary_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                placeholder="До"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="salary_currency"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="rub">Рубли (₽)</SelectItem>
                              <SelectItem value="usd">Доллары ($)</SelectItem>
                              <SelectItem value="eur">Евро (€)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experience_required"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Требуемый опыт (лет)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || 0}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Описание */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Описание вакансии</h3>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Полное описание вакансии *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Опишите обязанности, условия работы, требования к кандидату..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Требования и преимущества */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Требования</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
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
                    <div className="flex flex-wrap gap-1">
                      {requirements.map((req: string, index: number) => (
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
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-lg border-b pb-2">Преимущества</h3>
                  <div className="space-y-2">
                    <div className="flex gap-2">
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
                    <div className="flex flex-wrap gap-1">
                      {benefits.map((benefit: string, index: number) => (
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
                </div>
              </div>

              {/* Контактная информация */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg border-b pb-2">Контактная информация</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Контактное лицо *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Имя Фамилия" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Телефон *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+7 (XXX) XXX-XX-XX" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="contact@school.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Предварительный просмотр
                </Button>
                <Button type="submit" disabled={isCreating}>
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
