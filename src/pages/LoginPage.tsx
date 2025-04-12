
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
  AlertCircle 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simple validation
      if (!email || !password) {
        setError('Пожалуйста, введите email и пароль');
        return;
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
            
            <div className="space-y-2 text-sm">
              <p className="text-center text-muted-foreground">
                Для демонстрации:
              </p>
              <p className="text-center text-muted-foreground">
                - email с "school" или "edu" ведет в кабинет школы
              </p>
              <p className="text-center text-muted-foreground">
                - остальные email ведут в кабинет учителя
              </p>
            </div>
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
