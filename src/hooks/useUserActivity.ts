import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserActivity {
  user_id: string;
  is_online: boolean;
  last_activity: string;
  current_page?: string;
  session_duration?: number;
}

export interface UserActivityData {
  [userId: string]: UserActivity;
}

// Simulate real-time activity tracking
// In a real implementation, this would use Supabase Realtime or WebSocket
export const useUserActivity = () => {
  return useQuery({
    queryKey: ['user-activity'],
    queryFn: async (): Promise<UserActivityData> => {
      // For now, we'll simulate activity data
      // In production, this would fetch from a real-time activity table
      const mockActivity: UserActivityData = {};
      
      // Get all user IDs from profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, last_seen_at, created_at');
      
      if (profiles) {
        profiles.forEach(profile => {
          const lastSeen = new Date(profile.last_seen_at || profile.created_at);
          const now = new Date();
          const timeDiff = now.getTime() - lastSeen.getTime();
          const isOnline = timeDiff < 5 * 60 * 1000; // 5 minutes threshold
          
          mockActivity[profile.id] = {
            user_id: profile.id,
            is_online: isOnline,
            last_activity: profile.last_seen_at || profile.created_at,
            current_page: isOnline ? 'dashboard' : undefined,
            session_duration: isOnline ? Math.floor(timeDiff / 1000) : 0
          };
        });
      }
      
      return mockActivity;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useUserActivityStatus = (userId: string) => {
  const { data: activityData } = useUserActivity();
  return activityData?.[userId];
}; 