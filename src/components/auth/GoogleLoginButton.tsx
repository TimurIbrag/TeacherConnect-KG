
import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginButtonProps {
  isLoading: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ isLoading }) => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google OAuth flow...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      console.log('Google OAuth response:', { data, error });

      if (error) {
        console.error('Google OAuth error:', error);
        toast({
          title: "Ошибка входа",
          description: `Ошибка входа через Google: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      // If we get here, the redirect should happen automatically
      console.log('Google OAuth initiated successfully');
      
    } catch (error: any) {
      console.error('Unexpected error during Google auth:', error);
      toast({
        title: "Ошибка входа",
        description: error.message || 'Произошла неожиданная ошибка при входе через Google',
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
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

export default GoogleLoginButton;
