
import { sanitizeText } from '@/lib/security';

// Enhanced input validation with security checks
export const validateSecureInput = (input: string, maxLength: number = 1000): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} => {
  try {
    // Basic sanitization
    const sanitized = sanitizeText(input);
    
    // Length validation
    if (sanitized.length === 0 && input.trim().length > 0) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Входные данные содержат недопустимые символы'
      };
    }
    
    if (sanitized.length > maxLength) {
      return {
        isValid: false,
        sanitized: sanitized.substring(0, maxLength),
        error: `Превышена максимальная длина (${maxLength} символов)`
      };
    }
    
    // Dangerous pattern detection
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /vbscript:/i
    ];
    
    const hasDangerousContent = dangerousPatterns.some(pattern => 
      pattern.test(input)
    );
    
    if (hasDangerousContent) {
      return {
        isValid: false,
        sanitized: sanitized,
        error: 'Обнаружено потенциально опасное содержимое'
      };
    }
    
    return {
      isValid: true,
      sanitized: sanitized
    };
  } catch (error) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Ошибка валидации входных данных'
    };
  }
};

// Validate file uploads with enhanced security
export const validateSecureFileUpload = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  // File type validation
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Недопустимый тип файла'
    };
  }
  
  // File size validation (10MB max)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Файл слишком большой (максимум 10MB)'
    };
  }
  
  // File name validation
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com'];
  const fileName = file.name.toLowerCase();
  
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    return {
      isValid: false,
      error: 'Недопустимое расширение файла'
    };
  }
  
  return { isValid: true };
};

// Enhanced email validation
export const validateSecureEmail = (email: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} => {
  const sanitized = email.toLowerCase().trim();
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Неверный формат email'
    };
  }
  
  // Check for dangerous characters
  if (sanitized.includes('<') || sanitized.includes('>') || sanitized.includes('"')) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Email содержит недопустимые символы'
    };
  }
  
  return {
    isValid: true,
    sanitized: sanitized
  };
};

// Validate URLs for security
export const validateSecureUrl = (url: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} => {
  try {
    const sanitized = url.trim();
    const urlObj = new URL(sanitized);
    
    // Only allow https and http
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Разрешены только HTTP и HTTPS ссылки'
      };
    }
    
    // Block dangerous domains (basic check)
    const dangerousDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (dangerousDomains.some(domain => urlObj.hostname.includes(domain))) {
      return {
        isValid: false,
        sanitized: '',
        error: 'Недопустимый домен'
      };
    }
    
    return {
      isValid: true,
      sanitized: sanitized
    };
  } catch (error) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Неверный формат URL'
    };
  }
};

// Rate limiting implementation (enhanced)
interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs?: number;
}

const rateLimitStore = new Map<string, {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}>();

export const checkSecureRateLimit = (
  key: string, 
  config: RateLimitConfig
): {
  allowed: boolean;
  remainingAttempts?: number;
  resetTime?: number;
  blockedUntil?: number;
} => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  // Check if currently blocked
  if (entry?.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      blockedUntil: entry.blockedUntil
    };
  }
  
  // Reset if window expired
  if (!entry || now - entry.firstAttempt > config.windowMs) {
    rateLimitStore.set(key, {
      attempts: 1,
      firstAttempt: now
    });
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - 1,
      resetTime: now + config.windowMs
    };
  }
  
  // Increment attempts
  entry.attempts++;
  
  // Check if limit exceeded
  if (entry.attempts > config.maxAttempts) {
    const blockDuration = config.blockDurationMs || config.windowMs * 2;
    entry.blockedUntil = now + blockDuration;
    
    return {
      allowed: false,
      blockedUntil: entry.blockedUntil
    };
  }
  
  return {
    allowed: true,
    remainingAttempts: config.maxAttempts - entry.attempts,
    resetTime: entry.firstAttempt + config.windowMs
  };
};

// Clean up expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blockedUntil && now > entry.blockedUntil) {
      rateLimitStore.delete(key);
    } else if (now - entry.firstAttempt > 24 * 60 * 60 * 1000) { // 24 hours
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes
