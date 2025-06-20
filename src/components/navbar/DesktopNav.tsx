import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const DesktopNav = () => {
  const { t } = useLanguage();

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link 
        to="/" 
        className="text-foreground hover:text-primary transition-colors"
      >
        {t('nav.home')}
      </Link>
      <Link 
        to="/teachers" 
        className="text-foreground hover:text-primary transition-colors"
      >
        {t('nav.teachers')}
      </Link>
      <Link 
        to="/schools" 
        className="text-foreground hover:text-primary transition-colors"
      >
        {t('nav.schools')}
      </Link>
      <Link 
        to="/vacancies" 
        className="text-foreground hover:text-primary transition-colors"
      >
        Вакансии
      </Link>
      <Link 
        to="/about" 
        className="text-foreground hover:text-primary transition-colors"
      >
        {t('nav.about')}
      </Link>
    </nav>
  );
};

export default DesktopNav;
