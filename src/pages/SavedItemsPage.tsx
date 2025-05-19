
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { School, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TeacherCard from '@/components/TeacherCard';
import SchoolCard from '@/components/SchoolCard';
import { teachersData, schoolsData } from '@/data/mockData';

const SavedItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'teacher' | 'school' | null>(null);
  
  // For demo purposes, let's assume these are saved items
  // In a real app, this would come from an API or localStorage
  const [savedTeachers] = useState(teachersData.slice(0, 3));
  const [savedSchools] = useState(schoolsData.slice(0, 2));
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserType(userData.type);
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    } else {
      // Redirect to login if not logged in
      navigate('/login');
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для доступа к избранному",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Избранное</h1>
      
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Поиск в избранном..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Найти
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={userType === 'school' ? "teachers" : "schools"}>
        <TabsList>
          <TabsTrigger value="teachers" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Учителя
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center">
            <School className="h-4 w-4 mr-2" />
            Школы
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers" className="pt-6">
          {savedTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedTeachers.map(teacher => (
                <TeacherCard
                  key={teacher.id}
                  id={teacher.id}
                  name={teacher.name}
                  photo={teacher.photo}
                  specialization={teacher.specialization}
                  experience={teacher.experience}
                  location={teacher.location}
                  ratings={teacher.ratings}
                  views={teacher.views}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">У вас нет сохраненных учителей</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/teachers')}>
                Найти учителей
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schools" className="pt-6">
          {savedSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedSchools.map(school => (
                <SchoolCard
                  key={school.id}
                  id={school.id}
                  name={school.name}
                  photo={school.photo}
                  address={school.address}
                  type={school.type}
                  specialization={school.specialization}
                  openPositions={school.openPositions}
                  ratings={school.ratings}
                  views={school.views}
                  housing={school.housing}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">У вас нет сохраненных школ</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate('/schools')}>
                Найти школы
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedItemsPage;
