import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'admin_user' | 'support_user';
}

const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children, requiredRole }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const sessionData = localStorage.getItem('admin_session');
        if (!sessionData) {
          navigate('/admin/login');
          return;
        }

        const session = JSON.parse(sessionData);
        
        // Check if session is valid (not expired)
        const loginTime = new Date(session.login_time);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
          // Session expired (24 hours)
          localStorage.removeItem('admin_session');
          navigate('/admin/login');
          return;
        }

        // Check role permissions if required
        if (requiredRole) {
          const roleHierarchy = {
            'super_admin': 3,
            'admin_user': 2,
            'support_user': 1
          };
          
          const userRoleLevel = roleHierarchy[session.role as keyof typeof roleHierarchy] || 0;
          const requiredRoleLevel = roleHierarchy[requiredRole];
          
          if (userRoleLevel < requiredRoleLevel) {
            navigate('/admin/login');
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking admin auth:', error);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};

export default AdminRouteGuard; 