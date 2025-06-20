
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
      console.log('User type for OAuth:', userType);
      
      // Store user type in multiple places for reliability
      if (userType) {
        localStorage.setItem('pendingUserType', userType);
        sessionStorage.setItem('pendingUserType', userType);
        console.log('Stored user type in both localStorage and sessionStorage:', userType);
      }
      
      // Mark this as a login flow
      localStorage.setItem('pendingOAuthFlow', 'login');
      sessionStorage.setItem('pendingOAuthFlow', 'login');
      
      // Create redirect URL with userType parameter
      const baseUrl = window.location.origin;
      const redirectUrl = userType 
        ? `${baseUrl}/?userType=${userType}`
        : `${baseUrl}/`;
      
      console.log('OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            ...(userType ? { userType } : {})
          }
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

      console.log('OAuth initiated successfully, redirecting to Google...');
      
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
      {userType && (
        <span className="text-xs text-muted-foreground ml-1">
          как {userType === 'teacher' ? 'учитель' : 'школа'}
        </span>
      )}
    </Button>
  );
};

export default GoogleLoginButton;
