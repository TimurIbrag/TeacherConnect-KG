
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface RegisterSocialAuthProps {
  userType: 'teacher' | 'school';
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const RegisterSocialAuth: React.FC<RegisterSocialAuthProps> = ({ userType, isLoading, setIsLoading }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This would be replaced with actual Google Auth API implementation
      // For demo, we'll create a mock user based on the selected type
      const googleUser = {
        email: `google-user-${Date.now()}@gmail.com`,
        type: userType,
        name: userType === 'school' ? 'Google School' : 'Google Teacher',
        authProvider: 'google'
      };
      
      localStorage.setItem('user', JSON.stringify(googleUser));
      
      window.dispatchEvent(new Event('login'));
      
      toast({
        title: "Google регистрация успешна",
        description: "Добро пожаловать в личный кабинет",
      });
      
      if (userType === 'school') {
        navigate('/school-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выполнить регистрацию через Google. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleGoogleRegister} 
      disabled={isLoading}
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      Зарегистрироваться через Google
    </Button>
  );
};

export default RegisterSocialAuth;
