
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
    if (!userType) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите тип пользователя",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🟢 Google OAuth REGISTRATION initiated for user type:', userType);
      
      // CRITICAL: Store user type BEFORE OAuth redirect
      const timestamp = Date.now().toString();
      const storageData = {
        // High priority keys
        confirmed_user_type: userType,
        oauth_user_type: userType,
        registration_user_type: userType,
        
        // Backup keys for compatibility
        pendingUserType: userType,
        intended_user_type: userType,
        
        // Metadata
        user_type_source: 'registration_oauth',
        user_type_timestamp: timestamp,
        oauth_provider: 'google',
        flow_type: 'registration',
        oauth_flow: 'registration'
      };
      
      // Store in BOTH storage types for maximum persistence
      Object.entries(storageData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        console.log(`💾 STORED ${key}: ${value}`);
      });
      
      console.log('✅ User type storage completed for:', userType);
      
      // Build redirect URL with EXPLICIT user type parameters
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/?userType=${userType}&type=${userType}&user_type=${userType}&role=${userType}&flow=registration&oauth=google&provider=google&timestamp=${timestamp}`;
      
      console.log('🔗 OAuth redirect URL:', redirectUrl);
      
      // Initiate OAuth with comprehensive parameters
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            // OAuth provider params
            access_type: 'offline',
            prompt: 'consent',
            
            // Our user type params (multiple formats for reliability)
            userType: userType,
            type: userType,
            user_type: userType,
            role: userType,
            flow: 'registration',
            oauth: 'google',
            provider: 'google',
            timestamp: timestamp
          }
        }
      });

      console.log('📤 Supabase OAuth response:', { data, error });

      if (error) {
        console.error('❌ OAuth registration error:', error);
        
        // Clear storage on error
        Object.keys(storageData).forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        toast({
          title: "Ошибка регистрации",
          description: `Ошибка OAuth: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log('🚀 OAuth registration flow initiated successfully');
      // Don't setIsLoading(false) here - the page will redirect
      
    } catch (error: any) {
      console.error('❌ Unexpected error during Google registration:', error);
      
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
      disabled={isLoading || !userType} 
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      {isLoading ? 'Регистрация...' : `Зарегистрироваться через Google как ${userType === 'teacher' ? 'учитель' : 'школа'}`}
    </Button>
  );
};

export default RegisterSocialAuth;
