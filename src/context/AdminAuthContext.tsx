import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminUser, AdminRole, AdminPermission } from '../types/admin';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: AdminRole) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const adminSession = localStorage.getItem('admin_session');
        if (adminSession) {
          const sessionData = JSON.parse(adminSession);
          const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', sessionData.admin_id)
            .eq('is_active', true)
            .single();

          if (error || !data) {
            localStorage.removeItem('admin_session');
            setAdminUser(null);
          } else {
            setAdminUser(data);
          }
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
        localStorage.removeItem('admin_session');
      } finally {
        setLoading(false);
      }
    };

    checkAdminSession();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Query admin users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'Invalid credentials' };
      }

      // In a real app, you'd hash and compare passwords
      // For now, we'll use a simple check (replace with proper auth)
      if (data.password !== password) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.id);

      // Store session
      const sessionData = {
        admin_id: data.id,
        username: data.username,
        role: data.role,
        login_time: new Date().toISOString()
      };
      localStorage.setItem('admin_session', JSON.stringify(sessionData));

      setAdminUser(data);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('admin_session');
    setAdminUser(null);
  };

  const hasPermission = (resource: string, action: string): boolean => {
    if (!adminUser) return false;
    
    // Super admin has all permissions
    if (adminUser.role === 'super_admin') return true;
    
    // Check specific permissions based on role
    const permissions = getRolePermissions(adminUser.role);
    return permissions.some(p => p.resource === resource && p.action === action);
  };

  const hasRole = (role: AdminRole): boolean => {
    return adminUser?.role === role;
  };

  const getRolePermissions = (role: AdminRole): AdminPermission[] => {
    const permissions: Record<AdminRole, AdminPermission[]> = {
      super_admin: [
        { id: '1', name: 'Full Platform Control', description: 'Complete platform access', resource: '*', action: '*' },
        { id: '2', name: 'User Management', description: 'Manage all users', resource: 'users', action: '*' },
        { id: '3', name: 'Statistics View', description: 'View all statistics', resource: 'statistics', action: 'read' },
        { id: '4', name: 'Certificate Verification', description: 'Verify certificates', resource: 'certificates', action: '*' },
        { id: '5', name: 'Support Management', description: 'Manage support requests', resource: 'support', action: '*' },
      ],
      admin_user: [
        { id: '6', name: 'User Management', description: 'Manage users', resource: 'users', action: 'read' },
        { id: '7', name: 'User Profile Edit', description: 'Edit user profiles', resource: 'users', action: 'update' },
        { id: '8', name: 'Statistics View', description: 'View statistics', resource: 'statistics', action: 'read' },
        { id: '9', name: 'Certificate Verification', description: 'Verify certificates', resource: 'certificates', action: 'update' },
        { id: '10', name: 'Content Moderation', description: 'Moderate content', resource: 'content', action: 'moderate' },
      ],
      support_user: [
        { id: '11', name: 'Support Management', description: 'Manage support requests', resource: 'support', action: '*' },
        { id: '12', name: 'Statistics View', description: 'View user statistics', resource: 'statistics', action: 'read' },
        { id: '13', name: 'Certificate Approval', description: 'Approve certificates', resource: 'certificates', action: 'approve' },
        { id: '14', name: 'User Chat', description: 'Chat with users', resource: 'chat', action: '*' },
      ]
    };

    return permissions[role] || [];
  };

  const value: AdminAuthContextType = {
    adminUser,
    loading,
    isAuthenticated: !!adminUser,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 