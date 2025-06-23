import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { loginSchema } from '@/lib/validation';
import { checkPasswordStrength } from '@/lib/security';
import SecureFormWrapper from '@/components/forms/SecureFormWrapper';

const SecureLoginForm: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { secureLogin } = useSecureAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error: any) {
      const validationErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await secureLogin(email, password);
      
      toast({
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в личный кабинет",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Произошла ошибка при входе';
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Неверный email или пароль';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Подтвердите email для входа';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Ошибка входа',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SecureFormWrapper onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder="mail@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:underline"
          >
            Забыли пароль?
          </Link>
        </div>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="********" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : t('auth.submit')}
      </Button>
    </SecureFormWrapper>
  );
};

export default SecureLoginForm;
