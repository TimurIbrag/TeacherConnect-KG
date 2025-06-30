
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DescriptionSectionProps {
  form: UseFormReturn<any>;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ form }) => {
  const { profile } = useAuth();
  const { toast } = useToast();

  const addSchoolContact = () => {
    if (profile?.email) {
      const contactText = `Контакт: ${profile.email}${profile.phone ? `, тел: ${profile.phone}` : ''}`;
      const currentDesc = form.getValues('description') || '';
      const newDesc = currentDesc ? `${currentDesc}\n\n${contactText}` : contactText;
      form.setValue('description', newDesc);
      toast({
        title: "Контакт добавлен",
        description: "Контактная информация школы добавлена в описание вакансии",
      });
    } else {
      toast({
        title: "Нет контактной информации",
        description: "Заполните профиль школы для добавления контактов",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg border-b pb-2 flex-1">Описание вакансии</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSchoolContact}
          className="ml-4"
        >
          <User className="h-4 w-4 mr-2" />
          Добавить контакт школы
        </Button>
      </div>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Полное описание вакансии</FormLabel>
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
  );
};

export default DescriptionSection;
