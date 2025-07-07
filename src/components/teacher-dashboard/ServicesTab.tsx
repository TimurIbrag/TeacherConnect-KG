
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CreateTeacherVacancyDialog from './CreateTeacherVacancyDialog';
import { useMyTeacherVacancies } from '@/hooks/useTeacherVacancies';

const ServicesTab = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: vacancies = [], isLoading } = useMyTeacherVacancies(user?.id || '');

  // Create vacancy mutation
  const createVacancyMutation = useMutation({
    mutationFn: async (newVacancy: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('teacher_vacancies')
        .insert({
          ...newVacancy,
          teacher_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-teacher-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
      toast({
        title: "Услуга создана",
        description: "Ваша услуга была успешно опубликована",
      });
      setCreateDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать услугу. Попробуйте снова.",
        variant: "destructive",
      });
    },
  });

  // Delete vacancy mutation
  const deleteVacancyMutation = useMutation({
    mutationFn: async (vacancyId: string) => {
      const { error } = await supabase
        .from('teacher_vacancies')
        .delete()
        .eq('id', vacancyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-teacher-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
      toast({
        title: "Услуга удалена",
        description: "Услуга была успешно удалена",
      });
    },
    onError: (error) => {
      console.error('Error deleting vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить услугу",
        variant: "destructive",
      });
    },
  });

  // Toggle vacancy status mutation
  const updateVacancyMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('teacher_vacancies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-teacher-vacancies', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['teacher-vacancies'] });
      toast({
        title: "Изменения сохранены",
        description: "Статус услуги обновлен",
      });
    },
    onError: (error) => {
      console.error('Error updating vacancy:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить услугу",
        variant: "destructive",
      });
    },
  });

  const handleVacancyCreated = (newVacancy: any) => {
    createVacancyMutation.mutate(newVacancy);
  };

  const handleDeleteVacancy = (id: string) => {
    deleteVacancyMutation.mutate(id);
  };

  const handleToggleVacancyStatus = (id: string, isActive: boolean) => {
    updateVacancyMutation.mutate({
      id,
      updates: { is_active: !isActive }
    });
  };

  if (profile?.role !== 'teacher') {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Доступ к управлению услугами разрешен только преподавателям
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Мои услуги</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Мои услуги</h2>
        <Button onClick={() => setCreateDialogOpen(true)} disabled={createVacancyMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {createVacancyMutation.isPending ? 'Создание...' : 'Создать услугу'}
        </Button>
      </div>
      
      {vacancies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            У вас пока нет опубликованных услуг
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} disabled={createVacancyMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Создать первую услугу
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {vacancies.map((vacancy) => (
            <Card key={vacancy.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{vacancy.title}</CardTitle>
                    <CardDescription>{vacancy.subject}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={vacancy.is_active ? "default" : "secondary"}>
                      {vacancy.is_active ? "Активна" : "Неактивна"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{vacancy.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {vacancy.hourly_rate && (
                    <div>
                      <p className="text-sm text-gray-500">Индивидуально</p>
                      <p className="font-medium">{vacancy.hourly_rate} ₽/час</p>
                    </div>
                  )}
                  {vacancy.group_rate && (
                    <div>
                      <p className="text-sm text-gray-500">Группа</p>
                      <p className="font-medium">{vacancy.group_rate} ₽/час</p>
                    </div>
                  )}
                  {vacancy.location && (
                    <div>
                      <p className="text-sm text-gray-500">Местоположение</p>
                      <p className="font-medium">{vacancy.location}</p>
                    </div>
                  )}
                  {vacancy.employment_type && (
                    <div>
                      <p className="text-sm text-gray-500">Тип</p>
                      <p className="font-medium">{vacancy.employment_type}</p>
                    </div>
                  )}
                </div>

                {vacancy.availability && vacancy.availability.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Доступность</p>
                    <div className="flex flex-wrap gap-1">
                      {vacancy.availability.map((time, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleVacancyStatus(vacancy.id, vacancy.is_active)}
                      disabled={updateVacancyMutation.isPending}
                    >
                      {vacancy.is_active ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Скрыть
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Показать
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVacancy(vacancy.id)}
                      disabled={deleteVacancyMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Создано: {new Date(vacancy.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateTeacherVacancyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onVacancyCreated={handleVacancyCreated}
        isCreating={createVacancyMutation.isPending}
      />
    </div>
  );
};

export default ServicesTab;
