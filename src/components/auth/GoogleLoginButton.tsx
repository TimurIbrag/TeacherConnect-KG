
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
      console.log('🟢 Google OAuth LOGIN initiated');
      console.log('🎯 User type for login:', userType);
      
      // Store user type if provided (for login flow)
      if (userType) {
        // Clear existing storage first
        const keysToClean = [
          'confirmed_user_type', 'oauth_user_type', 'registration_user_type',
          'pendingUserType', 'intended_user_type', 'user_type_source',
          'user_type_timestamp', 'oauth_provider', 'flow_type', 'oauth_flow'
        ];
        
        keysToClean.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        const timestamp = Date.now().toString();
        const storageData = {
          // Primary keys for login
          confirmed_user_type: userType,
          oauth_user_type: userType,
          
          // Backup keys
          pendingUserType: userType,
          intended_user_type: userType,
          
          // Metadata
          user_type_source: 'login_oauth_google',
          user_type_timestamp: timestamp,
          oauth_provider: 'google',
          flow_type: 'login',
          oauth_flow: 'login'
        };
        
        // Store in both storage types
        Object.entries(storageData).forEach(([key, value]) => {
          localStorage.setItem(key, value);
          sessionStorage.setItem(key, value);
          console.log(`💾 LOGIN STORAGE ${key}: ${value}`);
        });
        
        console.log('✅ User type stored for LOGIN as:', userType);
      }
      
      // Build redirect URL
      const baseUrl = window.location.origin;
      const timestamp = Date.now().toString();
      
      let redirectUrl = `${baseUrl}/?flow=login&oauth=google&provider=google&timestamp=${timestamp}`;
      
      if (userType) {
        redirectUrl = `${baseUrl}/?userType=${userType}&type=${userType}&user_type=${userType}&role=${userType}&flow=login&oauth=google&provider=google&timestamp=${timestamp}&intent=login&action=signin`;
      }
      
      console.log('🔗 OAuth LOGIN redirect URL:', redirectUrl);
      
      // Prepare query parameters
      const queryParams: Record<string, string> = {
        access_type: 'offline',
        prompt: 'consent',
        timestamp: timestamp
      };
      
      if (userType) {
        // Add user type parameters
        queryParams.userType = userType;
        queryParams.type = userType;
        queryParams.user_type = userType;
        queryParams.role = userType;
        queryParams.flow = 'login';
        queryParams.oauth = 'google';
        queryParams.provider = 'google';
        queryParams.intent = 'login';
        queryParams.action = 'signin';
      }
      
      // Initiate OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams
        }
      });

      console.log('📤 OAuth LOGIN response:', { data, error });
      
      if (error) {
        console.error('❌ OAuth LOGIN error:', error);
        
        toast({
          title: "Ошибка входа",
          description: `OAuth ошибка: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('🚀 OAuth LOGIN initiated successfully');
      
    } catch (error: any) {
      console.error('❌ Unexpected error during Google login:', error);
      
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
      {isLoading ? 'Вход...' : 'Войти через Google'}
      {userType && (
        <span className="text-xs text-muted-foreground ml-1">
          как {userType === 'teacher' ? 'учитель' : 'школа'}
        </span>
      )}
    </Button>
  );
};

export default GoogleLoginButton;
