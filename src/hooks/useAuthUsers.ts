import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  id: string;
  email: string | undefined;
  phone: string | undefined;
  created_at: string;
  last_sign_in_at: string | undefined;
  email_confirmed_at: string | undefined;
  phone_confirmed_at: string | undefined;
  app_metadata: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };
  user_metadata: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

export const useAuthUsers = () => {
  return useQuery<AuthUser[], Error>({
    queryKey: ['auth-users'],
    queryFn: async () => {
      console.log('🔍 Fetching all authentication users...');
      
      try {
        // Note: This requires admin privileges and service role key
        // In production, this should be done through a secure backend API
        const { data, error } = await supabase.auth.admin.listUsers();

        if (error) {
          console.error('Error fetching authentication users:', error);
          throw new Error(`Failed to fetch authentication users: ${error.message}`);
        }

        const users: AuthUser[] = data.users.map(user => ({
          id: user.id,
          email: user.email,
          phone: user.phone,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          phone_confirmed_at: user.phone_confirmed_at,
          app_metadata: user.app_metadata,
          user_metadata: user.user_metadata,
        }));

        console.log(`✅ Successfully fetched ${users.length} authentication users`);
        return users;
      } catch (error) {
        console.error('Error in useAuthUsers:', error);
        // Fallback: try to get users from profiles table if admin access fails
        console.log('🔄 Falling back to profiles table...');
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Convert profiles to AuthUser format
        const fallbackUsers: AuthUser[] = (profiles || []).map(profile => ({
          id: profile.id,
          email: profile.email,
          phone: profile.phone,
          created_at: profile.created_at,
          last_sign_in_at: profile.last_seen_at,
          email_confirmed_at: profile.created_at, // Assume confirmed if profile exists
          phone_confirmed_at: undefined,
          app_metadata: {
            provider: 'email',
            providers: ['email']
          },
          user_metadata: {
            full_name: profile.full_name,
            name: profile.full_name,
            avatar_url: profile.avatar_url
          }
        }));

        console.log(`✅ Fallback: Fetched ${fallbackUsers.length} users from profiles table`);
        return fallbackUsers;
      }
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}; 