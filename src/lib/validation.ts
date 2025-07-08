import { z } from 'zod';

// Base validation schemas
export const emailSchema = z.string().email('Неверный формат email').min(1, 'Email обязателен');
export const passwordSchema = z.string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать строчные, заглавные буквы и цифры');

export const phoneSchema = z.string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Неверный формат телефона')
  .optional();

// Flexible website URL validation that accepts various formats
export const websiteUrlSchema = z.string()
  .transform((val) => {
    // Remove leading/trailing whitespace
    val = val.trim();
    
    // If empty, return empty string
    if (!val) return '';
    
    // If it doesn't start with http:// or https://, add https://
    if (!val.match(/^https?:\/\//)) {
      val = 'https://' + val;
    }
    
    return val;
  })
  .pipe(z.string().url('Неверный формат URL').optional())
  .optional();

// Profile validation schemas
export const profileUpdateSchema = z.object({
  full_name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .regex(/^[a-zA-Zа-яА-Я\s]+$/, 'Имя может содержать только буквы и пробелы'),
  phone: phoneSchema,
  avatar_url: z.string().url('Неверный URL аватара').optional(),
});

export const teacherProfileSchema = z.object({
  bio: z.string()
    .max(1000, 'Описание слишком длинное')
    .optional(),
  specialization: z.string()
    .max(100, 'Специализация слишком длинная')
    .optional(),
  experience_years: z.number()
    .min(0, 'Опыт не может быть отрицательным')
    .max(50, 'Неверное количество лет опыта')
    .optional(),
  education: z.string()
    .max(500, 'Образование слишком длинное')
    .optional(),
  location: z.string()
    .max(100, 'Местоположение слишком длинное')
    .optional(),
  languages: z.array(z.string().max(50)).max(10, 'Слишком много языков').optional(),
  skills: z.array(z.string().max(50)).max(20, 'Слишком много навыков').optional(),
});

export const schoolProfileSchema = z.object({
  school_name: z.string()
    .min(2, 'Название школы должно содержать минимум 2 символа')
    .max(200, 'Название школы слишком длинное'),
  description: z.string()
    .max(2000, 'Описание слишком длинное')
    .optional(),
  address: z.string()
    .max(200, 'Адрес слишком длинный')
    .optional(),
  website_url: websiteUrlSchema,
  founded_year: z.number()
    .min(1800, 'Неверный год основания')
    .max(new Date().getFullYear(), 'Год основания не может быть в будущем')
    .optional(),
  student_count: z.number()
    .min(1, 'Количество студентов должно быть положительным')
    .max(50000, 'Слишком большое количество студентов')
    .optional(),
});

// Vacancy validation schemas
export const vacancySchema = z.object({
  title: z.string()
    .min(5, 'Название должно содержать минимум 5 символов')
    .max(150, 'Название слишком длинное'),
  subject: z.string()
    .min(1, 'Укажите предмет или специализацию')
    .max(100, 'Предмет слишком длинный'),
  employment_type: z.enum(['full-time', 'part-time', 'online', 'flexible'], {
    errorMap: () => ({ message: 'Выберите график работы' }),
  }),
  location: z.string()
    .min(1, 'Укажите город или локацию')
    .max(100, 'Местоположение слишком длинное'),
  salary_min: z.number()
    .min(0, 'Минимальная зарплата не может быть отрицательной')
    .optional(),
  salary_max: z.number()
    .min(0, 'Максимальная зарплата не может быть отрицательной')
    .optional(),
  salary_currency: z.enum(['rub', 'usd']).default('rub'),
  description: z.string()
    .min(50, 'Описание должно содержать минимум 50 символов')
    .max(2000, 'Описание слишком длинное'),
  contact_name: z.string()
    .min(2, 'Имя контактного лица обязательно')
    .max(100, 'Имя слишком длинное'),
  contact_phone: phoneSchema.refine(val => val && val.length > 0, {
    message: 'Телефон обязателен'
  }),
  contact_email: emailSchema,
  experience_required: z.number()
    .min(0, 'Требуемый опыт не может быть отрицательным')
    .max(50, 'Неверное количество лет опыта')
    .optional(),
  requirements: z.array(z.string().max(200)).max(20, 'Слишком много требований').optional(),
  benefits: z.array(z.string().max(200)).max(20, 'Слишком много льгот').optional(),
}).refine(data => {
  if (data.salary_min && data.salary_max) {
    return data.salary_min <= data.salary_max;
  }
  return true;
}, {
  message: 'Минимальная зарплата не может быть больше максимальной',
  path: ['salary_max'],
});

export const teacherVacancySchema = z.object({
  title: z.string()
    .min(5, 'Название должно содержать минимум 5 символов')
    .max(150, 'Название слишком длинное'),
  description: z.string()
    .max(1000, 'Описание слишком длинное')
    .optional(),
  subject: z.string()
    .max(100, 'Предмет слишком длинный')
    .optional(),
  location: z.string()
    .max(100, 'Местоположение слишком длинное')
    .optional(),
  hourly_rate: z.number()
    .min(0, 'Почасовая ставка не может быть отрицательной')
    .max(10000, 'Слишком высокая почасовая ставка')
    .optional(),
  group_rate: z.number()
    .min(0, 'Групповая ставка не может быть отрицательной')
    .max(50000, 'Слишком высокая групповая ставка')
    .optional(),
  experience_required: z.number()
    .min(0, 'Требуемый опыт не может быть отрицательным')
    .max(50, 'Неверное количество лет опыта')
    .optional(),
  availability: z.array(z.string().max(50)).max(7, 'Слишком много дней доступности').optional(),
  languages: z.array(z.string().max(50)).max(10, 'Слишком много языков').optional(),
});

// Message validation schemas
export const messageSchema = z.object({
  content: z.string()
    .min(1, 'Сообщение не может быть пустым')
    .max(2000, 'Сообщение слишком длинное'),
  subject: z.string()
    .max(200, 'Тема слишком длинная')
    .optional(),
  recipient_id: z.string().uuid('Неверный ID получателя'),
});

// Application validation schemas
export const applicationSchema = z.object({
  cover_letter: z.string()
    .max(1000, 'Сопроводительное письмо слишком длинное')
    .optional(),
  vacancy_id: z.string().uuid('Неверный ID вакансии'),
});

// Authentication validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Пароль обязателен'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(100, 'Имя слишком длинное')
    .regex(/^[a-zA-Zа-яА-Я\s]+$/, 'Имя может содержать только буквы и пробелы'),
  role: z.enum(['teacher', 'school'], {
    errorMap: () => ({ message: 'Выберите роль' }),
  }),
});
