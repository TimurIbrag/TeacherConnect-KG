
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeText } from '@/lib/security';

interface SecureFormWrapperProps {
  children: React.ReactNode;
  onSubmit: (data: any) => Promise<void> | void;
  className?: string;
}

const SecureFormWrapper: React.FC<SecureFormWrapperProps> = ({ 
  children, 
  onSubmit, 
  className = '' 
}) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.currentTarget);
      const data: Record<string, any> = {};
      
      // Sanitize all form inputs
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          data[key] = sanitizeText(value);
        } else {
          data[key] = value;
        }
      }
      
      await onSubmit(data);
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Don't expose sensitive error details
      const userFriendlyMessage = error.message?.includes('rate limit') 
        ? error.message
        : 'Произошла ошибка. Попробуйте еще раз.';
        
      toast({
        title: 'Ошибка',
        description: userFriendlyMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}
    </form>
  );
};

export default SecureFormWrapper;
