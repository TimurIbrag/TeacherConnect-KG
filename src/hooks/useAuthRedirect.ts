
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useAuthRedirect = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user && profile) {
      // Check if user needs to complete profile setup
      const needsProfileSetup = !profile.full_name || 
        (profile.role === 'teacher' && !profile.phone) ||
        (profile.role === 'school' && !profile.phone);

      if (needsProfileSetup) {
        // Redirect to profile setup
        if (profile.role === 'teacher') {
          navigate('/teacher-dashboard?setup=true');
        } else if (profile.role === 'school') {
          navigate('/school-dashboard?setup=true');
        }
      } else {
        // Normal redirect based on role
        if (profile.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else if (profile.role === 'school') {
          navigate('/school-dashboard');
        } else {
          navigate('/');
        }
      }
    }
  }, [user, profile, loading, navigate]);

  return { user, profile, loading };
};
