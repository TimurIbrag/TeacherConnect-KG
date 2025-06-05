
import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginButtonProps {
  onClick?: () => void;
  isLoading: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ isLoading }) => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: "Ошибка входа",
        description: error.message || 'Не удалось войти через Google',
        variant: "destructive",
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
