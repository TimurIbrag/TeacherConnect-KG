import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Search, MessageSquare } from 'lucide-react';

interface ProfileActionsCardProps {
  onNavigateToVacancies?: () => void;
}

const ProfileActionsCard: React.FC<ProfileActionsCardProps> = ({ onNavigateToVacancies }) => {
  const navigate = useNavigate();

  const handleSearchTeachers = () => {
    navigate('/teachers');
  };

  const handleMessages = () => {
    navigate('/messages');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Действия</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={onNavigateToVacancies}
        >
          <FilePlus className="mr-2 h-4 w-4" />
          Добавить вакансию
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleSearchTeachers}
        >
          <Search className="mr-2 h-4 w-4" />
          Поиск учителей
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleMessages}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Сообщения
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileActionsCard;