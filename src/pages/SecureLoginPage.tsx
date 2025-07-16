
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Separator } from '@/components/ui/separator';

// Auth Components
import AuthContainer from '@/components/auth/AuthContainer';
import SecureLoginForm from '@/components/auth/SecureLoginForm';
import SecureGoogleLoginButton from '@/components/auth/SecureGoogleLoginButton';

const SecureLoginPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <AuthContainer
      title={t('auth.login')}
      description={t('auth.loginDescription')}
      footerText={t('auth.dontHaveAccount')}
      footerLinkText={t('nav.register')}
      footerLinkPath="/register"
    >
      <div className="grid gap-4">
        <SecureGoogleLoginButton isLoading={false} />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-backgroun px-2 text-muted-foreground">
              {t('auth.orLoginWithEmail')}
            </span>
          </div>
        </div>
        
        <SecureLoginForm />
      </div>
    </AuthContainer>
  );
};

export default SecureLoginPage;
