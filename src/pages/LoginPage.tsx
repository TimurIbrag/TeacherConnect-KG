
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Auth Components
import AuthContainer from '@/components/auth/AuthContainer';
import AuthError from '@/components/auth/AuthError';
import LoginForm from '@/components/auth/LoginForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple validation
      if (!email || !password) {
        throw new Error('Пожалуйста, введите email и пароль');
      }
      
      // For demonstration purposes: 
      // - emails with "school" or "edu" go to school dashboard
      // - all others go to teacher dashboard
      const isSchool = email.includes('school') || email.includes('edu');
      
      // Set user in localStorage (this would be a token in a real app)
      localStorage.setItem('user', JSON.stringify({
        email,
        type: isSchool ? 'school' : 'teacher'
      }));
      
      // Dispatch login event
      window.dispatchEvent(new Event('login'));
      
      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в личный кабинет",
      });
      
      // Redirect based on email domain
      if (isSchool) {
        navigate('/school-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration purposes:
      // Create a random type (school or teacher)
      const isSchool = Math.random() > 0.5;
      
      localStorage.setItem('user', JSON.stringify({
        email: `google-user-${Date.now()}@gmail.com`,
        type: isSchool ? 'school' : 'teacher',
        name: isSchool ? 'Google School' : 'Google Teacher',
        authProvider: 'google'
      }));
      
      // Dispatch login event
      window.dispatchEvent(new Event('login'));
      
      toast({
        title: "Вход через Google выполнен успешно",
        description: "Добро пожаловать в личный кабинет",
      });
      
      // Redirect based on user type
      if (isSchool) {
        navigate('/school-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (err) {
      setError('Ошибка при входе через Google');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContainer
      title={t('auth.login')}
      description="Войдите в аккаунт для доступа к платформе"
      footerText="Еще нет аккаунта?"
      footerLinkText={t('nav.register')}
      footerLinkPath="/register"
    >
      <div className="grid gap-4">
        <AuthError message={error} />
        
        <GoogleLoginButton 
          onClick={handleGoogleLogin} 
          isLoading={isLoading} 
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Или войдите через email
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
