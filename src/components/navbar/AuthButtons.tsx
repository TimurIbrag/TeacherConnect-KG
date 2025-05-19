
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const AuthButtons: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="hidden md:flex items-center gap-3">
      <Link to="/login">
        <Button variant="ghost">{t('nav.login')}</Button>
      </Link>
      <Link to="/register">
        <Button variant="default">{t('nav.register')}</Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
