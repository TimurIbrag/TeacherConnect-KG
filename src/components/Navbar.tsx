
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
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
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при выходе",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <BrandLogo />

        {/* Desktop Navigation */}
        <DesktopNav />

        <div className="flex items-center gap-3">
          {user ? (
            <UserMenuDesktop 
              userData={profile} 
              userType={profile?.role} 
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
        isLoggedIn={!!user} 
        userType={profile?.role} 
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default Navbar;
