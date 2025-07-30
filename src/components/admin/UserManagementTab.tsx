import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MoreHorizontal, 
  Edit, 
  Eye, 
  Ban, 
  CheckCircle,
  AlertTriangle,
  Calendar,
  Mail,
  User,
  School
} from 'lucide-react';
import { UserManagementData } from '@/types/admin';

const UserManagementTab: React.FC = () => {
  const [teachers, setTeachers] = useState<UserManagementData[]>([]);
  const [schools, setSchools] = useState<UserManagementData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'teacher' | 'school'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data (in real app, fetch from API)
    const mockTeachers: UserManagementData[] = [
      {
        id: '1',
        email: 'anna.ivanova@email.com',
        full_name: 'Анна Иванова',
        role: 'teacher',
        created_at: '2024-01-15T10:30:00Z',
        last_seen_at: '2024-01-20T14:45:00Z',
        is_active: true,
        profile_complete: true,
        certificates_verified: true,
        reported_count: 0
      },
      {
        id: '2',
        email: 'maria.petrova@email.com',
        full_name: 'Мария Петрова',
        role: 'teacher',
        created_at: '2024-01-10T09:15:00Z',
        last_seen_at: '2024-01-19T16:20:00Z',
        is_active: true,
        profile_complete: false,
        certificates_verified: false,
        reported_count: 1
      },
      {
        id: '3',
        email: 'dmitry.sidorov@email.com',
        full_name: 'Дмитрий Сидоров',
        role: 'teacher',
        created_at: '2024-01-05T11:45:00Z',
        last_seen_at: '2024-01-18T12:30:00Z',
        is_active: false,
        profile_complete: true,
        certificates_verified: true,
        reported_count: 0
      }
    ];

    const mockSchools: UserManagementData[] = [
      {
        id: '4',
        email: 'school1@email.com',
        full_name: 'Средняя школа №1',
        role: 'school',
        created_at: '2024-01-12T08:00:00Z',
        last_seen_at: '2024-01-20T17:30:00Z',
        is_active: true,
        profile_complete: true,
        certificates_verified: true,
        reported_count: 0
      },
      {
        id: '5',
        email: 'school2@email.com',
        full_name: 'Гимназия №2',
        role: 'school',
        created_at: '2024-01-08T13:20:00Z',
        last_seen_at: '2024-01-19T15:45:00Z',
        is_active: true,
        profile_complete: false,
        certificates_verified: false,
        reported_count: 2
      }
    ];

    setTeachers(mockTeachers);
    setSchools(mockSchools);
    setLoading(false);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (user: UserManagementData) => {
    if (!user.is_active) {
      return <Badge variant="destructive">Неактивен</Badge>;
    }
    if (!user.profile_complete) {
      return <Badge variant="secondary">Неполный профиль</Badge>;
    }
    if (user.reported_count > 0) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">
        Жалобы ({user.reported_count})
      </Badge>;
    }
    return <Badge variant="default">Активен</Badge>;
  };

  const getCertificateBadge = (verified: boolean) => {
    return verified ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Подтверждены
      </Badge>
    ) : (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Ожидают
      </Badge>
    );
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && teacher.is_active) ||
                         (filterStatus === 'inactive' && !teacher.is_active);
    return matchesSearch && matchesStatus;
  });

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && school.is_active) ||
                         (filterStatus === 'inactive' && !school.is_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
          <CardDescription>
            Просмотр и управление учителями и школами на платформе
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по имени или email..."
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
                Все
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
              >
                Активные
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('inactive')}
              >
                Неактивные
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Tabs defaultValue="teachers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teachers" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Учителя ({filteredTeachers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center space-x-2">
            <School className="w-4 h-4" />
            <span>Школы ({filteredSchools.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Список учителей</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Сертификаты</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{teacher.full_name}</div>
                          <div className="text-sm text-gray-500">ID: {teacher.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{teacher.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(teacher.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{formatDate(teacher.last_seen_at)}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(teacher)}
                      </TableCell>
                      <TableCell>
                        {getCertificateBadge(teacher.certificates_verified)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {teacher.is_active ? (
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-green-600">
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

        <TabsContent value="schools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Список школ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Школа</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Дата регистрации</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Сертификаты</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{school.full_name}</div>
                          <div className="text-sm text-gray-500">ID: {school.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{school.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(school.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{formatDate(school.last_seen_at)}</span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(school)}
                      </TableCell>
                      <TableCell>
                        {getCertificateBadge(school.certificates_verified)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {school.is_active ? (
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-green-600">
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
      </Tabs>
    </div>
  );
};

export default UserManagementTab; 