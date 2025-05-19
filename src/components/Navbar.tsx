
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// Extracted components
import BrandLogo from './navbar/BrandLogo';
import DesktopNav from './navbar/DesktopNav';
import MobileNav from './navbar/MobileNav';
import UserMenuDesktop from './navbar/UserMenuDesktop';
import AuthButtons from './navbar/AuthButtons';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar: React.FC = () => {
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

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <BrandLogo />

        {/* Desktop Navigation */}
        <DesktopNav />

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <UserMenuDesktop 
              userData={userData} 
              userType={userType} 
              handleLogout={handleLogout} 
            />
          ) : (
            <AuthButtons />
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
      <MobileNav 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen} 
        isLoggedIn={isLoggedIn} 
        userType={userType} 
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Navbar;
