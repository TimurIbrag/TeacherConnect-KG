
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const NotFoundPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">{t('error.notFound')}</h2>
        <p className="text-muted-foreground text-xl">
          {t('error.pageNotFound')}
        </p>
        <Button size="lg" asChild>
          <Link to="/">{t('nav.home')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
