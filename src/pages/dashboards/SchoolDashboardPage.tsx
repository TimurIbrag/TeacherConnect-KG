
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from '@/components/school-dashboard/ProfileTab';
import VacanciesTab from '@/components/school-dashboard/VacanciesTab';
import ApplicationsTab from '@/components/school-dashboard/ApplicationsTab';
import TeachersTab from '@/components/school-dashboard/TeachersTab';

const SchoolDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  React.useEffect(() => {
    const isLoggedIn = true; // This would be from auth system
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleNavigateToVacancies = () => {
    setActiveTab('vacancies');
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Панель управления школы</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full max-w-md grid grid-cols-4">
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="vacancies">Вакансии</TabsTrigger>
          <TabsTrigger value="applications">Отклики</TabsTrigger>
          <TabsTrigger value="teachers">Учителя</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab onNavigateToVacancies={handleNavigateToVacancies} />
        </TabsContent>
        
        <TabsContent value="vacancies">
          <VacanciesTab />
        </TabsContent>
        
        <TabsContent value="applications">
          <ApplicationsTab />
        </TabsContent>
        
        <TabsContent value="teachers">
          <TeachersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolDashboardPage;
