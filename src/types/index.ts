
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'school';
}

export interface Student {
  id: string;
  userId: string;
  name: string;
  grade: number;
  schoolId: string;
}

export interface Teacher {
  id: number;
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  location: string;
  ratings: number;
  views: number;
  about: string;
  education: string;
  languages: string[];
  achievements: string;
  preferredSchedule: string;
  desiredSalary: string;
  preferredDistricts: string[];
  applications: number;
}

export interface School {
  id: number;
  name: string;
  photo: string;
  address: string;
  type: string;
  specialization: string;
  openPositions: JobPosition[];
  ratings: number;
  views: number;
  housing: boolean;
  about: string;
  facilities: string[];
  applications: number;
}

export interface JobPosition {
  id: number;
  title: string;
  schedule: string;
  salary: string;
  requirements: string[];
  additionalInfo: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Lesson {
  id: string;
  name: string;
  subjectId: string;
  teacherId: string;
  description: string;
}

export interface Vacancy {
  id: string;
  schoolId: string;
  subjectId: string;
  description: string;
  requirements: string[];
  benefits: string[];
  salary: string;
  status: 'active' | 'closed';
}
