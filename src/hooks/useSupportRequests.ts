import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SupportRequest {
  id: string;
  user_id?: string;
  user_email: string;
  user_name: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  assigned_to?: string;
  resolved_at?: string;
  admin_notes?: string;
}

export interface CreateSupportRequest {
  user_email: string;
  user_name: string;
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export const useSupportRequests = () => {
  return useQuery({
    queryKey: ['support-requests'],
    queryFn: async (): Promise<SupportRequest[]> => {
      console.log('📞 Fetching support requests...');
      
      // For now, we'll use localStorage to simulate a database
      // In production, this would be a Supabase table
      const storedRequests = localStorage.getItem('support_requests');
      if (storedRequests) {
        return JSON.parse(storedRequests);
      }
      return [];
    },
  });
};

export const useCreateSupportRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: CreateSupportRequest): Promise<SupportRequest> => {
      console.log('📝 Creating support request:', request);
      
      const newRequest: SupportRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_email: request.user_email,
        user_name: request.user_name,
        subject: request.subject,
        message: request.message,
        priority: request.priority || 'medium',
        status: 'open',
        created_at: new Date().toISOString(),
      };

      // Store in localStorage (simulating database)
      const existingRequests = localStorage.getItem('support_requests');
      const requests = existingRequests ? JSON.parse(existingRequests) : [];
      requests.push(newRequest);
      localStorage.setItem('support_requests', JSON.stringify(requests));

      return newRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useUpdateSupportRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<SupportRequest> 
    }): Promise<SupportRequest> => {
      console.log('📝 Updating support request:', id, updates);
      
      // Update in localStorage
      const existingRequests = localStorage.getItem('support_requests');
      const requests: SupportRequest[] = existingRequests ? JSON.parse(existingRequests) : [];
      
      const requestIndex = requests.findIndex(req => req.id === id);
      if (requestIndex === -1) {
        throw new Error('Support request not found');
      }

      const updatedRequest = {
        ...requests[requestIndex],
        ...updates,
        resolved_at: updates.status === 'resolved' ? new Date().toISOString() : requests[requestIndex].resolved_at
      };

      requests[requestIndex] = updatedRequest;
      localStorage.setItem('support_requests', JSON.stringify(requests));

      return updatedRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-requests'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useSupportRequestStats = () => {
  return useQuery({
    queryKey: ['support-request-stats'],
    queryFn: async () => {
      const storedRequests = localStorage.getItem('support_requests');
      const requests: SupportRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
      
      return {
        total: requests.length,
        open: requests.filter(req => req.status === 'open').length,
        in_progress: requests.filter(req => req.status === 'in_progress').length,
        resolved: requests.filter(req => req.status === 'resolved').length,
        closed: requests.filter(req => req.status === 'closed').length,
        high_priority: requests.filter(req => req.priority === 'high').length,
        medium_priority: requests.filter(req => req.priority === 'medium').length,
        low_priority: requests.filter(req => req.priority === 'low').length,
      };
    },
  });
}; 