import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Chrome, Mail, ArrowLeft } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const defaultUserType = searchParams.get('type') || searchParams.get('userType') || 'teacher';

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'teacher' | 'school'>(
    (defaultUserType === 'school' || defaultUserType === 'teacher') ? defaultUserType as 'teacher' | 'school' : 'teacher'
  );
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      console.log('Google auth initiated with user type:', userType);
      
      // Store the user type for OAuth flow with better reliability
      localStorage.setItem('pendingUserType', userType);
      sessionStorage.setItem('pendingUserType', userType);
      
      // Determine flow type
      const flowType = authMode === 'signup' ? 'registration' : 'login';
      localStorage.setItem('pendingOAuthFlow', flowType);
      sessionStorage.setItem('pendingOAuthFlow', flowType);
      
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/?userType=${userType}&flow=${flowType}`;
      console.log('OAuth redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            userType: userType,
            flow: flowType,
          },
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast({
        title: 'Ошибка входа',
        description: error.message || 'Не удалось войти через Google',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Email signup with user type:', userType);
      
      // Store user type for profile creation
      localStorage.setItem('pendingUserType', userType);
      sessionStorage.setItem('pendingUserType', userType);
      
      const baseUrl = window.location.origin;
      const redirectUrl = `${baseUrl}/?userType=${userType}&flow=registration`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: userType,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Регистрация успешна!',
        description: 'Проверьте email для подтверждения аккаунта.',
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: 'Ошибка регистрации',
        description: error.message || 'Произошла ошибка при регистрации',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: 'Вход выполнен успешно!',
        description: 'Добро пожаловать в TeacherConnect KG',
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: 'Ошибка входа',
        description: error.message || 'Неверный email или пароль',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });

      if (error) throw error;

      setResetEmailSent(true);
      toast({
        title: 'Письмо отправлено',
        description: 'Проверьте почту для сброса пароля',
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отправить письмо',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">TeacherConnect KG</CardTitle>
          <CardDescription>
            {authMode === 'forgot' 
              ? 'Восстановление пароля'
              : 'Платформа для поиска работы преподавателей в Кыргызстане'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {authMode === 'forgot' ? (
            <div className="space-y-4">
              {!resetEmailSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email адрес</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Mail className="mr-2 h-4 w-4" />
                    Отправить ссылку для сброса
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-green-600">
                    <Mail className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="font-semibold">Письмо отправлено!</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Проверьте почту {email} и перейдите по ссылке для сброса пароля
                    </p>
                  </div>
                </div>
              )}
              <Button 
                variant="outline" 
                onClick={() => setAuthMode('signin')} 
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться к входу
              </Button>
            </div>
          ) : (
            <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Вход</TabsTrigger>
                <TabsTrigger value="signup">Регистрация</TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                {/* User Type Selection for OAuth */}
                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <Label>Тип аккаунта</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value) => setUserType(value as 'teacher' | 'school')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher-auth" />
                        <Label htmlFor="teacher-auth">Преподаватель</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="school" id="school-auth" />
                        <Label htmlFor="school-auth">Школа</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Google OAuth Button */}
                <Button 
                  variant="outline" 
                  onClick={handleGoogleAuth} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  {authMode === 'signin' 
                    ? 'Войти через Google' 
                    : `Регистрация через Google как ${userType === 'teacher' ? 'учитель' : 'школа'}`
                  }
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Или используйте email
                    </span>
                  </div>
                </div>
              </div>

              <TabsContent value="signin" className="space-y-4 mt-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Пароль</Label>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={() => setAuthMode('forgot')}
                        className="px-0 font-normal text-sm"
                      >
                        Забыли пароль?
                      </Button>
                    </div>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Войти
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      {userType === 'teacher' ? 'Полное имя' : 'Название школы'}
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Пароль</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Зарегистрироваться как {userType === 'teacher' ? 'учитель' : 'школа'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
