
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { User, Building2, Chrome } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const typeFromQuery = queryParams.get('type');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'teacher' | 'school'>(
    typeFromQuery === 'teacher' || typeFromQuery === 'school'
      ? typeFromQuery
      : 'teacher'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('user', JSON.stringify({
        email,
        type: userType,
        name
      }));
      
      window.dispatchEvent(new Event('login'));
      
      toast({
        title: "Регистрация успешна",
        description: "Добро пожаловать в личный кабинет",
      });
      
      if (userType === 'school') {
        navigate('/school-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать аккаунт. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would be replaced with actual Google Auth API implementation
      // For demo, we'll create a mock user based on the selected type
      const googleUser = {
        email: `google-user-${Date.now()}@gmail.com`,
        type: userType,
        name: userType === 'school' ? 'Google School' : 'Google Teacher',
        authProvider: 'google'
      };
      
      localStorage.setItem('user', JSON.stringify(googleUser));
      
      window.dispatchEvent(new Event('login'));
      
      toast({
        title: "Google регистрация успешна",
        description: "Добро пожаловать в личный кабинет",
      });
      
      if (userType === 'school') {
        navigate('/school-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить регистрацию через Google. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto flex justify-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('auth.register')}</CardTitle>
          <CardDescription>
            Создайте аккаунт для использования платформы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Google Registration Button */}
            <Button 
              variant="outline" 
              onClick={handleGoogleRegister} 
              disabled={isLoading}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Зарегистрироваться через Google
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Или зарегистрируйтесь по email
                </span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">{t('auth.userType')}</Label>
                <RadioGroup
                  id="userType"
                  value={userType}
                  onValueChange={(value) => setUserType(value as 'teacher' | 'school')}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher" className="flex items-center cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      {t('auth.userType.teacher')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 flex-1">
                    <RadioGroupItem value="school" id="school" />
                    <Label htmlFor="school" className="flex items-center cursor-pointer">
                      <Building2 className="h-4 w-4 mr-2" />
                      {t('auth.userType.school')}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  {userType === 'teacher' ? t('auth.name') : 'Название школы'}
                </Label>
                <Input 
                  id="name" 
                  placeholder={userType === 'teacher' ? "Иван Иванов" : "Школа №1"} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="********" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="********" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !!passwordError}
              >
                {isLoading ? 'Регистрация...' : t('auth.register.submit')}
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              {t('nav.login')}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Регистрируясь, вы соглашаетесь с нашими{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Условиями использования
            </Link>{' '}
            и{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Политикой конфиденциальности
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
