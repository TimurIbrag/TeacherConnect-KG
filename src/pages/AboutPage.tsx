
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
        <h1 className="text-3xl md:text-4xl font-bold mb-4">О проекте</h1>
        <p className="text-xl text-muted-foreground">
          TeacherConnect Кыргызстан - платформа для соединения учителей и школ по всей стране
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
          <p className="mb-4 text-muted-foreground">
            Мы создали TeacherConnect KG, чтобы решить проблему нехватки квалифицированных педагогов в школах Кыргызстана. 
            Наша платформа делает процесс поиска работы или сотрудников простым, прозрачным и эффективным.
          </p>
          <p className="text-muted-foreground">
            Мы стремимся улучшить систему образования в стране, обеспечивая школы талантливыми педагогами, 
            а учителям помогая найти работу, соответствующую их навыкам и предпочтениям.
          </p>
        </div>
        <div className="bg-muted rounded-lg flex items-center justify-center h-64">
          <div className="text-6xl text-primary">
            <School className="w-24 h-24 mx-auto" />
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Как это работает</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 text-primary flex justify-center">
              <Users className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">Для учителей</CardTitle>
            <CardDescription className="text-center">
              Найдите работу своей мечты
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Создайте профессиональное портфолио</span>
              </li>
              <li className="flex items-start gap-2">
                <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Просматривайте актуальные вакансии</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Общайтесь напрямую со школами</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Фильтруйте по местоположению и условиям</span>
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
            <CardTitle className="text-center">Для школ</CardTitle>
            <CardDescription className="text-center">
              Найдите идеальных кандидатов
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Создайте профиль школы и вакансии</span>
              </li>
              <li className="flex items-start gap-2">
                <Search className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Просматривайте анкеты учителей</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Оценивайте кандидатов</span>
              </li>
              <li className="flex items-start gap-2">
                <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Находите специалистов по предметам</span>
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
            <CardTitle className="text-center">Преимущества</CardTitle>
            <CardDescription className="text-center">
              Почему выбирают нас
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Проверенные анкеты и профили</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Интерфейс на трех языках</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Прямое общение без посредников</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Фокус на региональных потребностях</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="secondary" asChild>
              <Link to="/faq">
                Узнать больше
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-muted rounded-lg p-8 text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Присоединяйтесь к нам сегодня!</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Вместе мы можем улучшить систему образования Кыргызстана, соединяя талантливых учителей 
          с нуждающимися в них школами. Зарегистрируйтесь сейчас и начните свой путь к успеху!
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
        <h2 className="text-2xl font-bold mb-6 text-center">Частые вопросы</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Это бесплатно?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Да, базовое использование платформы бесплатно как для учителей, так и для школ. 
                В будущем мы планируем добавить премиум-функции, но основные возможности останутся бесплатными.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Как подтверждаются профили?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Мы используем систему проверки документов и верификации данных. После загрузки
                необходимых документов (дипломы, сертификаты) профиль получает статус "Проверенный".
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Можно ли использовать платформу на мобильном телефоне?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Да, наш сайт полностью адаптирован для мобильных устройств. Вы можете пользоваться
                всеми функциями с любого устройства с доступом в интернет.
              </p>
            </CardContent>
          </Card>
          <div className="text-center mt-8">
            <Button variant="link" asChild>
              <Link to="/faq">Смотреть все вопросы</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
