import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
// Removed mock data import - using only Supabase data
import { useToast } from '@/hooks/use-toast';
import { useSchool } from '@/hooks/useSchools';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import SchoolHeader from '@/components/school-profile/SchoolHeader';
import SchoolTabs from '@/components/school-profile/SchoolTabs';
import SchoolStats from '@/components/school-profile/SchoolStats';
import SimilarSchools from '@/components/school-profile/SimilarSchools';

// Unified interface for displaying school data
interface DisplaySchool {
  id: string | number;
  name: string;
  photo: string;
  address: string;
  type: string;
  specialization: string;
  ratings: number;
  views: number;
  housing: boolean;
  about: string;
  facilities: string[];
  applications: number;
  city?: string;
  photos?: string[];
}

const SchoolProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Try to get school from Supabase first, then fallback to mock data
  const { data: supabaseSchool, isLoading: isLoadingSupabase } = useSchool(id || '');
  
  // Get published schools from localStorage
  const publishedSchools = JSON.parse(localStorage.getItem('publishedSchools') || '[]');
  const publishedSchool = publishedSchools.find((s: any) => s.id.toString() === id);
  
  // Use only Supabase school data
  const school = supabaseSchool;
  
  // Get vacancies for this school - fetch for both Supabase and mock schools
  const { data: vacancies = [], isLoading: isLoadingVacancies } = useQuery({
    queryKey: ['school-vacancies-public', id],
    queryFn: async () => {
      if (!id) return [];
      
      // Only fetch from Supabase if we have a UUID format (Supabase school)
      if (supabaseSchool && id.includes('-')) {
        const { data, error } = await supabase
          .from('vacancies')
          .select(`
            *,
            school_profiles (
              school_name,
              address
            )
          `)
          .eq('school_id', id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching vacancies:', error);
          return [];
        }

        return data || [];
      }
      
      // No mock vacancies - return empty array
      return [];
    },
    enabled: !!id,
  });

  const handleApplyToVacancy = (vacancyId: string) => {
    toast({
      title: "Заявка отправлена!",
      description: "Ваш отклик на вакансию успешно отправлен",
    });
  };
  
  if (isLoadingSupabase && !supabaseSchool) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
      </div>
    );
  }
  
  if (!school) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Школа не найдена</h1>
        <p className="mb-6">Организация с указанным ID не существует.</p>
        <Button asChild>
          <Link to="/schools">Вернуться к списку школ</Link>
        </Button>
      </div>
    );
  }

  // Convert school data to unified display format
  const displaySchool: DisplaySchool = supabaseSchool ? {
    id: supabaseSchool.id,
    name: supabaseSchool.school_name || 'Школа',
    photo: supabaseSchool.photo_urls?.[0] || null,
    address: supabaseSchool.address || 'Адрес не указан',
    type: supabaseSchool.school_type || 'Государственная',
    specialization: supabaseSchool.description || 'Общее образование',
    ratings: 4.5,
    views: 150,
    housing: supabaseSchool.housing_provided || false,
    about: supabaseSchool.description || 'Описание школы',
    facilities: supabaseSchool.facilities || [],
    applications: 0,
    city: supabaseSchool.address?.split(',')[0] || 'Бишкек',
    photos: supabaseSchool.photo_urls || []
  } : publishedSchool ? {
    id: publishedSchool.id,
    name: publishedSchool.name,
    photo: publishedSchool.photo?.value || publishedSchool.photo || null,
    address: publishedSchool.address || 'Адрес не указан',
    type: publishedSchool.type || 'Частная',
    specialization: publishedSchool.specialization || 'Общее образование',
    ratings: 4.5,
    views: 150,
    housing: publishedSchool.housing || false,
    about: publishedSchool.about || publishedSchool.description || 'Описание школы',
    facilities: publishedSchool.facilities || [],
    applications: 0,
    city: publishedSchool.address?.split(',')[0] || 'Бишкек',
    photos: publishedSchool.photos || publishedSchool.photo_urls || []
  } : {
    id: 'mock', // Placeholder for mock data
    name: 'Школа',
    photo: null,
    address: 'Адрес не указан',
    type: 'Государственная',
    specialization: 'Общее образование',
    ratings: 4.5,
    views: 150,
    housing: false,
    about: 'Описание школы',
    facilities: [],
    applications: 0,
    city: 'Бишкек',
    photos: []
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SchoolHeader 
            school={displaySchool} 
            isOwner={user?.id === id}
          />
          
          <Card>
            <CardContent className="border-t pt-6">
              <SchoolTabs
                school={displaySchool}
                vacancies={vacancies || []}
                isLoadingVacancies={isLoadingVacancies}
                onApplyToVacancy={handleApplyToVacancy}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <SchoolStats 
            school={displaySchool} 
            vacancyCount={(vacancies || []).length} 
          />
          
          <SimilarSchools currentSchool={displaySchool} />
        </div>
      </div>
    </div>
  );
};

export default SchoolProfilePage;