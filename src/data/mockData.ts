import {
  Lesson,
  School,
  Student,
  Subject,
  Teacher,
  User,
  Vacancy,
} from "@/types";

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

// Mock data for schools
export const mockSchools: School[] = [
  {
    id: "school-1",
    name: "Example High School",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    phone: "555-123-4567",
    email: "info@examplehigh.com",
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
