
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, User, Phone, Mail, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

interface ContactInfoSectionProps {
  form: UseFormReturn<any>;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ form }) => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    phone: '',
    email: ''
  });

  const addContactToDescription = () => {
    if (!contactInfo.name && !contactInfo.phone && !contactInfo.email) {
      toast({
        title: "Заполните контактную информацию",
        description: "Добавьте хотя бы одно поле контактной информации",
        variant: "destructive",
      });
      return;
    }

    let contactText = "Контактная информация:\n";
    if (contactInfo.name) contactText += `Имя: ${contactInfo.name}\n`;
    if (contactInfo.phone) contactText += `Телефон: ${contactInfo.phone}\n`;
    if (contactInfo.email) contactText += `Email: ${contactInfo.email}\n`;

    const currentDesc = form.getValues('description') || '';
    const newDesc = currentDesc ? `${currentDesc}\n\n${contactText}` : contactText;
    form.setValue('description', newDesc);
    
    toast({
      title: "Контакт добавлен",
      description: "Контактная информация добавлена в описание вакансии",
    });

    // Clear contact form
    setContactInfo({ name: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg border-b pb-2 flex items-center gap-2">
        <Building className="h-5 w-5" />
        Контактная информация
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Имя контактного лица
          </Label>
          <Input
            id="contact-name"
            value={contactInfo.name}
            onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Например: Иван Иванов"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Телефон
          </Label>
          <Input
            id="contact-phone"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+996 XXX XXX XXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
            placeholder="example@school.com"
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={addContactToDescription}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Добавить контактную информацию в описание
      </Button>
    </div>
  );
};

export default ContactInfoSection;
