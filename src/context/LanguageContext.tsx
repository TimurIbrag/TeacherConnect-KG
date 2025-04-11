
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available languages
export type LanguageType = 'kg' | 'ru' | 'en';

// Define context props
type LanguageContextProps = {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: string) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextProps>({
  language: 'ru',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Dictionary of translations
const translations: Record<LanguageType, Record<string, string>> = {
  kg: {
    // Navigation
    'nav.home': 'Башкы бет',
    'nav.teachers': 'Мугалимдер',
    'nav.schools': 'Мектептер',
    'nav.about': 'Биз жөнүндө',
    'nav.login': 'Кирүү',
    'nav.register': 'Катталуу',
    'nav.dashboard': 'Жеке кабинет',
    
    // Home page
    'home.title': 'TeacherConnect Кыргызстан',
    'home.subtitle': 'Мугалимдерди жана мектептерди бириктирүү платформасы',
    'home.cta.teacher': 'Мугалим катары баштоо',
    'home.cta.school': 'Мектеп катары баштоо',
    'home.description': 'Кыргызстандын билим берүү системасын жакшыртуу үчүн бирге аракеттенебиз',
    'home.feature.matching': 'Ылайыктуу вакансияларды табыңыз',
    'home.feature.profiles': 'Кесипкөй профилдерди түзүңүз',
    'home.feature.chat': 'Түз байланыш',
    'home.search.placeholder': 'Мугалим же мектеп издөө...',
    'home.search.button': 'Издөө',
    
    // Teachers section
    'teachers.title': 'Мугалимдерди табуу',
    'teachers.filter.subject': 'Предмет',
    'teachers.filter.experience': 'Тажрыйба',
    'teachers.filter.location': 'Жайгашкан жери',
    'teachers.viewProfile': 'Профилди көрүү',
    
    // Schools section
    'schools.title': 'Мектептерди табуу',
    'schools.filter.type': 'Мектептин түрү',
    'schools.filter.location': 'Жайгашкан жери',
    'schools.viewJobs': 'Вакансияларды көрүү',
    
    // Profile
    'profile.teacher.title': 'Мугалимдин профили',
    'profile.school.title': 'Мектептин профили',
    'profile.edit': 'Профилди өзгөртүү',
    'profile.contact': 'Байланышуу',
    'profile.experience': 'Тажрыйба',
    'profile.education': 'Билими',
    'profile.subjects': 'Предметтер',
    'profile.location': 'Жайгашкан жери',
    'profile.about': 'Өзү жөнүндө',
    
    // Auth
    'auth.login': 'Кирүү',
    'auth.register': 'Катталуу',
    'auth.email': 'Эл. почта',
    'auth.password': 'Сырсөз',
    'auth.name': 'Аты-жөнү',
    'auth.userType': 'Колдонуучу түрү',
    'auth.userType.teacher': 'Мугалим',
    'auth.userType.school': 'Мектеп',
    'auth.submit': 'Кирүү',
    'auth.register.submit': 'Катталуу',
    
    // Dashboard
    'dashboard.welcome': 'Кош келиниз!',
    'dashboard.editProfile': 'Профилди өзгөртүү',
    'dashboard.applications': 'Арыздар',
    'dashboard.messages': 'Кабарлар',
    'dashboard.matches': 'Дал келүүлөр',
    'dashboard.stats': 'Статистика',
    
    // Placeholders
    'placeholder.name': 'Аты-жөнү',
    'placeholder.email': 'Эл. почта',
    'placeholder.password': 'Сырсөз',
    'placeholder.subject': 'Предмет',
    'placeholder.experience': 'Тажрыйба',
    'placeholder.education': 'Билими',
    'placeholder.about': 'Өзүңүз жөнүндө',
    'placeholder.location': 'Жайгашкан жериңиз',
    
    // Buttons
    'button.save': 'Сактоо',
    'button.cancel': 'Жокко чыгаруу',
    'button.apply': 'Арыз берүү',
    'button.message': 'Кабар жөнөтүү',
    'button.search': 'Издөө',
    'button.filter': 'Чыпкалоо',
    'button.loadMore': 'Көбүрөөк жүктөө',

    // Switch Language
    'language.kg': 'Кыргызча',
    'language.ru': 'Орусча',
    'language.en': 'Англисче',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.teachers': 'Учителя',
    'nav.schools': 'Школы',
    'nav.about': 'О нас',
    'nav.login': 'Вход',
    'nav.register': 'Регистрация',
    'nav.dashboard': 'Личный кабинет',
    
    // Home page
    'home.title': 'TeacherConnect Кыргызстан',
    'home.subtitle': 'Платформа для соединения учителей и школ',
    'home.cta.teacher': 'Начать как учитель',
    'home.cta.school': 'Начать как школа',
    'home.description': 'Работаем вместе для улучшения образовательной системы Кыргызстана',
    'home.feature.matching': 'Находите подходящие вакансии',
    'home.feature.profiles': 'Создавайте профессиональные профили',
    'home.feature.chat': 'Прямое общение',
    'home.search.placeholder': 'Поиск учителя или школы...',
    'home.search.button': 'Поиск',
    
    // Teachers section
    'teachers.title': 'Найти учителей',
    'teachers.filter.subject': 'Предмет',
    'teachers.filter.experience': 'Опыт',
    'teachers.filter.location': 'Местоположение',
    'teachers.viewProfile': 'Просмотр профиля',
    
    // Schools section
    'schools.title': 'Найти школы',
    'schools.filter.type': 'Тип школы',
    'schools.filter.location': 'Местоположение',
    'schools.viewJobs': 'Просмотр вакансий',
    
    // Profile
    'profile.teacher.title': 'Профиль учителя',
    'profile.school.title': 'Профиль школы',
    'profile.edit': 'Редактировать профиль',
    'profile.contact': 'Связаться',
    'profile.experience': 'Опыт',
    'profile.education': 'Образование',
    'profile.subjects': 'Предметы',
    'profile.location': 'Местоположение',
    'profile.about': 'О себе',
    
    // Auth
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.email': 'Эл. почта',
    'auth.password': 'Пароль',
    'auth.name': 'Имя и фамилия',
    'auth.userType': 'Тип пользователя',
    'auth.userType.teacher': 'Учитель',
    'auth.userType.school': 'Школа',
    'auth.submit': 'Войти',
    'auth.register.submit': 'Зарегистрироваться',
    
    // Dashboard
    'dashboard.welcome': 'Добро пожаловать!',
    'dashboard.editProfile': 'Редактировать профиль',
    'dashboard.applications': 'Заявки',
    'dashboard.messages': 'Сообщения',
    'dashboard.matches': 'Совпадения',
    'dashboard.stats': 'Статистика',
    
    // Placeholders
    'placeholder.name': 'Имя и фамилия',
    'placeholder.email': 'Эл. почта',
    'placeholder.password': 'Пароль',
    'placeholder.subject': 'Предмет',
    'placeholder.experience': 'Опыт',
    'placeholder.education': 'Образование',
    'placeholder.about': 'О себе',
    'placeholder.location': 'Ваше местоположение',
    
    // Buttons
    'button.save': 'Сохранить',
    'button.cancel': 'Отмена',
    'button.apply': 'Подать заявку',
    'button.message': 'Отправить сообщение',
    'button.search': 'Поиск',
    'button.filter': 'Фильтровать',
    'button.loadMore': 'Загрузить еще',

    // Switch Language
    'language.kg': 'Кыргызский',
    'language.ru': 'Русский',
    'language.en': 'Английский',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.teachers': 'Teachers',
    'nav.schools': 'Schools',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    
    // Home page
    'home.title': 'TeacherConnect Kyrgyzstan',
    'home.subtitle': 'Connecting Teachers and Schools',
    'home.cta.teacher': 'Start as a Teacher',
    'home.cta.school': 'Start as a School',
    'home.description': 'Working together to improve Kyrgyzstan\'s education system',
    'home.feature.matching': 'Find matching opportunities',
    'home.feature.profiles': 'Create professional profiles',
    'home.feature.chat': 'Direct communication',
    'home.search.placeholder': 'Search for a teacher or school...',
    'home.search.button': 'Search',
    
    // Teachers section
    'teachers.title': 'Find Teachers',
    'teachers.filter.subject': 'Subject',
    'teachers.filter.experience': 'Experience',
    'teachers.filter.location': 'Location',
    'teachers.viewProfile': 'View Profile',
    
    // Schools section
    'schools.title': 'Find Schools',
    'schools.filter.type': 'School Type',
    'schools.filter.location': 'Location',
    'schools.viewJobs': 'View Jobs',
    
    // Profile
    'profile.teacher.title': 'Teacher Profile',
    'profile.school.title': 'School Profile',
    'profile.edit': 'Edit Profile',
    'profile.contact': 'Contact',
    'profile.experience': 'Experience',
    'profile.education': 'Education',
    'profile.subjects': 'Subjects',
    'profile.location': 'Location',
    'profile.about': 'About',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.userType': 'User Type',
    'auth.userType.teacher': 'Teacher',
    'auth.userType.school': 'School',
    'auth.submit': 'Sign In',
    'auth.register.submit': 'Sign Up',
    
    // Dashboard
    'dashboard.welcome': 'Welcome!',
    'dashboard.editProfile': 'Edit Profile',
    'dashboard.applications': 'Applications',
    'dashboard.messages': 'Messages',
    'dashboard.matches': 'Matches',
    'dashboard.stats': 'Statistics',
    
    // Placeholders
    'placeholder.name': 'Full Name',
    'placeholder.email': 'Email',
    'placeholder.password': 'Password',
    'placeholder.subject': 'Subject',
    'placeholder.experience': 'Experience',
    'placeholder.education': 'Education',
    'placeholder.about': 'About yourself',
    'placeholder.location': 'Your location',
    
    // Buttons
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.apply': 'Apply',
    'button.message': 'Send Message',
    'button.search': 'Search',
    'button.filter': 'Filter',
    'button.loadMore': 'Load More',

    // Switch Language
    'language.kg': 'Kyrgyz',
    'language.ru': 'Russian',
    'language.en': 'English',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with browser language or default to Russian
  const getBrowserLanguage = (): LanguageType => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ky') return 'kg';
    if (browserLang === 'ru') return 'ru';
    if (browserLang === 'en') return 'en';
    return 'ru'; // Default to Russian
  };

  // Get stored language preference or use browser default
  const getInitialLanguage = (): LanguageType => {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'kg' || storedLang === 'ru' || storedLang === 'en') {
      return storedLang;
    }
    return getBrowserLanguage();
  };

  const [language, setLanguageState] = useState<LanguageType>(getInitialLanguage);

  // Update language and store in localStorage
  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Set initial language on mount
  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'kg' || storedLang === 'ru' || storedLang === 'en') {
      setLanguageState(storedLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for easy access to the language context
export const useLanguage = () => useContext(LanguageContext);
