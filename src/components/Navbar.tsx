
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
  MessageSquare,
  Home,
  Search,
  School,
  Heart
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
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      
      if (user) {
        setIsLoggedIn(true);
        try {
          const userData = JSON.parse(user);
          setUserData(userData);
          setUserType(userData.type);
        } catch (e) {
          console.error('Error parsing user data', e);
        }
      } else {
        setIsLoggedIn(false);
        setUserType(null);
        setUserData(null);
      }
    };
    
    checkLoginStatus();
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
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('logout'));
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
    
    navigate('/');
  };
  
  const getDashboardLink = () => {
    return userType === 'school' ? '/school-dashboard' : '/teacher-dashboard';
  };

  // Get initial for avatar
  const getUserInitial = () => {
    if (!userData || !userData.name) {
      return userType === 'school' ? 'SC' : 'TC';
    }
    return userData.name.charAt(0).toUpperCase();
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
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    {t('nav.home')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/teachers" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {t('nav.teachers')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/schools" className="flex items-center gap-1">
                    <School className="h-4 w-4" />
                    {t('nav.schools')}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  Информация
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4 md:w-[250px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          {t('nav.about')}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/faq" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          FAQ
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/support" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Поддержка
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/privacy" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Политика конфиденциальности
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/terms" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Условия использования
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

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

              <Button variant="ghost" size="icon" asChild>
                <Link to="/saved">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.photo || ""} alt="@user" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData?.name || (userType === 'school' ? 'Школа' : 'Учитель')}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email || 'user@example.com'}
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
                  <DropdownMenuItem asChild>
                    <Link to="/saved">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Избранное</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Сообщения</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Уведомления</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home className="h-4 w-4" />
            {t('nav.home')}
          </Link>
          <Link 
            to="/teachers" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User className="h-4 w-4" />
            {t('nav.teachers')}
          </Link>
          <Link 
            to="/schools" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <School className="h-4 w-4" />
            {t('nav.schools')}
          </Link>
          <Link 
            to="/about" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Info className="h-4 w-4" />
            {t('nav.about')}
          </Link>
          <Link 
            to="/faq" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HelpCircle className="h-4 w-4" />
            FAQ
          </Link>
          <Link 
            to="/support" 
            className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {userType === 'school' ? 'Панель школы' : 'Мой профиль'}
                </Link>
                <Link 
                  to="/messages" 
                  className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Сообщения
                </Link>
                <Link 
                  to="/notifications" 
                  className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell className="h-4 w-4" />
                  Уведомления
                </Link>
                <Link 
                  to="/saved" 
                  className="px-4 py-2 hover:bg-muted rounded-md text-sm font-medium flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
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
