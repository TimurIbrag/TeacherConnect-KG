import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter 
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  // Use a static year to prevent hydration mismatch
  const currentYear = 2025;

  return (
    <footer className="bg-muted py-8 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{t('brand.name')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.slogan')}
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{t('nav.navigation')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/teachers" className="text-sm text-muted-foreground hover:text-primary">
                  {t('nav.teachers')}
                </Link>
              </li>
              <li>
                <Link to="/schools" className="text-sm text-muted-foreground hover:text-primary">
                  {t('nav.schools')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/school-catalog" className="text-sm text-muted-foreground hover:text-primary">
                  {t('footer.schoolCatalog')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{t('footer.information')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-primary">
                  {t('footer.support')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  {t('footer.termsOfUse')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">{t('footer.contacts')}</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('contact.email')}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('contact.phone')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('footer.address')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TeacherConnect Kyrgyzstan. {t('footer.allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
