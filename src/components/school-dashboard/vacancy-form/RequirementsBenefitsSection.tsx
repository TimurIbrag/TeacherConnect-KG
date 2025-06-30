
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface RequirementsBenefitsSectionProps {
  form: UseFormReturn<any>;
}

const RequirementsBenefitsSection: React.FC<RequirementsBenefitsSectionProps> = ({ form }) => {
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');

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

  return (
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
  );
};

export default RequirementsBenefitsSection;
