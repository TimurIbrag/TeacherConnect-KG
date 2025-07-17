
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  School, 
  Search, 
  MessageSquare, 
  Star, 
  FileCheck,
  GraduationCap,
  MapPin,
  Globe
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('about.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('about.subtitle')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">{t('about.mission.title')}</h2>
          <p className="mb-4 text-muted-foreground">
            {t('about.mission.paragraph1')}
          </p>
          <p className="text-muted-foreground">
            {t('about.mission.paragraph2')}
          </p>
        </div>
        <div className="bg-muted rounded-lg flex items-center justify-center h-64">
          <div className="text-6xl text-primary">
            <School className="w-24 h-24 mx-auto" />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">{t('about.howItWorks.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 text-primary flex justify-center">
              <Users className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">{t('about.forTeachers.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('about.forTeachers.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forTeachers.feature1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forTeachers.feature2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forTeachers.feature3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forTeachers.feature4')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link to="/register?type=teacher">
                {t('home.cta.teacher')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 text-primary flex justify-center">
              <School className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">{t('about.forSchools.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('about.forSchools.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forSchools.feature1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forSchools.feature2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forSchools.feature3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.forSchools.feature4')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/register?type=school">
                {t('home.cta.school')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 text-primary flex justify-center">
              <Globe className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">{t('about.advantages.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('about.advantages.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.advantages.feature1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.advantages.feature2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.advantages.feature3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{t('about.advantages.feature4')}</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="secondary" asChild>
              <Link to="/faq">
                {t('about.learnMore')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-muted rounded-lg p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">{t('about.joinUs.title')}</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          {t('about.joinUs.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/register">
              {t('nav.register')}
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">
              {t('nav.login')}
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('about.faq.title')}</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('about.faq.question1')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('about.faq.answer1')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('about.faq.question2')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('about.faq.answer2')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('about.faq.question3')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {t('about.faq.answer3')}
              </p>
            </CardContent>
          </Card>
          <div className="text-center mt-8">
            <Button variant="link" asChild>
              <Link to="/faq">{t('about.faq.viewAll')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
