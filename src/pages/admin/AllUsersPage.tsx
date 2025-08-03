import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle,
  Calendar,
  Mail,
  User,
  Phone,
  Shield,
  Clock,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Plus,
  MoreHorizontal,
  Download,
  Copy
} from 'lucide-react';
import { useAuthUsers, AuthUser } from '@/hooks/useAuthUsers';
import { useNavigate } from 'react-router-dom';

const AllUsersPage: React.FC = () => {
  const { data: users = [], isLoading, error, refetch } = useAuthUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState<'all' | 'google' | 'email'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'unconfirmed'>('all');
  const navigate = useNavigate();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProviderBadge = (providers: string[]) => {
    if (providers.includes('google')) {
      return <Badge variant="default" className="bg-blue-100 text-blue-800">Google</Badge>;
    }
    return <Badge variant="secondary">Email</Badge>;
  };

  const getStatusBadge = (emailConfirmed: string | undefined) => {
    if (emailConfirmed) {
      return <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Confirmed
      </Badge>;
    }
    return <Badge variant="outline" className="text-yellow-600 border-yellow-600">
      <AlertTriangle className="w-3 h-3 mr-1" />
      Unconfirmed
    </Badge>;
  };

  const getDisplayName = (user: AuthUser) => {
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Unknown User';
  };

  const getAvatarInitial = (user: AuthUser) => {
    const name = getDisplayName(user);
    return name.charAt(0).toUpperCase();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = filterProvider === 'all' || 
                           (filterProvider === 'google' && user.app_metadata?.providers?.includes('google')) ||
                           (filterProvider === 'email' && (!user.app_metadata?.providers || user.app_metadata.providers.includes('email')));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'confirmed' && user.email_confirmed_at) ||
                         (filterStatus === 'unconfirmed' && !user.email_confirmed_at);
    
    return matchesSearch && matchesProvider && matchesStatus;
  });

  const confirmedUsers = users.filter(u => u.email_confirmed_at).length;
  const unconfirmedUsers = users.filter(u => !u.email_confirmed_at).length;
  const googleUsers = users.filter(u => u.app_metadata?.providers?.includes('google')).length;
  const emailUsers = users.filter(u => !u.app_metadata?.providers?.includes('google')).length;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Users</CardTitle>
            <CardDescription>
              Failed to load authentication users. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">All Authentication Users</h1>
                <p className="text-sm text-gray-500">Complete list of all registered users</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{confirmedUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Google Users</CardTitle>
              <ExternalLink className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{googleUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Users</CardTitle>
              <Mail className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{emailUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Search and filter all authentication users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, or UID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterProvider === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterProvider('all')}
                >
                  All Providers
                </Button>
                <Button
                  variant={filterProvider === 'google' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterProvider('google')}
                >
                  Google
                </Button>
                <Button
                  variant={filterProvider === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterProvider('email')}
                >
                  Email
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All Status
                </Button>
                <Button
                  variant={filterStatus === 'confirmed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('confirmed')}
                >
                  Confirmed
                </Button>
                <Button
                  variant={filterStatus === 'unconfirmed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('unconfirmed')}
                >
                  Unconfirmed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading users...</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {getAvatarInitial(user)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{getDisplayName(user)}</div>
                            <div className="text-sm text-gray-500 font-mono">
                              {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email || 'No email'}</span>
                          {user.email && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(user.email!)}
                              title="Copy email"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.phone || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getProviderBadge(user.app_metadata?.providers || [])}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.email_confirmed_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDate(user.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{formatDate(user.last_sign_in_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            title="View User Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            title="More Actions"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {!isLoading && filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AllUsersPage; 