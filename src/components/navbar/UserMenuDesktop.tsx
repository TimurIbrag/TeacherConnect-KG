
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Bell, Heart, User, LogOut } from 'lucide-react';

interface UserMenuDesktopProps {
  userData: any;
  userType: 'teacher' | 'school' | null;
  handleLogout: () => void;
}

const UserMenuDesktop: React.FC<UserMenuDesktopProps> = ({ 
  userData, 
  userType, 
  handleLogout 
}) => {
  // Get dashboard link based on user type
  const getDashboardLink = () => {
    return userType === 'school' ? '/school-dashboard' : '/teacher-dashboard';
  };

  // Get initial for avatar
  const getUserInitial = () => {
    if (!userData || !userData.full_name) {
      return userType === 'school' ? 'SC' : 'TC';
    }
    return userData.full_name.charAt(0).toUpperCase();
  };

  // Helper to check if profile is complete
  const isProfileComplete = userData && userData.full_name && userData.email && userData.full_name.trim() !== '';
  
  // Debug logging
  console.log('🔍 UserMenuDesktop state:', { 
    userData, 
    isProfileComplete, 
    hasName: userData?.full_name, 
    hasEmail: userData?.email,
    userType 
  });

  return (
    <div className="hidden md:flex items-center gap-4">
      <Button variant="ghost" size="icon" asChild>
        <Link to="/messages">
          <MessageSquare className="h-5 w-5" />
        </Link>
      </Button>
      
      <Button variant="ghost" size="icon" asChild>
        <Link to="/notifications">
          <Bell className="h-5 w-5" />
        </Link>
      </Button>

      <Button variant="ghost" size="icon" asChild>
        <Link to="/saved">
          <Heart className="h-5 w-5" />
        </Link>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userData?.avatar_url || ""} alt="@user" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {isProfileComplete ? (
            <>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData.full_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={getDashboardLink()}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{userType === 'school' ? 'Панель школы' : 'Мой профиль'}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/saved">
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Избранное</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Сообщения</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Уведомления</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuLabel className="font-normal text-center">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-red-600">
                    Профиль не заполнен
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Пожалуйста, <Link to="/register" className="text-blue-600 underline">зарегистрируйтесь</Link> или <Link to="/user-type-selection" className="text-blue-600 underline">заполните профиль</Link>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/register">
                  <User className="mr-2 h-4 w-4" />
                  <span>Регистрация</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenuDesktop;
