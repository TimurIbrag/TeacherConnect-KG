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
        // First, let's check if we can access the profiles table at all
        console.log('🔍 Checking profiles table access...');
        
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        console.log('📊 Raw profiles data:', profiles);
        console.log('❌ Any errors:', error);

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
          is_active: profile.is_active ?? true, // Use actual value from database
          profile_complete: profile.is_profile_complete ?? !!(profile.full_name && profile.full_name.trim() !== '' && profile.role),
          certificates_verified: profile.verification_status === 'verified',
          reported_count: 0, // Would come from reports table
          avatar_url: profile.avatar_url,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          experience_years: profile.experience_years,
          education: profile.education,
          skills: profile.skills || [],
          languages: profile.languages ? (Array.isArray(profile.languages) ? profile.languages.map(lang => typeof lang === 'string' ? lang : String(lang)) : []) : [],
          availability: profile.availability,
          hourly_rate: profile.hourly_rate,
          school_name: profile.school_name,
          school_type: profile.school_type,
          school_address: profile.school_address,
          school_website: profile.school_website,
          school_description: profile.school_description,
          school_size: profile.school_size,
          school_levels: profile.school_levels || [],
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
        // Start with basic fields that definitely exist
        const safeUpdates: any = {
          updated_at: new Date().toISOString()
        };

        // Always safe to update these basic fields
        if (updates.full_name !== undefined) safeUpdates.full_name = updates.full_name;
        if (updates.phone !== undefined) safeUpdates.phone = updates.phone;
        if (updates.role !== undefined) safeUpdates.role = updates.role;

        // Try to update extended fields, but don't fail if they don't exist
        const extendedFields = [
          'is_active', 'bio', 'experience_years', 'education', 'skills', 'languages', 
          'availability', 'hourly_rate', 'location', 'specialization', 'available', 
          'date_of_birth', 'certificates', 'cv_url', 'resume_url', 'schedule_details', 
          'is_profile_complete', 'is_published', 'verification_documents', 
          'verification_status', 'view_count', 'school_name', 'school_type', 
          'school_address', 'school_website', 'school_description', 'school_size', 
          'school_levels', 'facilities', 'founded_year', 'housing_provided', 
          'latitude', 'longitude', 'location_verified', 'photo_urls', 
          'student_count', 'website_url'
        ];

        extendedFields.forEach(field => {
          if (updates[field as keyof UpdateUserData] !== undefined) {
            safeUpdates[field] = updates[field as keyof UpdateUserData];
          }
        });

        console.log('🔧 Safe updates to apply:', safeUpdates);

        const { data, error } = await supabase
          .from('profiles')
          .update(safeUpdates)
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('❌ Error updating user:', error);
          
          // If the error is due to missing columns, try with only basic fields
          if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
            console.log('🔄 Retrying with basic fields only...');
            
            const basicUpdates = {
              full_name: updates.full_name,
              phone: updates.phone,
              role: updates.role,
              updated_at: new Date().toISOString()
            };

            const { data: basicData, error: basicError } = await supabase
              .from('profiles')
              .update(basicUpdates)
              .eq('id', userId)
              .select()
              .single();

            if (basicError) {
              console.error('❌ Error updating basic fields:', basicError);
              throw basicError;
            }

            console.log('✅ Basic fields updated successfully:', basicData);
            
            // Return basic data structure
            return {
              id: basicData.id,
              email: basicData.email || '',
              full_name: basicData.full_name || '',
              role: basicData.role as 'teacher' | 'school',
              created_at: basicData.created_at,
              last_seen_at: basicData.last_seen_at || '',
              is_active: true,
              profile_complete: !!(basicData.full_name && basicData.full_name.trim() !== '' && basicData.role),
              certificates_verified: false,
              reported_count: 0,
              avatar_url: basicData.avatar_url,
              phone: basicData.phone,
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
          }
          
          throw error;
        }

        console.log('✅ User updated successfully:', data);
        
        // Return the updated data in the same format as useUserManagement
        return {
          id: data.id,
          email: data.email || '',
          full_name: data.full_name || '',
          role: data.role as 'teacher' | 'school',
          created_at: data.created_at,
          last_seen_at: data.last_seen_at || '',
          is_active: data.is_active ?? true,
          profile_complete: data.is_profile_complete ?? !!(data.full_name && data.full_name.trim() !== '' && data.role),
          certificates_verified: data.verification_status === 'verified',
          reported_count: 0,
          avatar_url: data.avatar_url,
          phone: data.phone,
          location: data.location,
          bio: data.bio,
          experience_years: data.experience_years,
          education: data.education,
          skills: data.skills || [],
          languages: data.languages ? (Array.isArray(data.languages) ? data.languages.map(lang => typeof lang === 'string' ? lang : String(lang)) : []) : [],
          availability: data.availability,
          hourly_rate: data.hourly_rate,
          school_name: data.school_name,
          school_type: data.school_type,
          school_address: data.school_address,
          school_website: data.school_website,
          school_description: data.school_description,
          school_size: data.school_size,
          school_levels: data.school_levels || [],
        };

      } catch (error) {
        console.error('❌ Error in useUpdateUser:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user-management'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      console.log('🔄 User management queries invalidated');
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