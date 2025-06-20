
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
    setIsLoading(true);
    try {
      console.log('🔵 Google OAuth registration button clicked');
      console.log('🎯 User type for registration:', userType);
      
      // ENHANCED storage with multiple redundant keys and timestamps
      const timestamp = Date.now().toString();
      const storageData = {
        // Primary keys
        confirmed_user_type: userType,
        oauth_user_type: userType,
        
        // Legacy compatibility keys
        pendingUserType: userType,
        pendingOAuthFlow: 'registration',
        registration_user_type: userType,
        intended_user_type: userType,
        
        // Additional verification
        user_type_source: 'registration_oauth',
        user_type_timestamp: timestamp,
        oauth_provider: 'google',
        flow_type: 'registration'
      };
      
      // Store in BOTH localStorage and sessionStorage with ALL keys
      Object.entries(storageData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);
        console.log(`💾 Stored ${key}: ${value}`);
      });
      
      console.log('💾 COMPLETE storage setup completed for userType:', userType);
      
      const baseUrl = window.location.origin;
      
      // TRIPLE-REDUNDANT redirect URL with multiple formats
      const redirectUrl = `${baseUrl}/?userType=${userType}&type=${userType}&user_type=${userType}&role=${userType}&flow=registration&oauth=google&provider=google&timestamp=${timestamp}`;
      console.log('🔗 ENHANCED registration redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Triple redundancy in query params
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

      console.log('📤 Supabase OAuth registration response:', { data, error });

      if (error) {
        console.error('❌ Supabase OAuth registration error details:', {
          message: error.message,
          status: error.status,
          details: error
        });
        
        toast({
          title: "Ошибка",
          description: `Детали ошибки: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log('✅ OAuth registration initiated successfully, redirecting to Google...');
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
      disabled={isLoading} 
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      Зарегистрироваться через Google как {userType === 'teacher' ? 'учитель' : 'школа'}
    </Button>
  );
};

export default RegisterSocialAuth;
