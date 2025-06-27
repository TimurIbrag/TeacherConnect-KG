
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
import { CheckCircle, Mail, Loader2 } from 'lucide-react';
import { useSecureAuth } from '@/hooks/useSecureAuth';

const ForgotPasswordPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { securePasswordReset } = useSecureAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите email адрес",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await securePasswordReset(email);
      setEmailSent(true);
      toast({
        title: "Письмо отправлено",
        description: "Проверьте вашу электронную почту для получения ссылки восстановления пароля",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить письмо для восстановления пароля",
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
          <CardTitle className="text-2xl font-bold">Восстановление пароля</CardTitle>
          <CardDescription>
            {emailSent 
              ? "Письмо с инструкциями отправлено на ваш email" 
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    Отправить ссылку
                    <Mail className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Мы отправили ссылку для восстановления пароля на адрес:
                </p>
                <p className="font-semibold">{email}</p>
                <p className="text-sm text-muted-foreground">
                  Проверьте папку "Спам", если письмо не появилось в основной папке.
                </p>
              </div>
              <Button 
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }} 
                variant="outline" 
                className="w-full"
              >
                Отправить повторно
              </Button>
            </div>
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
