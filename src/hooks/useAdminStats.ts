import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  total_teachers: number;
  total_schools: number;
  total_vacancies: number;
  total_applications: number;
  new_registrations_today: number;
  active_users_this_week: number;
  pending_certificates: number;
  pending_support_requests: number;
  total_users: number;
  inactive_users: number;
  verified_certificates: number;
  total_support_requests: number;
  suspended_users: number;
  total_profiles_complete: number;
  total_profiles_incomplete: number;
  recent_activity: {
    new_teachers: number;
    new_schools: number;
    new_vacancies: number;
    new_applications: number;
  };
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('📊 Fetching comprehensive admin statistics...');

      // Get current date for calculations
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      try {
        // Fetch all profiles for comprehensive analysis
        console.log('🔍 Fetching profiles for admin stats...');
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        console.log('📊 Raw profiles data for stats:', allProfiles);
        console.log('❌ Profiles error:', profilesError);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Fetch vacancies
        const { data: vacancies, error: vacanciesError } = await supabase
          .from('vacancies')
          .select('*');

        if (vacanciesError) {
          console.error('Error fetching vacancies:', vacanciesError);
        }

        // Fetch applications
        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select('*');

        if (applicationsError) {
          console.error('Error fetching applications:', applicationsError);
        }

        // Calculate comprehensive statistics
        const teachers = allProfiles?.filter(p => p.role === 'teacher') || [];
        const schools = allProfiles?.filter(p => p.role === 'school') || [];
        const activeVacancies = vacancies?.filter(v => v.is_active === true) || [];
        const allApplications = applications || [];

        // User activity analysis
        const activeUsersThisWeek = allProfiles?.filter(p => 
          p.last_seen_at && new Date(p.last_seen_at) >= weekAgo
        ) || [];

        const inactiveUsers = allProfiles?.filter(p => 
          !p.last_seen_at || new Date(p.last_seen_at) < thirtyDaysAgo
        ) || [];

        const newRegistrationsToday = allProfiles?.filter(p => 
          new Date(p.created_at) >= today
        ) || [];

        const completeProfiles = allProfiles?.filter(p => 
          p.full_name && p.full_name.trim() !== '' && p.role
        ) || [];

        const incompleteProfiles = allProfiles?.filter(p => 
          !p.full_name || p.full_name.trim() === '' || !p.role
        ) || [];

        // Recent activity (last 7 days)
        const recentTeachers = teachers.filter(t => 
          new Date(t.created_at) >= weekAgo
        );

        const recentSchools = schools.filter(s => 
          new Date(s.created_at) >= weekAgo
        );

        const recentVacancies = activeVacancies.filter(v => 
          new Date(v.created_at) >= weekAgo
        );

        const recentApplications = allApplications.filter(a => 
          new Date(a.applied_at) >= weekAgo
        );

        // Support requests from localStorage (simulating database)
        const storedRequests = localStorage.getItem('support_requests');
        const supportRequests = storedRequests ? JSON.parse(storedRequests) : [];
        const pendingSupportRequests = supportRequests.filter((req: any) => 
          req.status === 'open' || req.status === 'in_progress'
        );

        // Get real certificate data from localStorage
        const storedCertificates = localStorage.getItem('certificate_submissions');
        const certificates = storedCertificates ? JSON.parse(storedCertificates) : [];
        const pendingCertificates = certificates.filter((c: any) => c.status === 'pending').length;
        const verifiedCertificates = certificates.filter((c: any) => c.status === 'approved').length;

        const stats: AdminStats = {
          total_teachers: teachers.length,
          total_schools: schools.length,
          total_vacancies: activeVacancies.length,
          total_applications: allApplications.length,
          new_registrations_today: newRegistrationsToday.length,
          active_users_this_week: activeUsersThisWeek.length,
          pending_certificates: pendingCertificates,
          pending_support_requests: pendingSupportRequests.length,
          total_users: allProfiles?.length || 0,
          inactive_users: inactiveUsers.length,
          verified_certificates: verifiedCertificates,
          total_support_requests: supportRequests.length,
          suspended_users: 0, // Would come from a suspended users table
          total_profiles_complete: completeProfiles.length,
          total_profiles_incomplete: incompleteProfiles.length,
          recent_activity: {
            new_teachers: recentTeachers.length,
            new_schools: recentSchools.length,
            new_vacancies: recentVacancies.length,
            new_applications: recentApplications.length,
          }
        };

        console.log('📊 Comprehensive admin statistics fetched:', stats);
        return stats;

      } catch (error) {
        console.error('Error fetching admin statistics:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
}; 