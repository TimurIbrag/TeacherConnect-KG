
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
import { 
  AlertCircle, 
  Chrome 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Google авторизация",
        description: "Для интеграции с Google требуется настройка Firebase или другого auth провайдера",
      });
    } catch (err) {
      setError('Ошибка при входе через Google');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto flex justify-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('auth.login')}</CardTitle>
          <CardDescription>
            Войдите в аккаунт для доступа к платформе
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-4">
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Войти через Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Или войдите через email
                </span>
              </div>
            </div>
            
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
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Вход...' : t('auth.submit')}
              </Button>
            </form>
          </div>
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
