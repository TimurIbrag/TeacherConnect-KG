
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { checkRateLimit } from '@/lib/security';

export const useSecureAuth = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [isSessionValid, setIsSessionValid] = useState(true);

  // Check session validity
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const expiryTime = new Date(session.expires_at! * 1000);
        setSessionExpiry(expiryTime);
        
        // Check if session is about to expire (15 minutes warning)
        const warningTime = new Date(expiryTime.getTime() - 15 * 60 * 1000);
        const now = new Date();
        
        if (now > warningTime && now < expiryTime) {
          toast({
            title: 'Сессия истекает',
            description: 'Ваша сессия истечет через 15 минут. Сохраните изменения.',
            variant: 'default',
          });
        }
        
        if (now > expiryTime) {
          setIsSessionValid(false);
          toast({
            title: 'Сессия истекла',
            description: 'Пожалуйста, войдите в систему заново.',
            variant: 'destructive',
          });
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    checkSession(); // Initial check

    return () => clearInterval(interval);
  }, [toast]);

  // Secure login with rate limiting
  const secureLogin = async (email: string, password: string) => {
    const rateLimitKey = `login_${email}`;
    
    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      throw new Error('Слишком много попыток входа. Попробуйте через 15 минут.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      console.error('Login error:', error);
      throw error;
    }

    return data;
  };

  // Secure registration with validation
  const secureRegister = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: 'teacher' | 'school'
  ) => {
    const rateLimitKey = `register_${email}`;
    
    if (!checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000)) {
      throw new Error('Слишком много попыток регистрации. Попробуйте через час.');
    }

    // Store user type for profile creation
    localStorage.setItem('pendingUserType', role);

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    });

    if (error) {
      localStorage.removeItem('pendingUserType');
      console.error('Registration error:', error);
      throw error;
    }

    return data;
  };

  // Secure password reset
  const securePasswordReset = async (email: string) => {
    const rateLimitKey = `reset_${email}`;
    
    if (!checkRateLimit(rateLimitKey, 3, 60 * 60 * 1000)) {
      throw new Error('Слишком много запросов сброса пароля. Попробуйте через час.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: `${window.location.origin}/?redirect=password-reset`,
    });

    if (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Refresh session before expiry
  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      setIsSessionValid(false);
      return false;
    }

    if (data.session) {
      const expiryTime = new Date(data.session.expires_at! * 1000);
      setSessionExpiry(expiryTime);
      setIsSessionValid(true);
      return true;
    }

    return false;
  };

  // Check if user has required permissions
  const hasPermission = (requiredRole?: string): boolean => {
    if (!user || !profile) return false;
    if (!requiredRole) return true;
    return profile.role === requiredRole;
  };

  // Secure logout
  const secureLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear(); // Clear any cached data
  };

  return {
    user,
    profile,
    sessionExpiry,
    isSessionValid,
    secureLogin,
    secureRegister,
    securePasswordReset,
    refreshSession,
    hasPermission,
    secureLogout,
  };
};
