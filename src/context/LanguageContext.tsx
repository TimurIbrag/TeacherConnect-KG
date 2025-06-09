import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en' | 'ky';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Language names
    'language.ky': 'Кыргызча',
    'language.ru': 'Русский',
    'language.en': 'English',
    
    // Navigation
    'nav.home': 'Главная',
    'nav.teachers': 'Учителя',
    'nav.schools': 'Школы',
    'nav.vacancies': 'Вакансии',
    'nav.messages': 'Сообщения',
    'nav.profile': 'Профиль',
    'nav.dashboard': 'Панель управления',
    'nav.login': 'Войти',
    'nav.register': 'Регистрация',
    'nav.logout': 'Выйти',
    
    // Common
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.create': 'Создать',
    'common.search': 'Поиск',
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.close': 'Закрыть',
    'common.back': 'Назад',
    'common.next': 'Далее',
    'common.submit': 'Отправить',
    
    // Vacancy Management
    'vacancy.title': 'Название вакансии',
    'vacancy.description': 'Описание вакансии',
    'vacancy.subject': 'Предмет',
    'vacancy.location': 'Местоположение',
    'vacancy.salary': 'Зарплата',
    'vacancy.salaryFrom': 'Зарплата от',
    'vacancy.salaryTo': 'Зарплата до',
    'vacancy.employment': 'Тип занятости',
    'vacancy.experience': 'Требуемый опыт',
    'vacancy.deadline': 'Срок подачи заявок',
    'vacancy.requirements': 'Требования к кандидату',
    'vacancy.benefits': 'Преимущества работы',
    'vacancy.active': 'Активна',
    'vacancy.inactive': 'Неактивна',
    'vacancy.created': 'Вакансия создана',
    'vacancy.updated': 'Вакансия обновлена',
    'vacancy.deleted': 'Вакансия удалена',
    'vacancy.createNew': 'Новая вакансия',
    'vacancy.createFirst': 'Создать первую вакансию',
    'vacancy.noVacancies': 'У вас пока нет опубликованных вакансий',
    'vacancy.schoolVacancies': 'Вакансии школы',
    'vacancy.applications': 'Отклики',
    'vacancy.activate': 'Активировать',
    'vacancy.deactivate': 'Деактивировать',
    'vacancy.titleRequired': 'Название вакансии обязательно для заполнения',
    'vacancy.creating': 'Создание...',
    'vacancy.featureInDevelopment': 'Функция в разработке',
    'vacancy.editingFeature': 'Редактирование вакансий будет доступно в следующем обновлении',
    'vacancy.applicationsFeature': 'Просмотр откликов будет доступен в следующем обновлении',
    
    // Employment Types
    'employment.fullTime': 'Полная занятость',
    'employment.partTime': 'Частичная занятость',
    'employment.contract': 'Контракт',
    'employment.temporary': 'Временная работа',
    
    // Profile
    'profile.fullName': 'Полное имя',
    'profile.email': 'Email',
    'profile.phone': 'Телефон',
    'profile.bio': 'О себе',
    'profile.education': 'Образование',
    'profile.experience': 'Опыт работы',
    'profile.skills': 'Навыки',
    'profile.languages': 'Языки',
    'profile.photo': 'Фотография профиля',
    'profile.uploadPhoto': 'Загрузить фото',
    'profile.changePhoto': 'Изменить фото',
    'profile.removePhoto': 'Удалить фото',
    'profile.photoUploaded': 'Фотография загружена',
    'profile.photoRemoved': 'Фотография удалена',
    'profile.uploadError': 'Ошибка загрузки фотографии',
    
    // School Profile
    'school.name': 'Название школы',
    'school.address': 'Адрес',
    'school.description': 'Описание школы',
    'school.type': 'Тип школы',
    'school.studentCount': 'Количество учеников',
    'school.foundedYear': 'Год основания',
    'school.website': 'Веб-сайт',
    'school.facilities': 'Удобства',
    'school.housingProvided': 'Предоставляется жилье',
    
    // Authentication
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.loginWithGoogle': 'Войти через Google',
    'auth.registerWithGoogle': 'Зарегистрироваться через Google',
    'auth.password': 'Пароль',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.forgotPassword': 'Забыли пароль?',
    'auth.alreadyHaveAccount': 'Уже есть аккаунт?',
    'auth.dontHaveAccount': 'Нет аккаунта?',
    'auth.loginError': 'Ошибка входа',
    'auth.registerError': 'Ошибка регистрации',
    'auth.userType': 'Тип пользователя',
    'auth.teacher': 'Учитель',
    'auth.school': 'Школа',
    
    // Dashboard
    'dashboard.profile': 'Профиль',
    'dashboard.vacancies': 'Вакансии',
    'dashboard.applications': 'Заявки',
    'dashboard.teachers': 'Учителя',
    'dashboard.messages': 'Сообщения',
    'dashboard.settings': 'Настройки',
    
    // Maps & Address
    'address.searchPlaceholder': 'Введите адрес...',
    'address.selectLocation': 'Выберите местоположение на карте',
    'address.currentLocation': 'Текущее местоположение',
    'address.useCurrentLocation': 'Использовать текущее местоположение',
    'address.locationVerified': 'Местоположение подтверждено',
    'address.verifyLocation': 'Подтвердить местоположение',
    
    // Errors
    'error.general': 'Произошла ошибка. Попробуйте снова.',
    'error.network': 'Ошибка сети. Проверьте подключение к интернету.',
    'error.unauthorized': 'Доступ запрещен',
    'error.notFound': 'Страница не найдена',
    'error.validation': 'Ошибка валидации данных',
    'error.fileUpload': 'Ошибка загрузки файла',
    'error.fileTooLarge': 'Файл слишком большой',
    'error.invalidFileType': 'Недопустимый тип файла',
  },
  
  en: {
    // Language names
    'language.ky': 'Кыргызча',
    'language.ru': 'Русский',
    'language.en': 'English',
    
    // Navigation
    'nav.home': 'Home',
    'nav.teachers': 'Teachers',
    'nav.schools': 'Schools',
    'nav.vacancies': 'Vacancies',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.create': 'Create',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.submit': 'Submit',
    
    // Vacancy Management
    'vacancy.title': 'Vacancy Title',
    'vacancy.description': 'Job Description',
    'vacancy.subject': 'Subject',
    'vacancy.location': 'Location',
    'vacancy.salary': 'Salary',
    'vacancy.salaryFrom': 'Salary From',
    'vacancy.salaryTo': 'Salary To',
    'vacancy.employment': 'Employment Type',
    'vacancy.experience': 'Required Experience',
    'vacancy.deadline': 'Application Deadline',
    'vacancy.requirements': 'Requirements',
    'vacancy.benefits': 'Benefits',
    'vacancy.active': 'Active',
    'vacancy.inactive': 'Inactive',
    'vacancy.created': 'Vacancy Created',
    'vacancy.updated': 'Vacancy Updated',
    'vacancy.deleted': 'Vacancy Deleted',
    'vacancy.createNew': 'New Vacancy',
    'vacancy.createFirst': 'Create First Vacancy',
    'vacancy.noVacancies': 'You have no published vacancies yet',
    'vacancy.schoolVacancies': 'School Vacancies',
    'vacancy.applications': 'Applications',
    'vacancy.activate': 'Activate',
    'vacancy.deactivate': 'Deactivate',
    'vacancy.titleRequired': 'Vacancy title is required',
    'vacancy.creating': 'Creating...',
    'vacancy.featureInDevelopment': 'Feature in Development',
    'vacancy.editingFeature': 'Vacancy editing will be available in the next update',
    'vacancy.applicationsFeature': 'Applications view will be available in the next update',
    
    // Employment Types
    'employment.fullTime': 'Full Time',
    'employment.partTime': 'Part Time',
    'employment.contract': 'Contract',
    'employment.temporary': 'Temporary',
    
    // Profile
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.bio': 'About',
    'profile.education': 'Education',
    'profile.experience': 'Experience',
    'profile.skills': 'Skills',
    'profile.languages': 'Languages',
    'profile.photo': 'Profile Photo',
    'profile.uploadPhoto': 'Upload Photo',
    'profile.changePhoto': 'Change Photo',
    'profile.removePhoto': 'Remove Photo',
    'profile.photoUploaded': 'Photo Uploaded',
    'profile.photoRemoved': 'Photo Removed',
    'profile.uploadError': 'Photo Upload Error',
    
    // School Profile
    'school.name': 'School Name',
    'school.address': 'Address',
    'school.description': 'School Description',
    'school.type': 'School Type',
    'school.studentCount': 'Student Count',
    'school.foundedYear': 'Founded Year',
    'school.website': 'Website',
    'school.facilities': 'Facilities',
    'school.housingProvided': 'Housing Provided',
    
    // Authentication
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.loginWithGoogle': 'Login with Google',
    'auth.registerWithGoogle': 'Register with Google',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    'auth.loginError': 'Login Error',
    'auth.registerError': 'Registration Error',
    'auth.userType': 'User Type',
    'auth.teacher': 'Teacher',
    'auth.school': 'School',
    
    // Dashboard
    'dashboard.profile': 'Profile',
    'dashboard.vacancies': 'Vacancies',
    'dashboard.applications': 'Applications',
    'dashboard.teachers': 'Teachers',
    'dashboard.messages': 'Messages',
    'dashboard.settings': 'Settings',
    
    // Maps & Address
    'address.searchPlaceholder': 'Enter address...',
    'address.selectLocation': 'Select location on map',
    'address.currentLocation': 'Current Location',
    'address.useCurrentLocation': 'Use Current Location',
    'address.locationVerified': 'Location Verified',
    'address.verifyLocation': 'Verify Location',
    
    // Errors
    'error.general': 'An error occurred. Please try again.',
    'error.network': 'Network error. Check your internet connection.',
    'error.unauthorized': 'Access denied',
    'error.notFound': 'Page not found',
    'error.validation': 'Data validation error',
    'error.fileUpload': 'File upload error',
    'error.fileTooLarge': 'File too large',
    'error.invalidFileType': 'Invalid file type',
  },
  
  ky: {
    // Language names
    'language.ky': 'Кыргызча',
    'language.ru': 'Русский',
    'language.en': 'English',
    
    // Navigation
    'nav.home': 'Башкы бет',
    'nav.teachers': 'Мугалимдер',
    'nav.schools': 'Мектептер',
    'nav.vacancies': 'Жумуш орундары',
    'nav.messages': 'Билдирүүлөр',
    'nav.profile': 'Профиль',
    'nav.dashboard': 'Башкаруу панели',
    'nav.login': 'Кирүү',
    'nav.register': 'Катталуу',
    'nav.logout': 'Чыгуу',
    
    // Common
    'common.save': 'Сактоо',
    'common.cancel': 'Жокко чыгаруу',
    'common.delete': 'Өчүрүү',
    'common.edit': 'Өзгөртүү',
    'common.create': 'Түзүү',
    'common.search': 'Издөө',
    'common.loading': 'Жүктөлүүдө...',
    'common.error': 'Ката',
    'common.success': 'Ийгиликтүү',
    'common.yes': 'Ооба',
    'common.no': 'Жок',
    'common.close': 'Жабуу',
    'common.back': 'Артка',
    'common.next': 'Кийинки',
    'common.submit': 'Жөнөтүү',
    
    // Vacancy Management
    'vacancy.title': 'Вакансиянын аталышы',
    'vacancy.description': 'Жумуштун сыпаттамасы',
    'vacancy.subject': 'Предмет',
    'vacancy.location': 'Жайгашкан жери',
    'vacancy.salary': 'Айлык акы',
    'vacancy.salaryFrom': 'Айлык акы башынан',
    'vacancy.salaryTo': 'Айлык акы чейин',
    'vacancy.employment': 'Жумуш түрү',
    'vacancy.experience': 'Талап кылынган тажрыйба',
    'vacancy.deadline': 'Арыз берүү мөөнөтү',
    'vacancy.requirements': 'Талаптар',
    'vacancy.benefits': 'Артыкчылыктар',
    'vacancy.active': 'Активдүү',
    'vacancy.inactive': 'Активдүү эмес',
    'vacancy.created': 'Вакансия түзүлдү',
    'vacancy.updated': 'Вакансия жаңыртылды',
    'vacancy.deleted': 'Вакансия өчүрүлдү',
    'vacancy.createNew': 'Жаңы вакансия',
    'vacancy.createFirst': 'Биринчи вакансияны түзүү',
    'vacancy.noVacancies': 'Сизде азырынча жарыяланган вакансиялар жок',
    'vacancy.schoolVacancies': 'Мектептин вакансиялары',
    'vacancy.applications': 'Арыздар',
    'vacancy.activate': 'Активдештирүү',
    'vacancy.deactivate': 'Активдештирбөө',
    'vacancy.titleRequired': 'Вакансиянын аталышы милдеттүү',
    'vacancy.creating': 'Түзүлүүдө...',
    'vacancy.featureInDevelopment': 'Функция иштелип жатат',
    'vacancy.editingFeature': 'Вакансияларды өзгөртүү кийинки жаңыртууда жеткиликтүү болот',
    'vacancy.applicationsFeature': 'Арыздарды көрүү кийинки жаңыртууда жеткиликтүү болот',
    
    // Employment Types
    'employment.fullTime': 'Толук жумуш күнү',
    'employment.partTime': 'Жарым жумуш күнү',
    'employment.contract': 'Контракт',
    'employment.temporary': 'Убактылуу жумуш',
    
    // Profile
    'profile.fullName': 'Толук аты',
    'profile.email': 'Электрондук почта',
    'profile.phone': 'Телефон',
    'profile.bio': 'Өзү жөнүндө',
    'profile.education': 'Билими',
    'profile.experience': 'Тажрыйбасы',
    'profile.skills': 'Көндүмдөрү',
    'profile.languages': 'Тилдери',
    'profile.photo': 'Профиль сүрөтү',
    'profile.uploadPhoto': 'Сүрөт жүктөө',
    'profile.changePhoto': 'Сүрөт өзгөртүү',
    'profile.removePhoto': 'Сүрөт өчүрүү',
    'profile.photoUploaded': 'Сүрөт жүктөлдү',
    'profile.photoRemoved': 'Сүрөт өчүрүлдү',
    'profile.uploadError': 'Сүрөт жүктөө катасы',
    
    // School Profile
    'school.name': 'Мектептин аталышы',
    'school.address': 'Дареги',
    'school.description': 'Мектептин сыпаттамасы',
    'school.type': 'Мектептин түрү',
    'school.studentCount': 'Окуучулардын саны',
    'school.foundedYear': 'Түзүлгөн жылы',
    'school.website': 'Веб-сайт',
    'school.facilities': 'Шарттар',
    'school.housingProvided': 'Турак жай берилет',
    
    // Authentication
    'auth.login': 'Кирүү',
    'auth.register': 'Катталуу',
    'auth.loginWithGoogle': 'Google аркылуу кирүү',
    'auth.registerWithGoogle': 'Google аркылуу катталуу',
    'auth.password': 'Сыр сөз',
    'auth.confirmPassword': 'Сыр сөздү ырастоо',
    'auth.forgotPassword': 'Сыр сөздү унуттуңузбу?',
    'auth.alreadyHaveAccount': 'Аккаунтуңуз барбы?',
    'auth.dontHaveAccount': 'Аккаунтуңуз жокпу?',
    'auth.loginError': 'Кирүү катасы',
    'auth.registerError': 'Катталуу катасы',
    'auth.userType': 'Колдонуучу түрү',
    'auth.teacher': 'Мугалим',
    'auth.school': 'Мектеп',
    
    // Dashboard
    'dashboard.profile': 'Профиль',
    'dashboard.vacancies': 'Вакансиялар',
    'dashboard.applications': 'Арыздар',
    'dashboard.teachers': 'Мугалимдер',
    'dashboard.messages': 'Билдирүүлөр',
    'dashboard.settings': 'Параметрлер',
    
    // Maps & Address
    'address.searchPlaceholder': 'Даректи киргизиңиз...',
    'address.selectLocation': 'Картадан жерди тандаңыз',
    'address.currentLocation': 'Учурдагы жер',
    'address.useCurrentLocation': 'Учурдагы жерди колдонуу',
    'address.locationVerified': 'Жер ырасталды',
    'address.verifyLocation': 'Жерди ырастоо',
    
    // Errors
    'error.general': 'Ката кетти. Кайра аракет кылыңыз.',
    'error.network': 'Тармак катасы. Интернет байланышыңызды текшериңиз.',
    'error.unauthorized': 'Кирүүгө тыюу салынган',
    'error.notFound': 'Бет табылган жок',
    'error.validation': 'Маалыматтарды текшерүү катасы',
    'error.fileUpload': 'Файл жүктөө катасы',
    'error.fileTooLarge': 'Файл өтө чоң',
    'error.invalidFileType': 'Жараксыз файл түрү',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
