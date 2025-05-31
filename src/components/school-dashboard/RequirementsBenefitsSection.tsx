
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from 'lucide-react';

interface RequirementsBenefitsSectionProps {
  requirements: string[];
  setRequirements: (requirements: string[]) => void;
  newRequirement: string;
  setNewRequirement: (requirement: string) => void;
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
  newBenefit: string;
  setNewBenefit: (benefit: string) => void;
}

const RequirementsBenefitsSection: React.FC<RequirementsBenefitsSectionProps> = ({
  requirements,
  setRequirements,
  newRequirement,
  setNewRequirement,
  benefits,
  setBenefits,
  newBenefit,
  setNewBenefit
}) => {
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
    <>
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
    </>
  );
};

export default RequirementsBenefitsSection;
