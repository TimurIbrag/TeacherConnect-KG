
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
    if (!userData || !userData.name) {
      return userType === 'school' ? 'SC' : 'TC';
    }
    return userData.name.charAt(0).toUpperCase();
  };

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
              <AvatarImage src={userData?.photo || ""} alt="@user" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userData?.name || (userType === 'school' ? 'Школа' : 'Учитель')}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData?.email || 'user@example.com'}
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenuDesktop;
