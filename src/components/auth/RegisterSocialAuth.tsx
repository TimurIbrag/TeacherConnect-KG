
import React from 'react';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RegisterSocialAuthProps {
  userType: 'teacher' | 'school';
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const RegisterSocialAuth: React.FC<RegisterSocialAuthProps> = ({ userType, isLoading, setIsLoading }) => {
  const { toast } = useToast();

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            role: userType,
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось выполнить регистрацию через Google. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGoogleRegister} 
      disabled={isLoading}
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      Зарегистрироваться через Google
    </Button>
  );
};

export default RegisterSocialAuth;
