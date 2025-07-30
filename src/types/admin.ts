export type AdminRole = 'super_admin' | 'admin_user' | 'support_user';

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: AdminRole;
  full_name: string;
  is_active: boolean;
  created_at: string;
  last_login: string;
  permissions: AdminPermission[];
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface AdminStats {
  total_teachers: number;
  total_schools: number;
  total_vacancies: number;
  total_applications: number;
  new_registrations_today: number;
  active_users_this_week: number;
  pending_certificates: number;
  pending_support_requests: number;
}

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
}

export interface CertificateVerification {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  certificate_type: string;
  certificate_url: string;
  submitted_at: string;
  verified_by?: string;
  verified_at?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface SupportRequest {
  id: string;
  user_id: string;
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

export interface AdminChatMessage {
  id: string;
  support_request_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
} 