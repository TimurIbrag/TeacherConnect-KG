
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        toast({
          title: "Вход выполнен успешно",
          description: "Добро пожаловать в личный кабинет",
          variant: "default",
        });
        
        // Redirect based on email domain (simple simulation)
        if (email.includes('school') || email.includes('edu')) {
          navigate('/school-dashboard');
        } else {
          navigate('/teacher-dashboard');
        }
      } else {
        toast({
          title: "Ошибка входа",
          description: "Пожалуйста, проверьте введенные данные",
          variant: "destructive",
        });
      }
    }, 1500);
  };
  
  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto flex justify-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('auth.login')}</CardTitle>
          <CardDescription>
            Введите свои данные для входа в аккаунт
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="mail@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Вход...' : t('auth.submit')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            Еще нет аккаунта?{' '}
            <Link to="/register" className="text-primary hover:underline">
              {t('nav.register')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
