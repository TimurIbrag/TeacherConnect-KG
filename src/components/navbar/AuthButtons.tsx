
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const AuthButtons: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="hidden md:flex items-center gap-3">
      <Link to="/login">
        <Button variant="ghost" className="flex items-center gap-1">
          <LogIn className="h-4 w-4" />
          {t('nav.login')}
        </Button>
      </Link>
      <Link to="/register">
        <Button variant="default" className="flex items-center gap-1">
          <UserPlus className="h-4 w-4" />
          {t('nav.register')}
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
