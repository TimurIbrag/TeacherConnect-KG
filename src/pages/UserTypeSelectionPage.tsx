import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRoleSelection = async (role: 'teacher' | 'school') => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Пользователь не найден",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update user profile with selected role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create role-specific profile
      if (role === 'school') {
        const { error: schoolError } = await supabase
          .from('school_profiles')
          .insert({
            id: user.id,
            school_name: user.user_metadata?.full_name || 'Новая школа',
            is_published: false
          });
        
        if (schoolError) throw schoolError;
        navigate('/school-dashboard');
      } else {
        const { error: teacherError } = await supabase
          .from('teacher_profiles')
          .insert({
            id: user.id,
            available: true
          });
        
        if (teacherError) throw teacherError;
        navigate('/teacher-dashboard');
      }

      toast({
        title: "Успешно!",
        description: `Вы зарегистрированы как ${role === 'teacher' ? 'учитель' : 'школа'}`,
      });

    } catch (error: any) {
      console.error('Role selection error:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось установить роль",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground mb-4">Для доступа к этой странице необходимо войти в систему</p>
          <Button onClick={() => navigate('/login')}>
            Войти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Выберите свою роль</h1>
          <p className="text-muted-foreground">
            Как вы хотите использовать нашу платформу?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Teacher Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">👨‍🏫</div>
              <h2 className="text-2xl font-bold mb-3">Учитель</h2>
              <p className="text-muted-foreground mb-6">
                Найдите работу в школах, создавайте профиль и откликайтесь на вакансии
              </p>
              <Button 
                onClick={() => handleRoleSelection('teacher')}
                className="w-full"
                size="lg"
              >
                Продолжить как учитель
              </Button>
            </CardContent>
          </Card>

          {/* School Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🏫</div>
              <h2 className="text-2xl font-bold mb-3">Школа</h2>
              <p className="text-muted-foreground mb-6">
                Размещайте вакансии, ищите учителей и управляйте заявками
              </p>
              <Button 
                onClick={() => handleRoleSelection('school')}
                className="w-full"
                size="lg"
              >
                Продолжить как школа
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;