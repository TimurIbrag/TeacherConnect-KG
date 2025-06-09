
import DOMPurify from 'dompurify';

// XSS Protection
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
  });
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 10000); // Limit length
};

// Input validation helpers
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Rate limiting (simple client-side implementation)
interface RateLimitEntry {
  count: number;
  lastReset: number;
}

const rateLimitStorage = new Map<string, RateLimitEntry>();

export const checkRateLimit = (
  key: string,
  maxAttempts: number,
  windowMs: number
): boolean => {
  const now = Date.now();
  const entry = rateLimitStorage.get(key);

  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitStorage.set(key, { count: 1, lastReset: now });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count++;
  return true;
};

// Security headers for forms
export const getSecurityHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
});

// Validate message recipients (only allow messaging between teachers and schools)
export const canSendMessage = (
  senderRole: string,
  recipientRole: string
): boolean => {
  const allowedCombinations = [
    ['teacher', 'school'],
    ['school', 'teacher'],
  ];
  
  return allowedCombinations.some(
    ([role1, role2]) => 
      (senderRole === role1 && recipientRole === role2) ||
      (senderRole === role2 && recipientRole === role1)
  );
};

// File upload validation
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const allowedDocumentTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allAllowedTypes = [...allowedImageTypes, ...allowedDocumentTypes];
  
  if (!isValidFileType(file, allAllowedTypes)) {
    return { valid: false, error: 'Недопустимый тип файла' };
  }

  // Check file size (5MB for images, 10MB for documents)
  const maxSize = allowedImageTypes.includes(file.type) ? 5 : 10;
  if (!isValidFileSize(file, maxSize)) {
    return { valid: false, error: `Файл слишком большой (максимум ${maxSize}MB)` };
  }

  return { valid: true };
};

// Password strength checker
export const checkPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Минимум 8 символов');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Добавьте строчные буквы');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Добавьте заглавные буквы');

  if (/\d/.test(password)) score++;
  else feedback.push('Добавьте цифры');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  else feedback.push('Добавьте специальные символы');

  return { score, feedback };
};
