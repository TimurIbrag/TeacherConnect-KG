
import { Teacher, School, Vacancy } from './types';

// Remove all default teacher profiles - teachers data will only come from Supabase and localStorage now
export const teachersData: Teacher[] = [];

// Mock school data for testing vacancy display
export const schoolsData: School[] = [
  {
    id: 1751392391132,
    name: 'Образовательный Комплекс "Илим"',
    photo: '/placeholder.svg',
    address: 'г. Бишкек, ул. Токтоналиева 6 Б',
    type: 'Частная',
    specialization: 'Общеобразовательная',
    ratings: 4.5,
    views: 198,
    housing: false,
    about: 'Первая частная школа Кыргызстана с 1993 года.',
    facilities: ['Современные классы', 'Компьютерный класс', 'Спортивный зал', 'Столовая'],
    applications: 5,
    openPositions: [
      { 
        id: 1, 
        title: 'SAT', 
        schedule: 'Полный день', 
        salary: '20,000 - 25,000 сом',
        requirements: ['Высшее образование', 'Опыт работы от 2 лет'],
        additionalInfo: 'Требуется преподаватель для подготовки к экзамену SAT.'
      },
      { 
        id: 2, 
        title: 'English teacher (TOEFL)', 
        schedule: 'Полный день', 
        salary: '20,000 - 25,000 сом',
        requirements: ['Старше 21 года'],
        additionalInfo: 'Преподавание английского языка'
      }
    ],
    city: 'Бишкек'
  }
];

export const vacanciesData: Vacancy[] = [
  {
    id: '1',
    schoolId: '1751392391132',
    subjectId: 'SAT',
    description: 'Требуется преподаватель для подготовки к экзамену SAT.',
    requirements: ['Высшее образование', 'Опыт работы от 2 лет', 'Знание английского языка'],
    benefits: ['Официальное трудоустройство', 'Конкурентная зарплата'],
    salary: '20,000 - 25,000 сом',
    status: 'active'
  },
  {
    id: '2',
    schoolId: '1751392391132', 
    subjectId: 'English teacher (TOEFL)',
    description: 'Наша школа однаНаша школа однаНаша школа однаНаша школа однаНаша школа однаНаша школа однаНаша школа однаНаша школа одна',
    requirements: ['Старше 21 года'],
    benefits: ['3 Разовое питание'],
    salary: '20,000 - 25,000 сом',
    status: 'active'
  }
];
