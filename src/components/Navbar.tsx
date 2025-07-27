
import React, { useState, useEffect } from 'react';
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
  const { user, profile, signOut, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug authentication state
  useEffect(() => {
    console.log('🔍 Navbar auth state:', { 
      user: !!user, 
      profile: !!profile, 
      loading, 
      userEmail: user?.email,
      profileRole: profile?.role 
    });
  }, [user, profile, loading]);

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

  // Convert admin role to teacher for component compatibility
  const getCompatibleUserType = () => {
    if (!profile?.role) return null;
    return profile.role === 'admin' ? 'teacher' : profile.role as 'teacher' | 'school';
  };

  const compatibleUserType = getCompatibleUserType();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <BrandLogo />

        {/* Desktop Navigation */}
        <DesktopNav />

        <div className="flex items-center gap-3">
          {!loading && user ? (
            <UserMenuDesktop 
              userData={profile} 
              userType={compatibleUserType} 
              handleLogout={handleLogout} 
            />
          ) : !loading ? (
            <AuthButtons />
          ) : (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
      <MobileNav />
    </header>
  );
};

export default Navbar;
