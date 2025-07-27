import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DebugAuth: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const handleForceRedirect = () => {
    if (user && (!profile || !profile.role)) {
      navigate('/user-type-selection');
    } else if (user && profile && profile.role) {
      navigate(profile.role === 'school' ? '/school-dashboard' : '/teacher-dashboard');
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-sm">🔍 Auth Debug</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Loading:</strong> {loading ? '🔄 Yes' : '✅ No'}
        </div>
        <div>
          <strong>User:</strong> {user ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || 'N/A'}
        </div>
        <div>
          <strong>Profile:</strong> {profile ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>Role:</strong> {profile?.role || 'N/A'}
        </div>
        <div>
          <strong>Name:</strong> {profile?.full_name || 'N/A'}
        </div>
        <Button 
          onClick={handleForceRedirect} 
          size="sm" 
          className="w-full mt-2"
        >
          Force Redirect
        </Button>
      </CardContent>
    </Card>
  );
};

export default DebugAuth; 