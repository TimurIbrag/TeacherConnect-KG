
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { validateSecureInput, checkSecureRateLimit } from '@/lib/securityValidation';
import { useToast } from '@/hooks/use-toast';

interface SecureMessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const SecureMessageInput: React.FC<SecureMessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Напишите сообщение..."
}) => {
  const [messageText, setMessageText] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (disabled || isValidating) return;
    
    setIsValidating(true);
    
    try {
      // Rate limiting check
      const rateLimitResult = checkSecureRateLimit('message_send', {
        windowMs: 60 * 1000, // 1 minute window
        maxAttempts: 10, // 10 messages per minute
        blockDurationMs: 5 * 60 * 1000 // 5 minute block
      });
      
      if (!rateLimitResult.allowed) {
        const blockTimeRemaining = rateLimitResult.blockedUntil 
          ? Math.ceil((rateLimitResult.blockedUntil - Date.now()) / 1000)
          : 0;
          
        toast({
          title: "Превышен лимит отправки",
          description: `Слишком много сообщений. Попробуйте через ${blockTimeRemaining} секунд.`,
          variant: "destructive",
        });
        return;
      }
      
      // Input validation
      const validation = validateSecureInput(messageText, 5000);
      
      if (!validation.isValid) {
        toast({
          title: "Ошибка валидации",
          description: validation.error || "Сообщение содержит недопустимые данные",
          variant: "destructive",
        });
        return;
      }
      
      if (validation.sanitized.trim().length === 0) {
        toast({
          title: "Пустое сообщение",
          description: "Введите текст сообщения",
          variant: "destructive",
        });
        return;
      }
      
      // Send the sanitized message
      await onSendMessage(validation.sanitized);
      setMessageText('');
      
    } catch (error: any) {
      console.error('Secure message send error:', error);
      toast({
        title: "Ошибка отправки",
        description: error.message || "Не удалось отправить сообщение",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Basic real-time validation
    if (value.length > 5000) {
      toast({
        title: "Превышена длина",
        description: "Максимальная длина сообщения 5000 символов",
        variant: "destructive",
      });
      return;
    }
    
    setMessageText(value);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={messageText}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="flex-1"
        disabled={disabled || isValidating}
        maxLength={5000}
      />
      <Button 
        onClick={handleSendMessage} 
        disabled={disabled || isValidating || !messageText.trim()}
      >
        {isValidating ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default SecureMessageInput;
