
import { Teacher, School, Vacancy } from './types';

export const teachersData: Teacher[] = [
  {
    id: 2,
    name: 'Елена Иванова',
    photo: '/placeholder.svg',
    specialization: 'Математика',
    experience: '8 лет опыта',
    location: 'Свердловский район',
    ratings: 4.8,
    views: 127,
    about: 'Опытный преподаватель математики с глубокими знаниями алгебры и геометрии. Помогаю ученикам понять сложные концепции через практические примеры.',
    education: 'КНУ им. Ж. Баласагына, факультет математики и информатики',
    languages: ['Кыргызский', 'Русский'],
    achievements: 'Лучший учитель года 2022, сертификат повышения квалификации по современным методикам преподавания',
    preferredSchedule: 'Полный день',
    desiredSalary: '22,000 - 28,000 сом',
    preferredDistricts: ['Свердловский район', 'Первомайский район'],
    applications: 15
  },
  {
    id: 3,
    name: 'Марат Султанов',
    photo: '/placeholder.svg',
    specialization: 'Физика',
    experience: '12 лет опыта',
    location: 'Октябрьский район',
    ratings: 4.9,
    views: 89,
    about: 'Преподаю физику с акцентом на практические эксперименты и реальные применения физических законов в жизни.',
    education: 'КРСУ, физический факультет',
    languages: ['Кыргызский', 'Русский', 'Английский'],
    achievements: 'Участник международных конференций по физике, автор научных статей',
    preferredSchedule: 'Полный день',
    desiredSalary: '25,000 - 32,000 сом',
    preferredDistricts: ['Октябрьский район', 'Ленинский район'],
    applications: 8
  },
  {
    id: 4,
    name: 'Гульнара Асанова',
    photo: '/placeholder.svg',
    specialization: 'Кыргызский язык',
    experience: '6 лет опыта',
    location: 'Ленинский район',
    ratings: 4.7,
    views: 156,
    about: 'Специалист по кыргызскому языку и литературе. Помогаю ученикам изучать родной язык и культуру.',
    education: 'КГУ им. И. Арабаева, филологический факультет',
    languages: ['Кыргызский', 'Русский'],
    achievements: 'Диплом за вклад в развитие кыргызского языка, сертификат методиста',
    preferredSchedule: 'Неполный день',
    desiredSalary: '18,000 - 24,000 сом',
    preferredDistricts: ['Ленинский район'],
    applications: 22
  },
  {
    id: 5,
    name: 'Дмитрий Петров',
    photo: '/placeholder.svg',
    specialization: 'История',
    experience: '10 лет опыта',
    location: 'Первомайский район',
    ratings: 4.6,
    views: 201,
    about: 'Преподаю историю Кыргызстана и всемирную историю. Использую интерактивные методы обучения.',
    education: 'КНУ им. Ж. Баласагына, исторический факультет',
    languages: ['Русский', 'Кыргызский', 'Английский'],
    achievements: 'Автор учебных пособий по истории, участник археологических экспедиций',
    preferredSchedule: 'Полный день',
    desiredSalary: '20,000 - 26,000 сом',
    preferredDistricts: ['Первомайский район', 'Свердловский район'],
    applications: 12
  },
  {
    id: 6,
    name: 'Алтынай Токтогулова',
    photo: '/placeholder.svg',
    specialization: 'Химия',
    experience: '4 года опыта',
    location: 'Свердловский район',
    ratings: 4.5,
    views: 78,
    about: 'Молодой и энергичный преподаватель химии. Делаю акцент на практических опытах и современных методах.',
    education: 'КРСУ, химический факультет',
    languages: ['Кыргызский', 'Русский'],
    achievements: 'Диплом с отличием, участник студенческих научных конференций',
    preferredSchedule: 'Неполный день',
    desiredSalary: '16,000 - 22,000 сом',
    preferredDistricts: ['Свердловский район'],
    applications: 6
  }
];

// Remove all default school profiles - schools data will only come from Supabase and localStorage now
export const schoolsData: School[] = [];

export const vacanciesData: Vacancy[] = [
  {
    id: '1',
    schoolId: '1',
    subjectId: 'math',
    description: 'Требуется опытный учитель математики для работы в старших классах.',
    requirements: ['Высшее педагогическое образование', 'Опыт работы от 3 лет', 'Знание современных методик'],
    benefits: ['Официальное трудоустройство', 'Соцпакет', 'Профессиональный рост'],
    salary: '25,000 - 30,000 сом',
    status: 'active'
  },
  {
    id: '2',
    schoolId: '2',
    subjectId: 'english',
    description: 'Ищем преподавателя английского языка с международными сертификатами.',
    requirements: ['Сертификат IELTS/TOEFL', 'Опыт работы от 2 лет', 'Коммуникативные навыки'],
    benefits: ['Гибкий график', 'Доплаты за сертификаты', 'Обучение за рубежом'],
    salary: '22,000 - 28,000 сом',
    status: 'active'
  },
  {
    id: '3',
    schoolId: '3',
    subjectId: 'physics',
    description: 'Требуется учитель физики для работы в средних и старших классах.',
    requirements: ['Высшее образование по специальности', 'Опыт работы желателен', 'Любовь к предмету'],
    benefits: ['Дружный коллектив', 'Современное оборудование', 'Повышение квалификации'],
    salary: '20,000 - 26,000 сом',
    status: 'active'
  }
];
