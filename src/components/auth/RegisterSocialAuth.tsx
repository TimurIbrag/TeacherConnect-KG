
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
      
      // CRITICAL: Clear any existing storage first
      const keysToClean = [
        'confirmed_user_type', 'oauth_user_type', 'registration_user_type',
        'pendingUserType', 'intended_user_type', 'user_type_source',
        'user_type_timestamp', 'oauth_provider', 'flow_type', 'oauth_flow'
      ];
      
      keysToClean.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Store user type with MAXIMUM persistence and priority
      const timestamp = Date.now().toString();
      const storageData = {
        // TOP PRIORITY KEYS for school registration
        confirmed_user_type: userType,
        oauth_user_type: userType,
        registration_user_type: userType,
        
        // Backup keys for compatibility
        pendingUserType: userType,
        intended_user_type: userType,
        
        // Metadata
        user_type_source: 'registration_oauth_google',
        user_type_timestamp: timestamp,
        oauth_provider: 'google',
        flow_type: 'registration',
        oauth_flow: 'registration'
      };
      
      // Store in BOTH storage types with logging
      Object.entries(storageData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        console.log(`💾 REGISTRATION STORAGE ${key}: ${value}`);
      });
      
      console.log('✅ User type storage completed for REGISTRATION as:', userType);
      
      // Build comprehensive redirect URL with ALL possible parameters
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/?userType=${userType}&type=${userType}&user_type=${userType}&role=${userType}&flow=registration&oauth=google&provider=google&timestamp=${timestamp}&intent=register&action=signup`;
      
      console.log('🔗 OAuth REGISTRATION redirect URL:', redirectUrl);
      
      // Initiate OAuth with comprehensive parameters
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            // OAuth provider params
            access_type: 'offline',
            prompt: 'consent',
            
            // SCHOOL registration specific params (high priority)
            userType: userType,
            type: userType,
            user_type: userType,
            role: userType,
            flow: 'registration',
            oauth: 'google',
            provider: 'google',
            timestamp: timestamp,
            intent: 'register',
            action: 'signup'
          }
        }
      });

      console.log('📤 Supabase OAuth REGISTRATION response:', { data, error });

      if (error) {
        console.error('❌ OAuth REGISTRATION error:', error);
        
        // Clear storage on error
        keysToClean.forEach(key => {
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

      console.log('🚀 OAuth REGISTRATION flow initiated successfully for:', userType);
      // Don't setIsLoading(false) here - the page will redirect
      
    } catch (error: any) {
      console.error('❌ Unexpected error during Google REGISTRATION:', error);
      
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
