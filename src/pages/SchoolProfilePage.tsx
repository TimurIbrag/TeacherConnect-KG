import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { schoolsData } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { useSchool } from '@/hooks/useSupabaseData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
}

const SchoolProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Try to get school from Supabase first, then fallback to mock data
  const { data: supabaseSchool, isLoading: isLoadingSupabase } = useSchool(id || '');
  
  // Get vacancies for this school - only fetch if we have a Supabase school (UUID)
  const { data: vacancies = [], isLoading: isLoadingVacancies } = useQuery({
    queryKey: ['school-vacancies-public', id],
    queryFn: async () => {
      if (!id || !supabaseSchool) return [];
      
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
    },
    enabled: !!id && !!supabaseSchool,
  });

  const schoolId = Number(id);
  const mockSchool = schoolsData.find(s => s.id === schoolId);
  
  // Use Supabase school if available, otherwise use mock data
  const school = supabaseSchool || mockSchool;
  
  const handleApplyToVacancy = (vacancyId: string) => {
    toast({
      title: "Заявка отправлена!",
      description: "Ваш отклик на вакансию успешно отправлен",
    });
  };
  
  if (isLoadingSupabase && !mockSchool) {
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
    photo: supabaseSchool.photo_urls?.[0] || '/placeholder.svg',
    address: supabaseSchool.address || 'Адрес не указан',
    type: supabaseSchool.school_type || 'Государственная',
    specialization: supabaseSchool.description || 'Общее образование',
    ratings: 4.5,
    views: 150,
    housing: supabaseSchool.housing_provided || false,
    about: supabaseSchool.description || 'Описание школы',
    facilities: supabaseSchool.facilities || [],
    applications: 0,
    city: supabaseSchool.address?.split(',')[0] || 'Бишкек'
  } : {
    id: mockSchool!.id,
    name: mockSchool!.name,
    photo: mockSchool!.photo,
    address: mockSchool!.address,
    type: mockSchool!.type,
    specialization: mockSchool!.specialization,
    ratings: mockSchool!.ratings,
    views: mockSchool!.views,
    housing: mockSchool!.housing,
    about: mockSchool!.about,
    facilities: mockSchool!.facilities,
    applications: mockSchool!.applications,
    city: mockSchool!.address?.split(',')[0] || 'Бишкек'
  };
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <SchoolHeader school={displaySchool} />
          
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