
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GoogleLoginButtonProps {
  isLoading: boolean;
  userType?: 'teacher' | 'school';
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ isLoading, userType }) => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    try {
      console.log('Google OAuth button clicked');
      console.log('User type:', userType);
      
      // Store user type if provided
      if (userType) {
        localStorage.setItem('pendingUserType', userType);
        sessionStorage.setItem('pendingUserType', userType);
        console.log('Stored user type in localStorage:', userType);
      }
      
      // Mark this as a login flow
      localStorage.setItem('pendingOAuthFlow', 'login');
      sessionStorage.setItem('pendingOAuthFlow', 'login');
      
      const redirectUrl = userType 
        ? `${window.location.origin}/?userType=${userType}`
        : `${window.location.origin}/`;
      
      console.log('Redirect URL that will be used:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: userType ? { userType } : undefined
        }
      });

      console.log('Supabase OAuth response:', { data, error });
      
      if (error) {
        console.error('Supabase OAuth error details:', {
          message: error.message,
          status: error.status,
          details: error
        });
        
        toast({
          title: "Ошибка входа",
          description: `Детали ошибки: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('OAuth initiated successfully, should redirect to Google...');
      
    } catch (error: any) {
      console.error('Unexpected error during Google auth:', error);
      
      toast({
        title: "Ошибка входа",
        description: `Неожиданная ошибка: ${error.message || 'Неизвестная ошибка'}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGoogleLogin} 
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3"
    >
      <img 
        src="/lovable-uploads/8241047f-6dfa-408d-b884-1d4865709b9c.png" 
        alt="Google" 
        className="w-5 h-5"
      />
      Войти через Google
    </Button>
  );
};

export default GoogleLoginButton;
