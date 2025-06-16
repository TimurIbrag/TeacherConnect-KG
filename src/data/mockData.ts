
import {
  Lesson,
  School,
  Student,
  Subject,
  Teacher,
  User,
  Vacancy,
} from "./types";

// Mock data for users
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "john.doe@example.com",
    name: "John Doe",
    role: "student",
  },
  {
    id: "user-2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    role: "teacher",
  },
  {
    id: "user-3",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
  },
];

// Mock data for students
export const mockStudents: Student[] = [
  {
    id: "student-1",
    userId: "user-1",
    name: "John Doe",
    grade: 10,
    schoolId: "school-1",
  },
];

// Mock data for teachers
export const mockTeachers: Teacher[] = [];

// Export teachersData for compatibility with existing pages
export const teachersData: Teacher[] = [
  {
    id: 2,
    name: "Анна Петрова",
    photo: "/placeholder.svg",
    specialization: "Математика",
    experience: "5 лет",
    location: "Ленинский район",
    ratings: 4.8,
    views: 234,
    about: "Опытный преподаватель математики с большим опытом работы в школе.",
    education: "Кыргызский национальный университет",
    languages: ["Кыргызский", "Русский"],
    achievements: "Победитель олимпиады по математике 2022",
    preferredSchedule: "Полный день",
    desiredSalary: "25,000 - 30,000 сом",
    preferredDistricts: ["Ленинский район"],
    applications: 15,
  },
  {
    id: 3,
    name: "Сергей Иванов",
    photo: "/placeholder.svg",
    specialization: "Физика",
    experience: "8 лет",
    location: "Октябрьский район",
    ratings: 4.9,
    views: 189,
    about: "Преподаватель физики с научной степенью.",
    education: "Московский государственный университет",
    languages: ["Русский", "Английский"],
    achievements: "Кандидат физико-математических наук",
    preferredSchedule: "Неполный день",
    desiredSalary: "30,000 - 35,000 сом",
    preferredDistricts: ["Октябрьский район", "Свердловский район"],
    applications: 8,
  },
];

// Export schoolsData for compatibility with existing pages
export const schoolsData: School[] = [
  {
    id: 1,
    name: "Гимназия №1",
    photo: "/placeholder.svg",
    address: "ул. Молодая Гвардия, 45, Бишкек",
    type: "Государственная",
    specialization: "Математический профиль",
    openPositions: [
      {
        id: 1,
        title: "Учитель математики",
        schedule: "Полный день",
        salary: "25,000 - 30,000 сом",
        requirements: ["Высшее образование", "Опыт работы от 2 лет"],
        additionalInfo: "Требуется знание современных методик преподавания",
      },
    ],
    ratings: 4.5,
    views: 156,
    housing: false,
    about: "Ведущая гимназия города с математическим уклоном.",
    facilities: ["Современные лаборатории", "Спортивный зал", "Библиотека"],
    applications: 23,
  },
  {
    id: 2,
    name: "Лицей №2",
    photo: "/placeholder.svg",
    address: "пр. Чуй, 112, Бишкек",
    type: "Частная",
    specialization: "Языковой профиль",
    openPositions: [
      {
        id: 2,
        title: "Учитель английского языка",
        schedule: "Неполный день",
        salary: "20,000 - 25,000 сом",
        requirements: ["Сертификат IELTS/TOEFL", "Опыт работы от 1 года"],
        additionalInfo: "Предпочтительно носители языка",
      },
    ],
    ratings: 4.7,
    views: 98,
    housing: true,
    about: "Частный лицей с углубленным изучением иностранных языков.",
    facilities: ["Языковая лаборатория", "Мультимедийные классы", "Кафетерий"],
    applications: 17,
  },
];

// Export school types and locations for filters
export const schoolTypes = ["Государственная", "Частная", "Муниципальная"];

export const locations = ["Ленинский район", "Первомайский район", "Октябрьский район", "Свердловский район"];

// Mock data for schools
export const mockSchools: School[] = [
  {
    id: 1,
    name: "Example High School",
    photo: "/placeholder.svg",
    address: "123 Main St",
    type: "Государственная",
    specialization: "Общеобразовательный",
    openPositions: [],
    ratings: 4.2,
    views: 45,
    housing: false,
    about: "Обычная средняя школа",
    facilities: ["Библиотека", "Спортзал"],
    applications: 5,
  },
];

// Mock data for subjects
export const mockSubjects: Subject[] = [
  {
    id: "subject-1",
    name: "Mathematics",
    description: "The study of numbers, quantities, and shapes.",
  },
  {
    id: "subject-2",
    name: "Science",
    description: "The study of the natural world.",
  },
  {
    id: "subject-3",
    name: "English",
    description: "The study of the English language and literature.",
  },
];

// Mock data for lessons
export const mockLessons: Lesson[] = [
  {
    id: "lesson-1",
    name: "Algebra Basics",
    subjectId: "subject-1",
    teacherId: "teacher-1",
    description: "An introductory lesson to algebra.",
  },
  {
    id: "lesson-2",
    name: "Cell Structure",
    subjectId: "subject-2",
    teacherId: "teacher-1",
    description: "A lesson on the structure of cells.",
  },
];

// Mock data for vacancies
export const mockVacancies: Vacancy[] = [
  {
    id: "vacancy-1",
    schoolId: "school-1",
    subjectId: "subject-1",
    description: "Math Teacher Needed",
    requirements: ["Bachelor's Degree", "Teaching Certificate"],
    benefits: ["Health Insurance", "Paid Time Off"],
    salary: "$50,000 - $60,000",
    status: "active",
  },
  {
    id: "vacancy-2",
    schoolId: "school-1",
    subjectId: "subject-2",
    description: "Science Teacher Position",
    requirements: ["Master's Degree", "5+ Years Experience"],
    benefits: ["Health Insurance", "Retirement Plan"],
    salary: "$60,000 - $70,000",
    status: "closed",
  },
];
