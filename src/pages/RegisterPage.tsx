
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

// Refactored components
import RegisterForm from '@/components/auth/RegisterForm';
import RegisterSocialAuth from '@/components/auth/RegisterSocialAuth';
import RegisterFooter from '@/components/auth/RegisterFooter';

const RegisterPage: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
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
            <RegisterSocialAuth 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            
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

            <RegisterForm 
              isLoading={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <RegisterFooter />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
