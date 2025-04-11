
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, School, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { teachersData, schoolsData } from '@/data/mockData';
import TeacherCard from '@/components/TeacherCard';
import SchoolCard from '@/components/SchoolCard';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  
  // Get a few featured teachers and schools
  const featuredTeachers = teachersData.slice(0, 3);
  const featuredSchools = schoolsData.slice(0, 2);
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center space-y-6 max-w-3xl mx-auto slide-in-bottom">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            {t('home.title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link to="/register?type=teacher">
                {t('home.cta.teacher')}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/register?type=school">
                {t('home.cta.school')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-8 my-4">
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input 
                type="text" 
                placeholder={t('home.search.placeholder')} 
                className="md:flex-1"
              />
              <Button>
                <Search className="w-4 h-4 mr-2" />
                {t('home.search.button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-10">
          {t('home.description')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 slide-in-bottom" style={{ animationDelay: '0.1s' }}>
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{t('home.feature.matching')}</h3>
            <p className="text-muted-foreground">
              Ищите учителей и школы, соответствующие вашим требованиям, с помощью удобной системы фильтров
            </p>
          </div>
          
          <div className="text-center space-y-3 slide-in-bottom" style={{ animationDelay: '0.2s' }}>
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{t('home.feature.profiles')}</h3>
            <p className="text-muted-foreground">
              Создайте подробный профиль с указанием опыта, достижений и предпочтений для лучшего соответствия
            </p>
          </div>
          
          <div className="text-center space-y-3 slide-in-bottom" style={{ animationDelay: '0.3s' }}>
            <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">{t('home.feature.chat')}</h3>
            <p className="text-muted-foreground">
              Общайтесь напрямую с потенциальными работодателями или кандидатами через встроенный чат
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Teachers Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('teachers.title')}</h2>
          <Link to="/teachers">
            <Button variant="ghost">{t('button.loadMore')}</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              id={teacher.id}
              name={teacher.name}
              photo={teacher.photo}
              specialization={teacher.specialization}
              experience={teacher.experience}
              location={teacher.location}
              ratings={teacher.ratings}
              views={teacher.views}
            />
          ))}
        </div>
      </section>
      
      {/* Featured Schools Section */}
      <section className="py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('schools.title')}</h2>
          <Link to="/schools">
            <Button variant="ghost">{t('button.loadMore')}</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredSchools.map((school) => (
            <SchoolCard
              key={school.id}
              id={school.id}
              name={school.name}
              photo={school.photo}
              address={school.address}
              type={school.type}
              specialization={school.specialization}
              openPositions={school.openPositions}
              ratings={school.ratings}
              views={school.views}
              housing={school.housing}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
