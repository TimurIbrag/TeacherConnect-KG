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
  const {
    toast
  } = useToast();
  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      console.log('Starting Google OAuth registration flow...', {
        userType
      });
      const {
        data,
        error
      } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            role: userType
          }
        }
      });
      console.log('Google OAuth registration response:', {
        data,
        error
      });
      if (error) {
        console.error('Google OAuth error:', error);
        toast({
          title: "Ошибка",
          description: `Google OAuth error: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // If we get here, the redirect should happen automatically
      console.log('Google OAuth registration initiated successfully');
    } catch (error: any) {
      console.error('Unexpected error during Google registration:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Произошла неожиданная ошибка при регистрации через Google",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  return <Button variant="outline" onClick={handleGoogleRegister} disabled={isLoading} className="Still nothing">
      <Chrome className="mr-2 h-4 w-4" />
      Зарегистрироваться через Google
    </Button>;
};
export default RegisterSocialAuth;