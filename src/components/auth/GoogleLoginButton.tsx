
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
      console.log('🔵 Google OAuth login button clicked');
      console.log('🎯 User type for OAuth:', userType);
      
      // Enhanced storage for login flow
      if (userType) {
        const storageData = {
          oauth_user_type: userType,
          pendingUserType: userType,
          pendingOAuthFlow: 'login',
          intended_user_type: userType,
          timestamp: Date.now().toString()
        };
        
        // Store in both localStorage and sessionStorage
        Object.entries(storageData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
          sessionStorage.setItem(key, value);
        });
        
        console.log('💾 Enhanced storage - stored user type for login:', userType);
      }
      
      // Create enhanced redirect URL with multiple parameter formats
      const baseUrl = window.location.origin;
      const redirectUrl = userType 
        ? `${baseUrl}/?userType=${userType}&type=${userType}&user_type=${userType}&flow=login&oauth=google`
        : `${baseUrl}/?flow=login&oauth=google`;
      
      console.log('🔗 Enhanced OAuth redirect URL:', redirectUrl);
      
      const queryParams: Record<string, string> = {
        access_type: 'offline',
        prompt: 'consent'
      };
      
      if (userType) {
        queryParams.userType = userType;
        queryParams.type = userType;
        queryParams.user_type = userType;
        queryParams.flow = 'login';
        queryParams.oauth = 'google';
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams
        }
      });

      console.log('📤 Supabase OAuth response:', { data, error });
      
      if (error) {
        console.error('❌ Supabase OAuth error details:', {
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

      console.log('✅ OAuth login initiated successfully, redirecting to Google...');
      
    } catch (error: any) {
      console.error('❌ Unexpected error during Google auth:', error);
      
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
