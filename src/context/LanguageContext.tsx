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
    'nav.about': 'О нас',
    
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
    'auth.email': 'Email',
    'auth.submit': 'Войти',
    'auth.register.submit': 'Зарегистрироваться',
    'auth.loggingIn': 'Вход...',
    'auth.registering': 'Регистрация...',
    'auth.loginDescription': 'Войдите в аккаунт для доступа к платформе',
    'auth.orLoginWithEmail': 'Или войдите через email',
    
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
    'error.pageNotFound': 'Извините, но запрашиваемая страница не существует.',
    'error.validation': 'Ошибка валидации данных',
    'error.fileUpload': 'Ошибка загрузки файла',
    'error.fileTooLarge': 'Файл слишком большой',
    'error.invalidFileType': 'Недопустимый тип файла',
    
    // CTA Section
    'cta.title': 'Присоединяйтесь к TeacherConnect!',
    'cta.subtitle': 'Создайте профиль или найдите работу в образовании',
    'teachers.header': 'Преподаватели и услуги',
    'teachers.subheader': 'Найдите квалифицированных преподавателей и их услуги',
    'teachers.tab': 'Преподаватели',
    'teachers.servicesTab': 'Услуги',
    'teachers.searchPlaceholder': 'Поиск по имени или специализации...',
    'teachers.servicesSearchPlaceholder': 'Поиск услуг...',
    'teachers.subjectPlaceholder': 'Предмет',
    'teachers.locationPlaceholder': 'Местоположение',
    'common.reset': 'Сбросить',
    'teachers.foundCount': 'Найдено {{count}} преподавателей',
    'teachers.servicesFoundCount': 'Найдено {{count}} услуг',
    'teachers.notFound': 'Преподаватели не найдены',
    'teachers.tryChangeSearch': 'Попробуйте изменить параметры поиска или опубликуйте свой профиль',
    'teachers.servicesNotFound': 'Услуги не найдены',
    
    // Home Page
    'home.hero.title': 'Найдите свою идеальную работу в образовании',
    'home.hero.subtitle': 'Платформа, которая соединяет талантливых преподавателей с лучшими образовательными учреждениями по всей стране',
    'home.hero.findTeachers': 'Найти преподавателей',
    'home.hero.findVacancies': 'Поиск вакансий',
    'home.stats.teachers': 'Квалифицированных преподавателей',
    'home.stats.schools': 'Образовательных учреждений',
    'home.stats.vacancies': 'Активных вакансий',
    'home.vacancies.title': 'Актуальные вакансии',
    'home.vacancies.subtitle': 'Свежие предложения от ведущих образовательных учреждений',
    'home.vacancies.viewAllVacancies': 'Посмотреть все вакансии',
    'home.teachers.title': 'Опытные преподаватели',
    'home.teachers.subtitle': 'Знакомьтесь с нашими талантливыми преподавателями',
    'home.teachers.viewAllTeachers': 'Посмотреть всех преподавателей',
    'home.schools.title': 'Ведущие образовательные учреждения',
    'home.schools.subtitle': 'Школы и учебные заведения, которые ищут талантливых преподавателей',
    'home.schools.viewAllSchools': 'Посмотреть все школы',
    
    // Vacancy
    'vacancy.negotiable': 'По договоренности',
    'vacancy.from': 'от',
    'vacancy.upTo': 'до',
    'vacancy.notSpecified': 'Не указана',
    'vacancy.locationNotSpecified': 'Местоположение не указано',
    
    // Currency
    'currency.som': 'с',
    
    // Teacher
    'teacher.nameNotSpecified': 'Имя не указано',
    'teacher.yearsOfExperience': 'лет опыта',
    
    // School
    'school.students': 'учеников',
    
    // CTA
    'cta.addVacancy': 'Добавить вакансию',
    'cta.findJob': 'Найти работу',
    
    // Common
    'common.more': 'Подробнее',
    
    // FAQ
    'faq.title': 'Часто задаваемые вопросы',
    'faq.subtitle': 'Ответы на популярные вопросы о платформе',
    'faq.frequentlyAsked': 'Часто задаваемые вопросы',
    'faq.createProfile.question': 'Как создать профиль?',
    'faq.createProfile.answer': 'Для создания профиля необходимо зарегистрироваться, затем заполнить все необходимые поля в личном кабинете. Учителя указывают свою специализацию, опыт работы, образование и предпочтения по работе. Школы заполняют информацию о своём учебном заведении.',
    'faq.findSchool.question': 'Как найти подходящую школу?',
    'faq.findSchool.answer': 'Используйте фильтры на странице "Школы", чтобы найти учебное заведение по местоположению, специализации и другим параметрам. Вы можете просматривать профили школ и их открытые вакансии.',
    'faq.applyVacancy.question': 'Как откликнуться на вакансию?',
    'faq.applyVacancy.answer': 'На странице вакансии нажмите на кнопку "Откликнуться". Школа получит уведомление о вашем отклике и сможет просмотреть ваш профиль. После этого с вами могут связаться для дальнейшего обсуждения.',
    'faq.contactSupport.question': 'Что делать, если нет ответа на отклик?',
    'faq.contactSupport.answer': 'Если школа не отвечает на ваш отклик в течение недели, вы можете отправить повторное сообщение через систему чата на платформе. Также рекомендуем продолжать поиск и откликаться на другие интересующие вас вакансии.',
    'faq.profileVisibility.question': 'Как удалить свой аккаунт?',
    'faq.profileVisibility.answer': 'Для удаления аккаунта перейдите в настройки профиля, выберите раздел "Удаление аккаунта" и следуйте инструкциям. Обратите внимание, что это действие необратимо, и все ваши данные будут удалены из системы.',
    'faq.safety.question': 'Могу ли я изменить тип аккаунта?',
    'faq.safety.answer': 'Нет, тип аккаунта (учитель или школа) выбирается при регистрации и не может быть изменен. Если вам необходимо сменить тип аккаунта, придется создать новую учетную запись.',
    
    // Support
    'support.title': 'Поддержка',
    'support.subtitle': 'Мы здесь, чтобы помочь вам с любыми вопросами',
    'support.contactForm': 'Форма обратной связи',
    'support.contactFormDescription': 'Заполните форму, и мы свяжемся с вами в ближайшее время',
    'support.name': 'Ваше имя',
    'support.namePlaceholder': 'Введите ваше имя',
    'support.email': 'Email',
    'support.emailPlaceholder': 'your@email.com',
    'support.subject': 'Тема',
    'support.subjectPlaceholder': 'Кратко опишите проблему',
    'support.message': 'Сообщение',
    'support.messagePlaceholder': 'Подробно опишите ваш вопрос или проблему',
    'support.sendMessage': 'Отправить сообщение',
    'support.sending': 'Отправка...',
    'support.messageSent': 'Сообщение отправлено',
    'support.responseTime': 'Мы ответим вам в ближайшее время',
    'support.contactInfo': 'Контактная информация',
    'support.contactInfoDescription': 'Свяжитесь с нами любым удобным способом',
    'support.emailSupport': 'Email поддержка',
    'support.liveChat': 'Онлайн чат',
    'support.liveChatDescription': 'Рабочие часы: 9:00 - 18:00 (Пн-Пт)',
    'support.documentation': 'Документация',
    'support.documentationDescription': 'Полезные статьи и руководства',
    'support.viewDocs': 'Посмотреть документацию',
    'support.commonIssues': 'Частые вопросы',
    'support.howToRegister': 'Как зарегистрироваться?',
    'support.howToCreateProfile': 'Как создать профиль?',
    'support.howToApply': 'Как откликнуться на вакансию?',
    'support.accountIssues': 'Проблемы с аккаунтом',
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
    'nav.about': 'About',
    
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
    'auth.email': 'Email',
    'auth.submit': 'Login',
    'auth.register.submit': 'Register',
    'auth.loggingIn': 'Logging in...',
    'auth.registering': 'Registering...',
    'auth.loginDescription': 'Sign in to your account to access the platform',
    'auth.orLoginWithEmail': 'Or sign in with email',
    
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
    'error.pageNotFound': 'Sorry, but the requested page does not exist.',
    'error.validation': 'Data validation error',
    'error.fileUpload': 'File upload error',
    'error.fileTooLarge': 'File too large',
    'error.invalidFileType': 'Invalid file type',
    
    // CTA Section
    'cta.title': 'Присоединяйтесь к TeacherConnect!',
    'cta.subtitle': 'Создайте профиль или найдите работу в образовании',
    'teachers.header': 'Teachers and Services',
    'teachers.subheader': 'Find qualified teachers and their services',
    'teachers.tab': 'Teachers',
    'teachers.servicesTab': 'Services',
    'teachers.searchPlaceholder': 'Search by name or specialization...',
    'teachers.servicesSearchPlaceholder': 'Search services...',
    'teachers.subjectPlaceholder': 'Subject',
    'teachers.locationPlaceholder': 'Location',
    'common.reset': 'Reset',
    'teachers.foundCount': '{{count}} teachers found',
    'teachers.servicesFoundCount': '{{count}} services found',
    'teachers.notFound': 'No teachers found',
    'teachers.tryChangeSearch': 'Try changing your search or publish your profile',
    'teachers.servicesNotFound': 'No services found',
    
    // Home Page
    'home.hero.title': 'Find Your Ideal Job in Education',
    'home.hero.subtitle': 'A platform that connects talented teachers with the best educational institutions across the country',
    'home.hero.findTeachers': 'Find Teachers',
    'home.hero.findVacancies': 'Search Vacancies',
    'home.stats.teachers': 'Qualified Teachers',
    'home.stats.schools': 'Educational Institutions',
    'home.stats.vacancies': 'Active Vacancies',
    'home.vacancies.title': 'Current Vacancies',
    'home.vacancies.subtitle': 'Fresh offers from leading educational institutions',
    'home.vacancies.viewAllVacancies': 'View All Vacancies',
    'home.teachers.title': 'Experienced Teachers',
    'home.teachers.subtitle': 'Meet our talented teachers',
    'home.teachers.viewAllTeachers': 'View All Teachers',
    'home.schools.title': 'Leading Educational Institutions',
    'home.schools.subtitle': 'Schools and educational institutions looking for talented teachers',
    'home.schools.viewAllSchools': 'View All Schools',
    
    // Vacancy
    'vacancy.negotiable': 'Negotiable',
    'vacancy.from': 'from',
    'vacancy.upTo': 'up to',
    'vacancy.notSpecified': 'Not specified',
    'vacancy.locationNotSpecified': 'Location not specified',
    
    // Currency
    'currency.som': 'som',
    
    // Teacher
    'teacher.nameNotSpecified': 'Name not specified',
    'teacher.yearsOfExperience': 'years of experience',
    
    // School
    'school.students': 'students',
    
    // CTA
    'cta.addVacancy': 'Add Vacancy',
    'cta.findJob': 'Find Job',
    
    // Common
    'common.more': 'More',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.subtitle': 'Answers to popular questions about the platform',
    'faq.frequentlyAsked': 'Frequently Asked Questions',
    'faq.createProfile.question': 'How to create a profile?',
    'faq.createProfile.answer': 'To create a profile, you need to register, then fill in all the required fields in your personal account. Teachers indicate their specialization, work experience, education and work preferences. Schools fill in information about their educational institution.',
    'faq.findSchool.question': 'How to find a suitable school?',
    'faq.findSchool.answer': 'Use filters on the "Schools" page to find an educational institution by location, specialization and other parameters. You can view school profiles and their open vacancies.',
    'faq.applyVacancy.question': 'How to apply for a vacancy?',
    'faq.applyVacancy.answer': 'On the vacancy page, click the "Apply" button. The school will receive a notification about your application and will be able to view your profile. After that, they may contact you for further discussion.',
    'faq.contactSupport.question': 'What to do if there is no response to the application?',
    'faq.contactSupport.answer': 'If the school does not respond to your application within a week, you can send a repeat message through the chat system on the platform. We also recommend continuing your search and applying for other vacancies that interest you.',
    'faq.profileVisibility.question': 'How to delete my account?',
    'faq.profileVisibility.answer': 'To delete an account, go to profile settings, select the "Delete Account" section and follow the instructions. Please note that this action is irreversible and all your data will be deleted from the system.',
    'faq.safety.question': 'Can I change my account type?',
    'faq.safety.answer': 'No, the account type (teacher or school) is chosen during registration and cannot be changed. If you need to change your account type, you will have to create a new account.',
    
    // Support
    'support.title': 'Support',
    'support.subtitle': 'We are here to help you with any questions',
    'support.contactForm': 'Contact Form',
    'support.contactFormDescription': 'Fill out the form and we will contact you soon',
    'support.name': 'Your Name',
    'support.namePlaceholder': 'Enter your name',
    'support.email': 'Email',
    'support.emailPlaceholder': 'your@email.com',
    'support.subject': 'Subject',
    'support.subjectPlaceholder': 'Briefly describe the issue',
    'support.message': 'Message',
    'support.messagePlaceholder': 'Describe your question or problem in detail',
    'support.sendMessage': 'Send Message',
    'support.sending': 'Sending...',
    'support.messageSent': 'Message Sent',
    'support.responseTime': 'We will respond to you soon',
    'support.contactInfo': 'Contact Information',
    'support.contactInfoDescription': 'Contact us in any convenient way',
    'support.emailSupport': 'Email Support',
    'support.liveChat': 'Live Chat',
    'support.liveChatDescription': 'Working hours: 9:00 - 18:00 (Mon-Fri)',
    'support.documentation': 'Documentation',
    'support.documentationDescription': 'Useful articles and guides',
    'support.viewDocs': 'View Documentation',
    'support.commonIssues': 'Common Issues',
    'support.howToRegister': 'How to register?',
    'support.howToCreateProfile': 'How to create a profile?',
    'support.howToApply': 'How to apply for a vacancy?',
    'support.accountIssues': 'Account issues',
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
    'nav.about': 'Биз жөнүндө',
    
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
    'auth.email': 'Электрондук почта',
    'auth.submit': 'Кирүү',
    'auth.register.submit': 'Катталуу',
    'auth.loggingIn': 'Кирүүдө...',
    'auth.registering': 'Катталууда...',
    'auth.loginDescription': 'Платформага кирүү үчүн аккаунтуңузга кириңиз',
    'auth.orLoginWithEmail': 'Же электрондук почта аркылуу кириңиз',
    
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
    'error.pageNotFound': 'Кечиресиз, суралган бет жок.',
    'error.validation': 'Маалыматтарды текшерүү катасы',
    'error.fileUpload': 'Файл жүктөө катасы',
    'error.fileTooLarge': 'Файл өтө чоң',
    'error.invalidFileType': 'Жараксыз файл түрү',
    
    // CTA Section
    'cta.title': 'Присоединяйтесь к TeacherConnect!',
    'cta.subtitle': 'Создайте профиль или найдите работу в образовании',
    'teachers.header': 'Мугалимдер жана кызматтар',
    'teachers.subheader': 'Квалификациялуу мугалимдерди жана алардын кызматтарын табыңыз',
    'teachers.tab': 'Мугалимдер',
    'teachers.servicesTab': 'Кызматтар',
    'teachers.searchPlaceholder': 'Аты же адистиги боюнча издөө...',
    'teachers.servicesSearchPlaceholder': 'Кызматтарды издөө...',
    'teachers.subjectPlaceholder': 'Предмет',
    'teachers.locationPlaceholder': 'Жайгашкан жери',
    'common.reset': 'Тазалоо',
    'teachers.foundCount': '{{count}} мугалим табылды',
    'teachers.servicesFoundCount': '{{count}} кызмат табылды',
    'teachers.notFound': 'Мугалимдер табылган жок',
    'teachers.tryChangeSearch': 'Издөө параметрлерин өзгөртүп көрүңүз же профилиңизди жарыялаңыз',
    'teachers.servicesNotFound': 'Кызматтар табылган жок',
    
    // Home Page
    'home.hero.title': 'Билим берүүдө идеалдуу жумушуңузду табыңыз',
    'home.hero.subtitle': 'Жөндөмдүү мугалимдерди өлкө боюнча эң жакшы билим берүү мекемелери менен байланыштырган платформа',
    'home.hero.findTeachers': 'Мугалимдерди табуу',
    'home.hero.findVacancies': 'Вакансияларды издөө',
    'home.stats.teachers': 'Квалификациялуу мугалимдер',
    'home.stats.schools': 'Билим берүү мекемелери',
    'home.stats.vacancies': 'Активдүү вакансиялар',
    'home.vacancies.title': 'Учурдагы вакансиялар',
    'home.vacancies.subtitle': 'Жетекчи билим берүү мекемелеринен жаңы сунуштар',
    'home.vacancies.viewAllVacancies': 'Бардык вакансияларды көрүү',
    'home.teachers.title': 'Тажрыйбалуу мугалимдер',
    'home.teachers.subtitle': 'Биздин жөндөмдүү мугалимдерди таанышыңыз',
    'home.teachers.viewAllTeachers': 'Бардык мугалимдерди көрүү',
    'home.schools.title': 'Жетекчи билим берүү мекемелери',
    'home.schools.subtitle': 'Жөндөмдүү мугалимдерди издеген мектептер жана билим берүү мекемелери',
    'home.schools.viewAllSchools': 'Бардык мектептерди көрүү',
    
    // Vacancy
    'vacancy.negotiable': 'Келишим боюнча',
    'vacancy.from': 'башынан',
    'vacancy.upTo': 'чейин',
    'vacancy.notSpecified': 'Көрсөтүлгөн эмес',
    'vacancy.locationNotSpecified': 'Жайгашкан жери көрсөтүлгөн эмес',
    
    // Currency
    'currency.som': 'сом',
    
    // Teacher
    'teacher.nameNotSpecified': 'Аты көрсөтүлгөн эмес',
    'teacher.yearsOfExperience': 'жылдык тажрыйба',
    
    // School
    'school.students': 'окуучу',
    
    // CTA
    'cta.addVacancy': 'Вакансия кошуу',
    'cta.findJob': 'Жумуш табуу',
    
    // Common
    'common.more': 'Көбүрөөк',
    
    // FAQ
    'faq.title': 'Көп берилүүчү суроолор',
    'faq.subtitle': 'Платформа жөнүндө көп берилүүчү суроолорго жооптор',
    'faq.frequentlyAsked': 'Көп берилүүчү суроолор',
    'faq.createProfile.question': 'Профильди кантип түзүү керек?',
    'faq.createProfile.answer': 'Профиль түзүү үчүн катталуу керек, андан кийин жеке кабинетте бардык керектүү талааларды толтуруу керек. Мугалимдер өздөрүнүн адистигин, жумуш тажрыйбасын, билимин жана жумуш боюнча артыкчылыктарын көрсөтүшөт. Мектептер өздөрүнүн билим берүү мекемеси жөнүндө маалыматты толтурушат.',
    'faq.findSchool.question': 'Ылайыктуу мектепти кантип табуу керек?',
    'faq.findSchool.answer': '"Мектептер" бетинин фильтрлерин колдонуу менен жайгашкан жери, адистиги жана башка параметрлер боюнча билим берүү мекемесин таба аласыз. Мектептердин профилдерин жана алардын ачык вакансияларын көрө аласыз.',
    'faq.applyVacancy.question': 'Вакансияга кантип арыз берүү керек?',
    'faq.applyVacancy.answer': 'Вакансия бетине "Арыз берүү" баскычын басыңыз. Мектеп сиздин арызыңыз жөнүндө билдирүү алат жана сиздин профилиңизди көрө алат. Андан кийин алар сиз менен коңшулаш маек үчүн байланыша алышат.',
    'faq.contactSupport.question': 'Арызга жооп келбесе эмне кылуу керек?',
    'faq.contactSupport.answer': 'Эгер мектеп бир жума ичинде сиздин арызыңызга жооп бербесе, платформадагы чат системасы аркылуу кайталап билдирүү жөнөтө аласыз. Ошондой эле издөөнү улантууну жана сизди кызыктырган башка вакансияларга арыз берүүнү сунуштайбыз.',
    'faq.profileVisibility.question': 'Аккаунтумду кантип өчүрүү керек?',
    'faq.profileVisibility.answer': 'Аккаунтту өчүрүү үчүн профиль параметрлерине барып, "Аккаунтту өчүрүү" бөлүмүн тандап, көрсөтмөлөрдү аткарыңыз. Бул аракет кайталангыс экенин жана бардык маалыматтарыңыз системадан өчүрүлөрүн эске алыңыз.',
    'faq.safety.question': 'Аккаунт түрүмдү өзгөртө аламбы?',
    'faq.safety.answer': 'Жок, аккаунт түрү (мугалим же мектеп) катталуу учурунда тандалат жана өзгөртүлө албайт. Эгер сизге аккаунт түрүн өзгөртүү керек болсо, жаңы эсеп түзүү керек болот.',
    
    // Support
    'support.title': 'Колдоо',
    'support.subtitle': 'Биз сизге каалаган суроолордо жардам берүүгө дайынбыз',
    'support.contactForm': 'Байланыш формасы',
    'support.contactFormDescription': 'Форманы толтуруңуз, биз сиз менен жакында байланышабыз',
    'support.name': 'Сиздин атыңыз',
    'support.namePlaceholder': 'Атыңызды киргизиңиз',
    'support.email': 'Электрондук почта',
    'support.emailPlaceholder': 'your@email.com',
    'support.subject': 'Тема',
    'support.subjectPlaceholder': 'Маселени кыскача сүрөттөңүз',
    'support.message': 'Билдирүү',
    'support.messagePlaceholder': 'Сурооңузду же маселениңизди толук сүрөттөңүз',
    'support.sendMessage': 'Билдирүү жөнөтүү',
    'support.sending': 'Жөнөтүлүүдө...',
    'support.messageSent': 'Билдирүү жөнөтүлдү',
    'support.responseTime': 'Биз сизге жакында жооп беребиз',
    'support.contactInfo': 'Байланыш маалыматы',
    'support.contactInfoDescription': 'Биз менен ыңгайлуу жол менен байланышыңыз',
    'support.emailSupport': 'Электрондук почта колдоосу',
    'support.liveChat': 'Тирүү чат',
    'support.liveChatDescription': 'Жумуш убактысы: 9:00 - 18:00 (Дш-Жм)',
    'support.documentation': 'Документация',
    'support.documentationDescription': 'Пайдалуу макалалар жана көрсөтмөлөр',
    'support.viewDocs': 'Документацияны көрүү',
    'support.commonIssues': 'Көп берилүүчү маселелер',
    'support.howToRegister': 'Кантип катталуу керек?',
    'support.howToCreateProfile': 'Профильди кантип түзүү керек?',
    'support.howToApply': 'Вакансияга кантип арыз берүү керек?',
    'support.accountIssues': 'Аккаунт маселелери',
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
