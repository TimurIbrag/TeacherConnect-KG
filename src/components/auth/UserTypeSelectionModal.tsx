
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserTypeSelected: (userType: 'teacher' | 'school') => void;
}

const UserTypeSelectionModal: React.FC<UserTypeSelectionModalProps> = ({
  isOpen,
  onClose,
  onUserTypeSelected
}) => {
  const [selectedType, setSelectedType] = useState<'teacher' | 'school' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedType) {
      toast({
        title: "Выберите тип аккаунта",
        description: "Пожалуйста, выберите, кем вы являетесь",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      // Update the user's profile with the selected role
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedType })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      console.log('✅ User type updated to:', selectedType);

      toast({
        title: "Тип пользователя сохранен",
        description: `Вы выбрали роль: ${selectedType === 'teacher' ? 'Учитель' : 'Школа'}`,
      });

      onUserTypeSelected(selectedType);
      onClose();
    } catch (error: any) {
      console.error('❌ Error updating user type:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить тип пользователя",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Выберите тип аккаунта</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Выберите, кем вы являетесь, чтобы мы могли настроить ваш профиль.
          </p>
          
          <RadioGroup
            value={selectedType || ''}
            onValueChange={(value) => setSelectedType(value as 'teacher' | 'school')}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="teacher" id="teacher-modal" />
              <Label htmlFor="teacher-modal" className="flex items-center cursor-pointer flex-1">
                <User className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">Учитель</div>
                  <div className="text-sm text-muted-foreground">Ищу работу в школе</div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
              <RadioGroupItem value="school" id="school-modal" />
              <Label htmlFor="school-modal" className="flex items-center cursor-pointer flex-1">
                <Building2 className="h-5 w-5 mr-3" />
                <div>
                  <div className="font-medium">Школа</div>
                  <div className="text-sm text-muted-foreground">Ищу учителей</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !selectedType} 
              className="flex-1"
            >
              {isLoading ? 'Сохранение...' : 'Продолжить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserTypeSelectionModal;
