import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 rounded-md hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px]">
          <nav className="flex flex-col space-y-4 mt-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              to="/teachers" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.teachers')}
            </Link>
            <Link 
              to="/schools" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.schools')}
            </Link>
            <Link 
              to="/vacancies" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.vacancies')}
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {t('nav.about')}
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
