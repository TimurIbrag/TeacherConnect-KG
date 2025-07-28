import React from 'react';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RegisterSocialAuthProps {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const RegisterSocialAuth: React.FC<RegisterSocialAuthProps> = ({
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    
    try {
      console.log('🟢 Google OAuth registration initiated');
      console.log('📍 Current URL:', window.location.href);
      console.log('🏠 Origin:', window.location.origin);
      console.log('🔧 Environment check:', {
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL?.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Clear any existing storage
      const keysToClean = [
        'confirmed_user_type', 'oauth_user_type', 'registration_user_type',
        'pendingUserType', 'intended_user_type', 'user_type_source',
        'user_type_timestamp', 'oauth_provider', 'flow_type', 'oauth_flow'
      ];
      
      keysToClean.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Redirect to home page after successful OAuth - let the auth system handle the rest
      const redirectUrl = `${window.location.origin}/`;
      
      console.log('🔗 OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('📤 Supabase OAuth response:', { data, error });

      if (error) {
        console.error('❌ OAuth error:', error);
        
        toast({
          title: "Ошибка регистрации",
          description: `Ошибка OAuth: ${error.message}`,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      console.log('🚀 OAuth flow initiated successfully');
      console.log('📋 Data received:', data);
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
      disabled={isLoading} 
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      {isLoading ? 'Регистрация...' : 'Зарегистрироваться через Google'}
    </Button>
  );
};

export default RegisterSocialAuth;