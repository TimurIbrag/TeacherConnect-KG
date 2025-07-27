
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageSquare, User } from 'lucide-react';

const TeachersTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleViewProfile = (teacherId: number) => {
    navigate(`/teachers/${teacherId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t('teachers.search')}</h2>
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          {t('teachers.advancedSearch')}
        </Button>
      </div>
      
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('teachers.noTeachersFound')}
          </h3>
          <p className="text-gray-500 mb-6">
            {t('teachers.noTeachersDescription')}
          </p>
          <Button onClick={() => navigate('/teachers')}>
            {t('teachers.browseAllTeachers')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeachersTab;
