
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VacancyFormFieldsProps {
  // No props needed as form fields are controlled by the parent form
}

const VacancyFormFields: React.FC<VacancyFormFieldsProps> = () => {
  return (
    <>
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
    </>
  );
};

export default VacancyFormFields;
