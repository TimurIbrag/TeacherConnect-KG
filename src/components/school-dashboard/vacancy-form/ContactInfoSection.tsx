
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Building, User, Phone, Mail } from 'lucide-react';

interface ContactInfoSectionProps {
  form: UseFormReturn<any>;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
        <Building className="h-5 w-5" />
        Контактная информация
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Имя контактного лица *
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="Например: Иван Иванов" />
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
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Телефон *
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="+996 XXX XXX XXX" />
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
              <FormLabel className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="example@school.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactInfoSection;
