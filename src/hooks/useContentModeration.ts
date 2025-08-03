import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProfileForModeration {
  id: string;
  user_name: string;
  user_email: string;
  role: 'teacher' | 'school';
  created_at: string;
  last_updated: string;
  status: 'active' | 'flagged' | 'suspended';
  flag_count: number;
  bio?: string;
  avatar_url?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience_years?: number;
  education?: string;
  skills?: string[];
  languages?: string[];
  availability?: string;
  hourly_rate?: number;
  school_name?: string;
  school_type?: string;
  school_address?: string;
  school_website?: string;
  is_active?: boolean;
  last_seen_at?: string;
}

export interface VacancyForModeration {
  id: string;
  title: string;
  school_name: string;
  created_at: string;
  status: 'active' | 'flagged' | 'suspended';
  flag_count: number;
  description: string;
  contact_email: string;
  school_id?: string;
  requirements?: string;
  salary_range?: string;
  location?: string;
  is_active?: boolean;
  application_deadline?: string;
}

export interface ReportedContent {
  id: string;
  content_type: 'profile' | 'vacancy' | 'comment' | 'message';
  content_id: string;
  reported_by: string;
  reported_at: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  admin_notes?: string;
  content_title: string;
  content_owner: string;
}

export interface ContentModerationStats {
  flagged_profiles: number;
  flagged_vacancies: number;
  pending_reports: number;
  suspended_content: number;
}

// Hook to fetch profiles for moderation
export const useProfilesForModeration = () => {
  return useQuery({
    queryKey: ['profiles-for-moderation'],
    queryFn: async (): Promise<ProfileForModeration[]> => {
      console.log('🔍 Fetching profiles for moderation...');
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching profiles for moderation:', error);
          throw error;
        }

        // Transform profiles to moderation format
        const moderationProfiles: ProfileForModeration[] = profiles?.map(profile => ({
          id: profile.id,
          user_name: profile.full_name || 'Unknown User',
          user_email: profile.email || '',
          role: (profile.role === 'admin' ? 'teacher' : profile.role) || 'teacher',
          created_at: profile.created_at,
          last_updated: profile.updated_at || profile.created_at,
          status: 'active', // Default to active, we'll add suspended status later
          flag_count: 0, // This would come from a reports table
          bio: undefined, // Not available in current schema
          avatar_url: profile.avatar_url,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          location: undefined, // Not available in current schema
          experience_years: undefined, // Not available in current schema
          education: undefined, // Not available in current schema
          skills: undefined, // Not available in current schema
          languages: undefined, // Not available in current schema
          availability: undefined, // Not available in current schema
          hourly_rate: undefined, // Not available in current schema
          school_name: undefined, // Not available in current schema
          school_type: undefined, // Not available in current schema
          school_address: undefined, // Not available in current schema
          school_website: undefined, // Not available in current schema
          is_active: undefined, // Not available in current schema
          last_seen_at: profile.last_seen_at
        })) || [];

        console.log(`✅ Fetched ${moderationProfiles.length} profiles for moderation`);
        return moderationProfiles;

      } catch (error) {
        console.error('Error in useProfilesForModeration:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to fetch vacancies for moderation
export const useVacanciesForModeration = () => {
  return useQuery({
    queryKey: ['vacancies-for-moderation'],
    queryFn: async (): Promise<VacancyForModeration[]> => {
      console.log('🔍 Fetching vacancies for moderation...');
      
      try {
        const { data: vacancies, error } = await supabase
          .from('vacancies')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching vacancies for moderation:', error);
          throw error;
        }

        // Transform vacancies to moderation format
        const moderationVacancies: VacancyForModeration[] = vacancies?.map(vacancy => ({
          id: vacancy.id,
          title: vacancy.title || 'Untitled Vacancy',
          school_name: 'Unknown School', // Not available in current schema
          created_at: vacancy.created_at,
          status: vacancy.is_active === false ? 'suspended' : 'active', // We'll add flagged status later
          flag_count: 0, // This would come from a reports table
          description: vacancy.description || '',
          contact_email: vacancy.contact_email || '',
          school_id: vacancy.school_id,
          requirements: vacancy.requirements?.join(', ') || '',
          salary_range: '', // Not available in current schema
          location: vacancy.location || '',
          is_active: vacancy.is_active,
          application_deadline: vacancy.application_deadline
        })) || [];

        console.log(`✅ Fetched ${moderationVacancies.length} vacancies for moderation`);
        return moderationVacancies;

      } catch (error) {
        console.error('Error in useVacanciesForModeration:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to fetch reported content (currently using localStorage as placeholder)
export const useReportedContent = () => {
  return useQuery({
    queryKey: ['reported-content'],
    queryFn: async (): Promise<ReportedContent[]> => {
      console.log('🔍 Fetching reported content...');
      
      // For now, we'll use localStorage as a placeholder
      // In production, this would be a Supabase table
      const storedReports = localStorage.getItem('reported_content');
      const reports: ReportedContent[] = storedReports ? JSON.parse(storedReports) : [];
      
      console.log(`✅ Fetched ${reports.length} reported content items`);
      return reports;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to get content moderation statistics
export const useContentModerationStats = () => {
  return useQuery({
    queryKey: ['content-moderation-stats'],
    queryFn: async (): Promise<ContentModerationStats> => {
      console.log('📊 Fetching content moderation statistics...');
      
      try {
        // Get reported content from localStorage (placeholder)
        const storedReports = localStorage.getItem('reported_content');
        const reportedContent: ReportedContent[] = storedReports ? JSON.parse(storedReports) : [];
        const pendingReports = reportedContent.filter(report => report.status === 'pending').length;

        const stats: ContentModerationStats = {
          flagged_profiles: 0, // This would come from a reports table
          flagged_vacancies: 0, // This would come from a reports table
          pending_reports: pendingReports,
          suspended_content: 0 // This would come from is_active field when available
        };

        console.log('✅ Content moderation statistics:', stats);
        return stats;

      } catch (error) {
        console.error('Error fetching content moderation stats:', error);
        return {
          flagged_profiles: 0,
          flagged_vacancies: 0,
          pending_reports: 0,
          suspended_content: 0
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Hook to suspend a profile (placeholder - would need is_active field in schema)
export const useSuspendProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileId: string): Promise<void> => {
      console.log('🚫 Suspending profile:', profileId);
      // TODO: Implement when is_active field is added to profiles table
      console.log('⚠️ Profile suspension not implemented - need is_active field in schema');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles-for-moderation'] });
      queryClient.invalidateQueries({ queryKey: ['content-moderation-stats'] });
    },
  });
};

// Hook to activate a profile (placeholder - would need is_active field in schema)
export const useActivateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileId: string): Promise<void> => {
      console.log('✅ Activating profile:', profileId);
      // TODO: Implement when is_active field is added to profiles table
      console.log('⚠️ Profile activation not implemented - need is_active field in schema');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles-for-moderation'] });
      queryClient.invalidateQueries({ queryKey: ['content-moderation-stats'] });
    },
  });
};

// Hook to suspend a vacancy
export const useSuspendVacancy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vacancyId: string): Promise<void> => {
      console.log('🚫 Suspending vacancy:', vacancyId);
      
      const { error } = await supabase
        .from('vacancies')
        .update({ is_active: false })
        .eq('id', vacancyId);

      if (error) {
        console.error('Error suspending vacancy:', error);
        throw error;
      }

      console.log('✅ Vacancy suspended successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies-for-moderation'] });
      queryClient.invalidateQueries({ queryKey: ['content-moderation-stats'] });
    },
  });
};

// Hook to activate a vacancy
export const useActivateVacancy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (vacancyId: string): Promise<void> => {
      console.log('✅ Activating vacancy:', vacancyId);
      
      const { error } = await supabase
        .from('vacancies')
        .update({ is_active: true })
        .eq('id', vacancyId);

      if (error) {
        console.error('Error activating vacancy:', error);
        throw error;
      }

      console.log('✅ Vacancy activated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies-for-moderation'] });
      queryClient.invalidateQueries({ queryKey: ['content-moderation-stats'] });
    },
  });
}; 