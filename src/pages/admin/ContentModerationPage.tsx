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
  AlertTriangle,
  Calendar,
  Mail,
  User,
  Briefcase,
  Flag,
  Shield,
  MessageSquare
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReportedContent {
  id: string;
  content_type: 'profile' | 'vacancy' | 'comment' | 'message';
  content_id: string;
  reported_by: string;
  reported_at: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  admin_notes?: string;
  content_title: string;
  content_owner: string;
}

interface ProfileForModeration {
  id: string;
  user_name: string;
  user_email: string;
  role: 'teacher' | 'school';
  created_at: string;
  last_updated: string;
  status: 'active' | 'flagged' | 'suspended';
  flag_count: number;
  bio?: string;
  avatar_url?: string;
}

interface VacancyForModeration {
  id: string;
  title: string;
  school_name: string;
  created_at: string;
  status: 'active' | 'flagged' | 'suspended';
  flag_count: number;
  description: string;
  contact_email: string;
}

const ContentModerationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'flagged' | 'suspended'>('all');

  // Mock data for content moderation
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([
    {
      id: '1',
      content_type: 'profile',
      content_id: 'profile1',
      reported_by: 'user@email.com',
      reported_at: '2024-01-20T14:30:00Z',
      reason: 'Inappropriate content in bio',
      status: 'pending',
      content_title: 'Teacher Profile - Anna Ivanova',
      content_owner: 'anna.ivanova@email.com'
    },
    {
      id: '2',
      content_type: 'vacancy',
      content_id: 'vacancy1',
      reported_by: 'teacher@email.com',
      reported_at: '2024-01-19T16:45:00Z',
      reason: 'Misleading job description',
      status: 'reviewed',
      admin_notes: 'Reviewed and found to be accurate',
      content_title: 'Math Teacher Position',
      content_owner: 'school@email.com'
    }
  ]);

  const [profilesForModeration, setProfilesForModeration] = useState<ProfileForModeration[]>([
    {
      id: '1',
      user_name: 'Анна Иванова',
      user_email: 'anna.ivanova@email.com',
      role: 'teacher',
      created_at: '2024-01-15T10:30:00Z',
      last_updated: '2024-01-20T14:45:00Z',
      status: 'flagged',
      flag_count: 2,
      bio: 'Experienced teacher with 5 years of experience...'
    },
    {
      id: '2',
      user_name: 'Мария Петрова',
      user_email: 'maria.petrova@email.com',
      role: 'teacher',
      created_at: '2024-01-10T09:15:00Z',
      last_updated: '2024-01-19T16:20:00Z',
      status: 'active',
      flag_count: 0,
      bio: 'Dedicated educator passionate about student success...'
    }
  ]);

  const [vacanciesForModeration, setVacanciesForModeration] = useState<VacancyForModeration[]>([
    {
      id: '1',
      title: 'Math Teacher Position',
      school_name: 'Средняя школа №1',
      created_at: '2024-01-18T11:20:00Z',
      status: 'flagged',
      flag_count: 1,
      description: 'We are looking for an experienced math teacher...',
      contact_email: 'hr@school1.kg'
    },
    {
      id: '2',
      title: 'English Teacher Needed',
      school_name: 'Гимназия №2',
      created_at: '2024-01-17T13:45:00Z',
      status: 'active',
      flag_count: 0,
      description: 'Join our team as an English teacher...',
      contact_email: 'jobs@gymnasium2.kg'
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Активен</Badge>;
      case 'flagged':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">
          <Flag className="w-3 h-3 mr-1" />
          Отмечен
        </Badge>;
      case 'suspended':
        return <Badge variant="destructive">Приостановлен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Ожидает
        </Badge>;
      case 'reviewed':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Eye className="w-3 h-3 mr-1" />
          Просмотрен
        </Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Решен
        </Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const handleSuspendProfile = (profileId: string) => {
    setProfilesForModeration(prev => prev.map(profile => 
      profile.id === profileId 
        ? { ...profile, status: 'suspended' as const }
        : profile
    ));
  };

  const handleActivateProfile = (profileId: string) => {
    setProfilesForModeration(prev => prev.map(profile => 
      profile.id === profileId 
        ? { ...profile, status: 'active' as const }
        : profile
    ));
  };

  const handleSuspendVacancy = (vacancyId: string) => {
    setVacanciesForModeration(prev => prev.map(vacancy => 
      vacancy.id === vacancyId 
        ? { ...vacancy, status: 'suspended' as const }
        : vacancy
    ));
  };

  const handleActivateVacancy = (vacancyId: string) => {
    setVacanciesForModeration(prev => prev.map(vacancy => 
      vacancy.id === vacancyId 
        ? { ...vacancy, status: 'active' as const }
        : vacancy
    ));
  };

  const filteredProfiles = profilesForModeration.filter(profile => {
    const matchesSearch = profile.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || profile.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredVacancies = vacanciesForModeration.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vacancy.school_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || vacancy.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredReports = reportedContent.filter(report => {
    const matchesSearch = report.content_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.content_owner.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Content Moderation</h1>
                <p className="text-sm text-gray-500">Monitor and moderate platform content</p>
              </div>
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
              <CardTitle className="text-sm font-medium">Flagged Profiles</CardTitle>
              <User className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {profilesForModeration.filter(p => p.status === 'flagged').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Vacancies</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {vacanciesForModeration.filter(v => v.status === 'flagged').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Flag className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {reportedContent.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended Content</CardTitle>
              <Ban className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {profilesForModeration.filter(p => p.status === 'suspended').length + 
                 vacanciesForModeration.filter(v => v.status === 'suspended').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Moderation Tabs */}
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Review Profiles</span>
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span>Moderate Vacancies</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Flag className="w-4 h-4" />
              <span>Reported Content</span>
            </TabsTrigger>
          </TabsList>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Moderation</CardTitle>
                <CardDescription>
                  Review and moderate user profiles for inappropriate content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search profiles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterStatus === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === 'flagged' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('flagged')}
                    >
                      Flagged
                    </Button>
                    <Button
                      variant={filterStatus === 'suspended' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus('suspended')}
                    >
                      Suspended
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{profile.user_name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {profile.user_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {profile.role === 'teacher' ? 'Учитель' : 'Школа'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(profile.status)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={profile.flag_count > 0 ? 'destructive' : 'secondary'}>
                            {profile.flag_count}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(profile.last_updated)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" title="View Profile">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit Profile">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {profile.status === 'active' || profile.status === 'flagged' ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600"
                                onClick={() => handleSuspendProfile(profile.id)}
                                title="Suspend Profile"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600"
                                onClick={() => handleActivateProfile(profile.id)}
                                title="Activate Profile"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vacancies Tab */}
          <TabsContent value="vacancies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Vacancy Moderation</CardTitle>
                <CardDescription>
                  Review and moderate job vacancies for accuracy and appropriateness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vacancy</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVacancies.map((vacancy) => (
                      <TableRow key={vacancy.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{vacancy.title}</div>
                            <div className="text-sm text-gray-500">{vacancy.school_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {vacancy.contact_email}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(vacancy.status)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={vacancy.flag_count > 0 ? 'destructive' : 'secondary'}>
                            {vacancy.flag_count}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{formatDate(vacancy.created_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" title="View Vacancy">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit Vacancy">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {vacancy.status === 'active' || vacancy.status === 'flagged' ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600"
                                onClick={() => handleSuspendVacancy(vacancy.id)}
                                title="Suspend Vacancy"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600"
                                onClick={() => handleActivateVacancy(vacancy.id)}
                                title="Activate Vacancy"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reported Content</CardTitle>
                <CardDescription>
                  Review content that has been reported by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.content_title}</div>
                            <div className="text-sm text-gray-500">{report.content_owner}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {report.content_type === 'profile' ? 'Профиль' : 
                             report.content_type === 'vacancy' ? 'Вакансия' : 
                             report.content_type === 'comment' ? 'Комментарий' : 'Сообщение'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500">{report.reported_by}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{report.reason}</div>
                        </TableCell>
                        <TableCell>
                          {getReportStatusBadge(report.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" title="Review Content">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Resolve Report">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ContentModerationPage; 