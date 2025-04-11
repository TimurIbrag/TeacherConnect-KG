
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Menu, X, HelpCircle, Info, Book, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">TeacherConnect</span>
            <span className="text-accent ml-1 font-semibold">KG</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            {t('nav.home')}
          </Link>
          <Link to="/teachers" className="text-sm font-medium hover:text-primary">
            {t('nav.teachers')}
          </Link>
          <Link to="/schools" className="text-sm font-medium hover:text-primary">
            {t('nav.schools')}
          </Link>
          <div className="relative group">
            <button className="text-sm font-medium hover:text-primary flex items-center gap-1">
              <Info className="h-4 w-4" />
              Информация
            </button>
            <div className="absolute z-50 top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-popover opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border">
              <div className="py-1 rounded-md">
                <Link 
                  to="/about" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  {t('nav.about')}
                </Link>
                <Link 
                  to="/faq" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  FAQ
                </Link>
                <Link 
                  to="/support" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  Поддержка
                </Link>
                <Link 
                  to="/privacy" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  Политика конфиденциальности
                </Link>
                <Link 
                  to="/terms" 
                  className="block px-4 py-2 text-sm hover:bg-muted"
                >
                  Условия использования
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">{t('nav.login')}</Button>
            </Link>
            <Link to="/register">
              <Button variant="default">{t('nav.register')}</Button>
            </Link>
          </div>
          <LanguageSwitcher />
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "fixed inset-x-0 top-16 z-50 bg-background border-b md:hidden transition-all duration-300 transform",
        mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <div className="container py-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.home')}
          </Link>
          <Link 
            to="/teachers" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.teachers')}
          </Link>
          <Link 
            to="/schools" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.schools')}
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.about')}
          </Link>
          <Link 
            to="/faq" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>
          <Link 
            to="/support" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
            onClick={() => setMobileMenuOpen(false)}
          >
            Поддержка
          </Link>
          <div className="flex flex-col gap-2 px-4 pt-2 border-t">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">{t('nav.login')}</Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="default" className="w-full">{t('nav.register')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
