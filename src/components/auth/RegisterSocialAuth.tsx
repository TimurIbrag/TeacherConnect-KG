
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

const RegisterSocialAuth: React.FC<RegisterSocialAuthProps> = ({
  userType,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      console.log('Google OAuth registration button clicked');
      console.log('User type for registration:', userType);
      
      // Store the user type in multiple places for maximum reliability
      localStorage.setItem('pendingUserType', userType);
      localStorage.setItem('pendingOAuthFlow', 'registration');
      sessionStorage.setItem('pendingUserType', userType);
      sessionStorage.setItem('pendingOAuthFlow', 'registration');
      console.log('Stored user type for registration:', userType);
      
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/?userType=${userType}&flow=registration`;
      console.log('Registration redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            userType: userType,
            flow: 'registration'
          }
        }
      });

      console.log('Supabase OAuth registration response:', { data, error });

      if (error) {
        console.error('Supabase OAuth registration error details:', {
          message: error.message,
          status: error.status,
          details: error
        });
        
        toast({
          title: "Ошибка",
          description: `Детали ошибки: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log('OAuth registration initiated successfully, should redirect to Google...');
    } catch (error: any) {
      console.error('Unexpected error during Google registration:', error);
      
      toast({
        title: "Ошибка",
        description: `Неожиданная ошибка: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
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
      Зарегистрироваться через Google как {userType === 'teacher' ? 'учитель' : 'школа'}
    </Button>
  );
};

export default RegisterSocialAuth;
