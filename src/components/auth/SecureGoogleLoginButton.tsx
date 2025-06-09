
import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { isValidUrl } from '@/lib/security';

interface SecureGoogleLoginButtonProps {
  isLoading: boolean;
}

const SecureGoogleLoginButton: React.FC<SecureGoogleLoginButtonProps> = ({ isLoading }) => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      console.log('Google OAuth button clicked');
      
      // Validate redirect URL
      const redirectUrl = `${window.location.origin}/`;
      
      if (!isValidUrl(redirectUrl)) {
        throw new Error('Invalid redirect URL');
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('Supabase OAuth error:', error);
        
        // User-friendly error messages
        let errorMessage = 'Ошибка входа через Google';
        
        if (error.message?.includes('popup_closed_by_user')) {
          errorMessage = 'Вход отменен пользователем';
        } else if (error.message?.includes('access_denied')) {
          errorMessage = 'Доступ запрещен. Проверьте разрешения.';
        }
        
        toast({
          title: "Ошибка входа",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      console.log('OAuth initiated successfully');
      
    } catch (error: any) {
      console.error('Unexpected error during Google auth:', error);
      
      toast({
        title: "Ошибка входа",
        description: 'Не удалось войти через Google. Попробуйте позже.',
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      type="button"
      variant="outline" 
      onClick={handleGoogleLogin} 
      disabled={isLoading}
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      Войти через Google
    </Button>
  );
};

export default SecureGoogleLoginButton;
