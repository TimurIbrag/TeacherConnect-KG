
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  User, 
  School, 
  Info, 
  HelpCircle, 
  MessageSquare, 
  Bell, 
  Heart, 
  LogOut 
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isLoggedIn: boolean;
  userType: 'teacher' | 'school' | null;
  handleLogout: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  isOpen, 
  setIsOpen, 
  isLoggedIn, 
  userType, 
  handleLogout 
}) => {
  const { t } = useLanguage();

  const getDashboardLink = () => {
    return userType === 'school' ? '/school-dashboard' : '/teacher-dashboard';
  };

  return (
    <div className={cn(
      "fixed inset-x-0 top-16 z-50 bg-background border-b md:hidden transition-all duration-300 transform",
      isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      <div className="container py-4 flex flex-col space-y-4">
        <Link 
          to="/" 
          className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <Home className="h-4 w-4" />
          {t('nav.home')}
        </Link>
        <Link 
          to="/teachers" 
          className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <User className="h-4 w-4" />
          {t('nav.teachers')}
        </Link>
        <Link 
          to="/schools" 
          className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <School className="h-4 w-4" />
          {t('nav.schools')}
        </Link>
        <Link 
          to="/about" 
          className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <Info className="h-4 w-4" />
          {t('nav.about')}
        </Link>
        <Link 
          to="/faq" 
          className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <HelpCircle className="h-4 w-4" />
          FAQ
        </Link>
        <Link 
          to="/support" 
          className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <MessageSquare className="h-4 w-4" />
          Поддержка
        </Link>
        
        {isLoggedIn ? (
          <>
            <div className="border-t pt-2">
              <Link 
                to={getDashboardLink()} 
                className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                {userType === 'school' ? 'Панель школы' : 'Мой профиль'}
              </Link>
              <Link 
                to="/messages" 
                className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare className="h-4 w-4" />
                Сообщения
              </Link>
              <Link 
                to="/notifications" 
                className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Bell className="h-4 w-4" />
                Уведомления
              </Link>
              <Link 
                to="/saved" 
                className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Избранное
              </Link>
            </div>
            <Button 
              variant="outline" 
              className="mx-4 mt-2"
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2 px-4 pt-2 border-t">
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="w-full">{t('nav.login')}</Button>
            </Link>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button variant="default" className="w-full">{t('nav.register')}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
