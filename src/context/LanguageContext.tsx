
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

// Define language type as one of the three supported languages
export type LanguageType = 'ru' | 'kg' | 'en';

// Define the context shape
interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  t: (key: string) => string;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextProps>({
  language: 'ru',
  setLanguage: () => {},
  t: () => ''
});

// Define translations for all three languages
const translations = {
  ru: {
    'nav.home': 'Главная',
    'nav.teachers': 'Учителя',
    'nav.schools': 'Школы',
    'nav.about': 'О нас',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.profile': 'Профиль',
    'nav.logout': 'Выйти',
    
    'home.title': 'Соединяем учителей и школы в Кыргызстане',
    'home.subtitle': 'Платформа для поиска работы учителям и подходящих кандидатов для образовательных учреждений',
    'home.description': 'Наша платформа помогает учителям и школам найти друг друга',
    'home.cta.teacher': 'Я учитель',
    'home.cta.school': 'Я представитель школы',
    'home.search.placeholder': 'Поиск учителей или школ...',
    'home.search.button': 'Найти',
    'home.feature.matching': 'Умный подбор',
    'home.feature.profiles': 'Профессиональные профили',
    'home.feature.chat': 'Прямое общение',
    
    'auth.login': 'Вход в аккаунт',
    'auth.register': 'Создать аккаунт',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.submit': 'Войти',
    'auth.register.submit': 'Зарегистрироваться',
    'auth.userType': 'Тип пользователя',
    'auth.userType.teacher': 'Учитель',
    'auth.userType.school': 'Школа',
    'auth.userType.guest': 'Гость',
    'auth.name': 'Ваше имя',
    
    'teachers.title': 'Учителя',
    'schools.title': 'Школы',
    'button.loadMore': 'Показать больше',
    
    'language.ru': 'Русский',
    'language.kg': 'Кыргызский',
    'language.en': 'English',

    'dashboard.profile': 'Профиль',
    'dashboard.vacancies': 'Вакансии',
    'dashboard.applications': 'Отклики',
    'dashboard.messages': 'Сообщения',
    'dashboard.saved': 'Избранное',
    'dashboard.notifications': 'Уведомления',

    'profile.photo': 'Фото профиля',
    'profile.update': 'Обновить',
    'profile.save': 'Сохранить',
    'profile.cancel': 'Отмена',
    'profile.saveSuccess': 'Профиль успешно сохранен',
  },
  kg: {
    'nav.home': 'Башкы бет',
    'nav.teachers': 'Мугалимдер',
    'nav.schools': 'Мектептер',
    'nav.about': 'Биз жөнүндө',
    'nav.login': 'Кирүү',
    'nav.register': 'Катталуу',
    'nav.profile': 'Профиль',
    'nav.logout': 'Чыгуу',
    
    'home.title': 'Кыргызстанда мугалимдерди жана мектептерди бириктиребиз',
    'home.subtitle': 'Мугалимдер үчүн жумуш жана билим берүү мекемелери үчүн ылайыктуу талапкерлерди издөө платформасы',
    'home.description': 'Биздин платформа мугалимдер менен мектептерге бири-бирин табууга жардам берет',
    'home.cta.teacher': 'Мен мугалиммин',
    'home.cta.school': 'Мен мектеп өкүлүмүн',
    'home.search.placeholder': 'Мугалимдерди же мектептерди издөө...',
    'home.search.button': 'Издөө',
    'home.feature.matching': 'Акылдуу шайкештик',
    'home.feature.profiles': 'Кесиптик профилдер',
    'home.feature.chat': 'Түз байланыш',
    
    'auth.login': 'Аккаунтка кирүү',
    'auth.register': 'Аккаунт түзүү',
    'auth.email': 'Email',
    'auth.password': 'Сырсөз',
    'auth.confirmPassword': 'Сырсөздү ырастаңыз',
    'auth.submit': 'Кирүү',
    'auth.register.submit': 'Катталуу',
    'auth.userType': 'Колдонуучу түрү',
    'auth.userType.teacher': 'Мугалим',
    'auth.userType.school': 'Мектеп',
    'auth.userType.guest': 'Конок',
    'auth.name': 'Атыңыз',
    
    'teachers.title': 'Мугалимдер',
    'schools.title': 'Мектептер',
    'button.loadMore': 'Көбүрөөк көрсөтүү',
    
    'language.ru': 'Русский',
    'language.kg': 'Кыргызча',
    'language.en': 'English',

    'dashboard.profile': 'Профиль',
    'dashboard.vacancies': 'Бош орундар',
    'dashboard.applications': 'Арыздар',
    'dashboard.messages': 'Билдирүүлөр',
    'dashboard.saved': 'Тандалмалар',
    'dashboard.notifications': 'Билдирмелер',

    'profile.photo': 'Профиль сүрөтү',
    'profile.update': 'Жаңыртуу',
    'profile.save': 'Сактоо',
    'profile.cancel': 'Жокко чыгаруу',
    'profile.saveSuccess': 'Профиль ийгиликтүү сакталды',
  },
  en: {
    'nav.home': 'Home',
    'nav.teachers': 'Teachers',
    'nav.schools': 'Schools',
    'nav.about': 'About',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    'home.title': 'Connecting Teachers and Schools in Kyrgyzstan',
    'home.subtitle': 'A platform for teachers to find jobs and educational institutions to find suitable candidates',
    'home.description': 'Our platform helps teachers and schools find each other',
    'home.cta.teacher': 'I am a Teacher',
    'home.cta.school': 'I represent a School',
    'home.search.placeholder': 'Search for teachers or schools...',
    'home.search.button': 'Search',
    'home.feature.matching': 'Smart Matching',
    'home.feature.profiles': 'Professional Profiles',
    'home.feature.chat': 'Direct Communication',
    
    'auth.login': 'Log In',
    'auth.register': 'Create Account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.submit': 'Submit',
    'auth.register.submit': 'Register',
    'auth.userType': 'User Type',
    'auth.userType.teacher': 'Teacher',
    'auth.userType.school': 'School',
    'auth.userType.guest': 'Guest',
    'auth.name': 'Your Name',
    
    'teachers.title': 'Teachers',
    'schools.title': 'Schools',
    'button.loadMore': 'Load More',
    
    'language.ru': 'Русский',
    'language.kg': 'Кыргызча',
    'language.en': 'English',

    'dashboard.profile': 'Profile',
    'dashboard.vacancies': 'Vacancies',
    'dashboard.applications': 'Applications',
    'dashboard.messages': 'Messages',
    'dashboard.saved': 'Saved',
    'dashboard.notifications': 'Notifications',

    'profile.photo': 'Profile Photo',
    'profile.update': 'Update',
    'profile.save': 'Save',
    'profile.cancel': 'Cancel',
    'profile.saveSuccess': 'Profile saved successfully',
  }
};

// Define props for LanguageProvider
interface LanguageProviderProps {
  children: ReactNode;
}

// Create provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>(() => {
    // Try to get the language from localStorage
    const storedLanguage = localStorage.getItem('language') as LanguageType;
    if (storedLanguage && ['ru', 'kg', 'en'].includes(storedLanguage)) {
      return storedLanguage;
    }
    
    // Try to detect from browser
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage === 'ru') return 'ru';
    if (browserLanguage === 'ky') return 'kg'; // 'ky' is the ISO code for Kyrgyz
    if (browserLanguage === 'en') return 'en';
    
    // Default to Russian
    return 'ru';
  });
  
  // Function to set language and save to localStorage
  const setLanguage = (newLanguage: LanguageType) => {
    localStorage.setItem('language', newLanguage);
    setLanguageState(newLanguage);
  };
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };
  
  // Effects
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = () => useContext(LanguageContext);
