
import { Teacher, School, Vacancy } from './types';

// Remove all default teacher profiles - teachers data will only come from Supabase and localStorage now
export const teachersData: Teacher[] = [];

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
