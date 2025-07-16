
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';

// Auth Components
import AuthContainer from '@/components/auth/AuthContainer';
import AuthError from '@/components/auth/AuthError';
import LoginForm from '@/components/auth/LoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get user type from URL params if provided - check both 'type' and 'userType'
  const userTypeFromUrl = searchParams.get('type') || searchParams.get('userType');
  const userType = (userTypeFromUrl === 'school' || userTypeFromUrl === 'teacher') 
    ? userTypeFromUrl as 'teacher' | 'school'
    : undefined;

  console.log('LoginPage - userType from URL:', userType);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в личный кабинет",
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContainer
      title={t('auth.login')}
      description={t('auth.loginDescription')}
      footerText={t('auth.dontHaveAccount')}
      footerLinkText={t('nav.register')}
      footerLinkPath={userType ? `/register?type=${userType}` : "/register"}
    >
      <div className="grid gap-4">
        <AuthError message={error} />
        
        <GoogleLoginButton 
          isLoading={isLoading}
          userType={userType}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t('auth.orLoginWithEmail')}
            </span>
          </div>
        </div>
        
        <LoginForm
          onSubmit={handleLogin}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLoading={isLoading}
        />
      </div>
    </AuthContainer>
  );
};

export default LoginPage;
