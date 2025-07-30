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
}

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async (): Promise<AdminStats> => {
      console.log('📊 Fetching admin statistics...');

      // Get current date for calculations
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      try {
        // Fetch teachers count
        const { data: teachersData, error: teachersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'teacher');

        if (teachersError) {
          console.error('Error fetching teachers count:', teachersError);
        }

        // Fetch schools count
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'school');

        if (schoolsError) {
          console.error('Error fetching schools count:', schoolsError);
        }

        // Fetch vacancies count
        const { data: vacanciesData, error: vacanciesError } = await supabase
          .from('vacancies')
          .select('id')
          .eq('status', 'active');

        if (vacanciesError) {
          console.error('Error fetching vacancies count:', vacanciesError);
        }

        // Fetch applications count
        const { data: applicationsData, error: applicationsError } = await supabase
          .from('applications')
          .select('id');

        if (applicationsError) {
          console.error('Error fetching applications count:', applicationsError);
        }

        // Fetch new registrations today
        const { data: newRegData, error: newRegError } = await supabase
          .from('profiles')
          .select('id')
          .gte('created_at', today.toISOString());

        if (newRegError) {
          console.error('Error fetching new registrations:', newRegError);
        }

        // Fetch active users this week (users who logged in within the last week)
        const { data: activeUsersData, error: activeUsersError } = await supabase
          .from('profiles')
          .select('id')
          .gte('last_seen_at', weekAgo.toISOString());

        if (activeUsersError) {
          console.error('Error fetching active users:', activeUsersError);
        }

        // Fetch total users
        const { data: totalUsersData, error: totalUsersError } = await supabase
          .from('profiles')
          .select('id');

        if (totalUsersError) {
          console.error('Error fetching total users:', totalUsersError);
        }

        // Fetch inactive users (users who haven't logged in for more than 30 days)
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const { data: inactiveUsersData, error: inactiveUsersError } = await supabase
          .from('profiles')
          .select('id')
          .lt('last_seen_at', thirtyDaysAgo.toISOString());

        if (inactiveUsersError) {
          console.error('Error fetching inactive users:', inactiveUsersError);
        }

        // For now, we'll use mock data for certificates and support requests
        // In a real implementation, you'd have these tables in Supabase
        const pendingCertificates = 12; // Mock data
        const pendingSupportRequests = 8; // Mock data
        const verifiedCertificates = 45; // Mock data
        const totalSupportRequests = 23; // Mock data

        const stats: AdminStats = {
          total_teachers: teachersData?.length || 0,
          total_schools: schoolsData?.length || 0,
          total_vacancies: vacanciesData?.length || 0,
          total_applications: applicationsData?.length || 0,
          new_registrations_today: newRegData?.length || 0,
          active_users_this_week: activeUsersData?.length || 0,
          pending_certificates: pendingCertificates,
          pending_support_requests: pendingSupportRequests,
          total_users: totalUsersData?.length || 0,
          inactive_users: inactiveUsersData?.length || 0,
          verified_certificates: verifiedCertificates,
          total_support_requests: totalSupportRequests
        };

        console.log('📊 Admin statistics fetched:', stats);
        return stats;

      } catch (error) {
        console.error('Error fetching admin statistics:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}; 