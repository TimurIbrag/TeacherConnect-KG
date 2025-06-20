
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
      
      // Enhanced storage for login flow with redundant keys
      if (userType) {
        const timestamp = Date.now().toString();
        const storageData = {
          // Primary keys
          confirmed_user_type: userType,
          oauth_user_type: userType,
          
          // Legacy compatibility
          pendingUserType: userType,
          pendingOAuthFlow: 'login',
          intended_user_type: userType,
          
          // Additional verification
          user_type_source: 'login_oauth',
          user_type_timestamp: timestamp,
          oauth_provider: 'google',
          flow_type: 'login'
        };
        
        // Store in both localStorage and sessionStorage
        Object.entries(storageData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
          sessionStorage.setItem(key, value);
          console.log(`💾 Login storage ${key}: ${value}`);
        });
        
        console.log('💾 Enhanced storage - stored user type for login:', userType);
      }
      
      // Create enhanced redirect URL with comprehensive parameters
      const baseUrl = window.location.origin;
      const timestamp = Date.now().toString();
      
      const redirectUrl = userType 
        ? `${baseUrl}/?userType=${userType}&type=${userType}&user_type=${userType}&role=${userType}&flow=login&oauth=google&provider=google&timestamp=${timestamp}`
        : `${baseUrl}/?flow=login&oauth=google&provider=google&timestamp=${timestamp}`;
      
      console.log('🔗 Enhanced OAuth login redirect URL:', redirectUrl);
      
      const queryParams: Record<string, string> = {
        access_type: 'offline',
        prompt: 'consent',
        timestamp: timestamp
      };
      
      if (userType) {
        // Triple redundancy in query parameters
        queryParams.userType = userType;
        queryParams.type = userType;
        queryParams.user_type = userType;
        queryParams.role = userType;
        queryParams.flow = 'login';
        queryParams.oauth = 'google';
        queryParams.provider = 'google';
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
