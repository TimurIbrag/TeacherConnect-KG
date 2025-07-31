import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserManagementData {
  id: string;
  email: string;
  full_name: string;
  role: 'teacher' | 'school';
  created_at: string;
  last_seen_at: string;
  is_active: boolean;
  profile_complete: boolean;
  certificates_verified: boolean;
  reported_count: number;
  avatar_url?: string;
  phone?: string;
  location?: string;
  bio?: string;
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
  school_description?: string;
  school_size?: number;
  school_levels?: string[];
}

export interface UpdateUserData {
  full_name?: string;
  role?: 'teacher' | 'school';
  is_active?: boolean;
  phone?: string;
  location?: string;
  bio?: string;
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
  school_description?: string;
  school_size?: number;
  school_levels?: string[];
}

export const useUserManagement = () => {
  return useQuery({
    queryKey: ['user-management'],
    queryFn: async (): Promise<UserManagementData[]> => {
      console.log('👥 Fetching all users for management...');
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }

        // Transform profiles into UserManagementData format
        const users: UserManagementData[] = (profiles || []).map(profile => ({
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name || '',
          role: profile.role as 'teacher' | 'school',
          created_at: profile.created_at,
          last_seen_at: profile.last_seen_at || '',
          is_active: true, // Default to true
          profile_complete: !!(profile.full_name && profile.full_name.trim() !== '' && profile.role),
          certificates_verified: false, // Would come from certificates table
          reported_count: 0, // Would come from reports table
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          location: undefined,
          bio: undefined,
          experience_years: undefined,
          education: undefined,
          skills: [],
          languages: [],
          availability: undefined,
          hourly_rate: undefined,
          school_name: undefined,
          school_type: undefined,
          school_address: undefined,
          school_website: undefined,
          school_description: undefined,
          school_size: undefined,
          school_levels: [],
        }));

        console.log(`👥 Fetched ${users.length} users for management`);
        return users;

      } catch (error) {
        console.error('Error in useUserManagement:', error);
        throw error;
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      updates 
    }: { 
      userId: string; 
      updates: UpdateUserData 
    }): Promise<UserManagementData> => {
      console.log('👥 Updating user:', userId, updates);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating user:', error);
          throw error;
        }

        console.log('✅ User updated successfully:', data);
        return {
          id: data.id,
          email: data.email || '',
          full_name: data.full_name || '',
          role: data.role as 'teacher' | 'school',
          created_at: data.created_at,
          last_seen_at: data.last_seen_at || '',
          is_active: true,
          profile_complete: !!(data.full_name && data.full_name.trim() !== '' && data.role),
          certificates_verified: false,
          reported_count: 0,
          avatar_url: data.avatar_url,
          phone: data.phone,
          location: undefined,
          bio: undefined,
          experience_years: undefined,
          education: undefined,
          skills: [],
          languages: [],
          availability: undefined,
          hourly_rate: undefined,
          school_name: undefined,
          school_type: undefined,
          school_address: undefined,
          school_website: undefined,
          school_description: undefined,
          school_size: undefined,
          school_levels: [],
        };

      } catch (error) {
        console.error('Error in useUpdateUser:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      console.log('🚫 Suspending user:', userId);
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            is_active: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Error suspending user:', error);
          throw error;
        }

        console.log('✅ User suspended successfully');

      } catch (error) {
        console.error('Error in useSuspendUser:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      console.log('✅ Activating user:', userId);
      
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) {
          console.error('Error activating user:', error);
          throw error;
        }

        console.log('✅ User activated successfully');

      } catch (error) {
        console.error('Error in useActivateUser:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      console.log('🗑️ Deleting user:', userId);
      
      try {
        // First, delete related data (applications, etc.)
        const { error: applicationsError } = await supabase
          .from('applications')
          .delete()
          .eq('teacher_id', userId);

        if (applicationsError) {
          console.error('Error deleting user applications:', applicationsError);
        }

        // Delete the profile
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (error) {
          console.error('Error deleting user:', error);
          throw error;
        }

        console.log('✅ User deleted successfully');

      } catch (error) {
        console.error('Error in useDeleteUser:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useUserActivityLog = (userId: string) => {
  return useQuery({
    queryKey: ['user-activity', userId],
    queryFn: async () => {
      console.log('📊 Fetching user activity log:', userId);
      
      // In a real implementation, this would fetch from an activity_logs table
      // For now, we'll return mock data
      return [
        {
          id: '1',
          user_id: userId,
          action: 'profile_updated',
          timestamp: new Date().toISOString(),
          details: 'Updated profile information'
        },
        {
          id: '2',
          user_id: userId,
          action: 'login',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: 'User logged in'
        }
      ];
    },
    enabled: !!userId,
  });
}; 