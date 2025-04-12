
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  HelpCircle, 
  Info, 
  Book, 
  User, 
  LogOut,
  Bell,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null);
  
  // Check if user is logged in (this would use a real auth system in production)
  useEffect(() => {
    // This is a simulation - in a real app, we would check session/token
    const checkLoginStatus = () => {
      // Check if we have a user in localStorage (this is just for demo)
      const user = localStorage.getItem('user');
      
      if (user) {
        setIsLoggedIn(true);
        // Parse user type
        try {
          const userData = JSON.parse(user);
          setUserType(userData.type);
        } catch (e) {
          console.error('Error parsing user data', e);
        }
      } else {
        setIsLoggedIn(false);
        setUserType(null);
      }
    };
    
    checkLoginStatus();
    
    // Listen for login/logout events
    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('logout', checkLoginStatus);
    
    return () => {
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', checkLoginStatus);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    // Clear user from localStorage (in a real app, this would clear tokens and call an API)
    localStorage.removeItem('user');
    
    // Dispatch logout event
    window.dispatchEvent(new Event('logout'));
    
    // Show toast
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    
    // Navigate to homepage
    navigate('/');
  };
  
  const getDashboardLink = () => {
    return userType === 'school' ? '/school-dashboard' : '/teacher-dashboard';
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
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/messages">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="@user" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userType === 'school' ? 'SC' : 'TC'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userType === 'school' ? 'Школа-гимназия №5' : 'Иванов Иван'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        user@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{userType === 'school' ? 'Панель школы' : 'Мой профиль'}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">{t('nav.login')}</Button>
              </Link>
              <Link to="/register">
                <Button variant="default">{t('nav.register')}</Button>
              </Link>
            </div>
          )}
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
          
          {isLoggedIn ? (
            <>
              <Link 
                to={getDashboardLink()} 
                className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {userType === 'school' ? 'Панель школы' : 'Мой профиль'}
              </Link>
              <Button 
                variant="outline" 
                className="mx-4"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2 px-4 pt-2 border-t">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">{t('nav.login')}</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full">{t('nav.register')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
