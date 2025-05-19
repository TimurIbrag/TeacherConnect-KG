
import React from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

interface GoogleLoginButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick, isLoading }) => {
  return (
    <Button 
      variant="outline" 
      onClick={onClick} 
      disabled={isLoading}
      className="w-full"
    >
      <Chrome className="mr-2 h-4 w-4" />
      Войти через Google
    </Button>
  );
};

export default GoogleLoginButton;
