
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { CheckCircle, Mail } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to send recovery email
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      toast({
        title: "Код отправлен",
        description: "Проверьте вашу электронную почту для получения кода восстановления",
        variant: "default",
      });
    }, 1500);
  };
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Пароль изменен",
        description: "Ваш пароль был успешно изменен. Теперь вы можете войти в систему.",
        variant: "default",
      });
    }, 1500);
  };
  
  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto flex justify-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Восстановление пароля</CardTitle>
          <CardDescription>
            {emailSent 
              ? "Введите код подтверждения и новый пароль" 
              : "Введите ваш email для восстановления пароля"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="mail@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Отправка...' : 'Отправить код'}
                {!isLoading && <Mail className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Код подтверждения</Label>
                <Input 
                  id="code" 
                  placeholder="123456" 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder="********" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-destructive">Пароли не совпадают</p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || newPassword !== confirmPassword || !verificationCode}
              >
                {isLoading ? 'Сохранение...' : 'Изменить пароль'}
                {!isLoading && <CheckCircle className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            Вспомнили пароль?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Вернуться к входу
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
