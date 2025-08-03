import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  School, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Shield,
  LogOut,
  UserCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import UserManagementTab from '@/components/admin/UserManagementTab';
import SupportManagementTab from '@/components/admin/SupportManagementTab';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useSupportRequestStats } from '@/hooks/useSupportRequests';

interface AdminSession {
  admin_id: string;
  username: string;
  role: 'super_admin' | 'admin_user' | 'support_user';
  full_name: string;
  login_time: string;
}

const AdminDashboardPage: React.FC = () => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const { data: adminStats, isLoading: statsLoading } = useAdminStats();
  const { data: supportStats } = useSupportRequestStats();
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin session
    const sessionData = localStorage.getItem('admin_session');
    if (!sessionData) {
      navigate('/admin/login');
      return;
    }

    try {
      const session = JSON.parse(sessionData);
      setAdminSession(session);
      
      // Statistics are now loaded via useAdminStats hook
    } catch (error) {
      console.error('Error parsing admin session:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  const handleNavigateToCertificates = () => {
    navigate('/admin/certificates');
  };

  const handleNavigateToModeration = () => {
    navigate('/admin/moderation');
  };

  const handleNavigateToUsers = () => {
    navigate('/admin/users');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin_user': return 'bg-blue-100 text-blue-800';
      case 'support_user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Administrator';
      case 'admin_user': return 'Platform Administrator';
      case 'support_user': return 'Support Specialist';
      default: return role;
    }
  };

  if (!adminSession) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">TeacherConnect KG Administration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminSession.full_name}</p>
                <Badge className={getRoleBadgeColor(adminSession.role)}>
                  {getRoleDisplayName(adminSession.role)}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.total_teachers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{adminStats?.new_registrations_today || 0} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.total_schools || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active institutions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vacancies</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.total_vacancies || 0}</div>
              <p className="text-xs text-muted-foreground">
                {adminStats?.total_applications || 0} applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.active_users_this_week || 0}</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Pending Certificates</span>
                <Badge variant="secondary">{adminStats?.pending_certificates || 0}</Badge>
              </CardTitle>
              <CardDescription>
                Certificates awaiting verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleNavigateToCertificates}
              >
                Review Certificates
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Support Requests</span>
                <Badge variant="secondary">{supportStats?.open || 0}</Badge>
              </CardTitle>
              <CardDescription>
                User support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
              >
                View Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Moderation</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  Key metrics and recent activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Recent Activity</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>5 new teacher registrations today</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>3 new school registrations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span>2 pending certificate verifications</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleNavigateToUsers}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View All Users
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleNavigateToCertificates}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Review Certificates
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Support Requests
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserManagementTab />
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Monitor and moderate platform content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      onClick={handleNavigateToModeration}
                    >
                      Review Profiles
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleNavigateToModeration}
                    >
                      Moderate Vacancies
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleNavigateToModeration}
                    >
                      Reported Content
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    {adminSession.role === 'super_admin' || adminSession.role === 'admin_user'
                      ? 'You can edit user profiles, moderate content, and ensure platform safety.'
                      : 'Content moderation is limited to super admins and admin users.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <SupportManagementTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboardPage; 