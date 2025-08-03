import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CertificateSubmission {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  certificate_type: 'diploma' | 'license' | 'honor' | 'certification' | 'other';
  certificate_url: string;
  file_name: string;
  file_size: string;
  submitted_at: string;
  verified_by?: string;
  verified_at?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  document_title: string;
  issuing_institution?: string;
  issue_date?: string;
  expiry_date?: string;
}

export interface CreateCertificateSubmission {
  user_id: string;
  user_email: string;
  user_name: string;
  certificate_type: 'diploma' | 'license' | 'honor' | 'certification' | 'other';
  certificate_url: string;
  file_name: string;
  file_size: string;
  document_title: string;
  issuing_institution?: string;
  issue_date?: string;
  expiry_date?: string;
}

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: async (): Promise<CertificateSubmission[]> => {
      console.log('📋 Fetching certificate submissions...');
      
      try {
        // For now, use localStorage since certificates table doesn't exist yet
        const storedCertificates = localStorage.getItem('certificate_submissions');
        if (storedCertificates) {
          const parsedCertificates = JSON.parse(storedCertificates);
          console.log(`✅ Found ${parsedCertificates.length} certificates in localStorage`);
          return parsedCertificates;
        }
        
        // If no certificates exist, return empty array
        console.log('No certificates found');
        return [];
      } catch (error) {
        console.error('Error fetching certificates:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useCreateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (certificate: CreateCertificateSubmission): Promise<CertificateSubmission> => {
      console.log('📋 Creating certificate submission:', certificate);
      
      const newCertificate: CertificateSubmission = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...certificate,
        submitted_at: new Date().toISOString(),
        status: 'pending',
      };

      try {
        // For now, save to localStorage since certificates table doesn't exist yet
        const existingCertificates = localStorage.getItem('certificate_submissions');
        const certificates = existingCertificates ? JSON.parse(existingCertificates) : [];
        certificates.push(newCertificate);
        localStorage.setItem('certificate_submissions', JSON.stringify(certificates));
        
        console.log('✅ Certificate saved to localStorage');
        return newCertificate;
      } catch (error) {
        console.error('Error creating certificate:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      certificateId, 
      updates 
    }: { 
      certificateId: string; 
      updates: Partial<CertificateSubmission> 
    }): Promise<CertificateSubmission> => {
      console.log('📋 Updating certificate:', certificateId, updates);
      
      try {
        // For now, update in localStorage since certificates table doesn't exist yet
        const existingCertificates = localStorage.getItem('certificate_submissions');
        const certificates = existingCertificates ? JSON.parse(existingCertificates) : [];
        const updatedCertificates = certificates.map((cert: CertificateSubmission) => 
          cert.id === certificateId 
            ? { 
                ...cert, 
                ...updates,
                verified_at: updates.status !== 'pending' ? new Date().toISOString() : cert.verified_at
              }
            : cert
        );
        localStorage.setItem('certificate_submissions', JSON.stringify(updatedCertificates));
        const updatedCertificate = updatedCertificates.find((cert: CertificateSubmission) => cert.id === certificateId);
        
        console.log('✅ Certificate updated in localStorage');
        return updatedCertificate!;
      } catch (error) {
        console.error('Error updating certificate:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useCertificateStats = () => {
  return useQuery({
    queryKey: ['certificate-stats'],
    queryFn: async () => {
      const storedCertificates = localStorage.getItem('certificate_submissions');
      const certificates = storedCertificates ? JSON.parse(storedCertificates) : [];
      
      return {
        total: certificates.length,
        pending: certificates.filter((c: CertificateSubmission) => c.status === 'pending').length,
        approved: certificates.filter((c: CertificateSubmission) => c.status === 'approved').length,
        rejected: certificates.filter((c: CertificateSubmission) => c.status === 'rejected').length,
      };
    },
  });
}; 