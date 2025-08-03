import { useQuery } from '@tanstack/react-query';

export interface CertificateStatus {
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'none';
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface CertificateStatusData {
  [userId: string]: CertificateStatus;
}

export const useCertificateStatus = () => {
  return useQuery({
    queryKey: ['certificate-status'],
    queryFn: async (): Promise<CertificateStatusData> => {
      // Get certificate submissions from localStorage (temporary)
      const storedCertificates = localStorage.getItem('certificate_submissions');
      const certificates = storedCertificates ? JSON.parse(storedCertificates) : [];
      
      const statusData: CertificateStatusData = {};
      
      // Process certificate data
      certificates.forEach((cert: any) => {
        statusData[cert.user_id] = {
          user_id: cert.user_id,
          status: cert.status,
          submitted_at: cert.submitted_at,
          reviewed_at: cert.verified_at,
          reviewed_by: cert.verified_by,
          notes: cert.notes
        };
      });
      
      return statusData;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
};

export const useUserCertificateStatus = (userId: string) => {
  const { data: certificateData } = useCertificateStatus();
  return certificateData?.[userId] || { user_id: userId, status: 'none' };
}; 