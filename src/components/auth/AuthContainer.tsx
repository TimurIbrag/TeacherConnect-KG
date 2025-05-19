
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';

interface AuthContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkPath: string;
}

const AuthContainer: React.FC<AuthContainerProps> = ({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkPath
}) => {
  return (
    <div className="container px-4 py-12 max-w-7xl mx-auto flex justify-center">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm">
            {footerText}{' '}
            <Link to={footerLinkPath} className="text-primary hover:underline">
              {footerLinkText}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthContainer;
