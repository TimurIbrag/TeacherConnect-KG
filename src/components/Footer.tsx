
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-8 mt-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">TeacherConnect KG</h3>
            <p className="text-sm text-muted-foreground">
              Connecting teachers and schools across Kyrgyzstan.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Navigation</h3>
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
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-primary">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-bold">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: info@teacherconnect.kg
            </p>
            <p className="text-sm text-muted-foreground">
              Phone: +996 XXX XXX XXX
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TeacherConnect Kyrgyzstan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
