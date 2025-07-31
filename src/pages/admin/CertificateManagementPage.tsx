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
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  Mail,
  User,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CertificateData {
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
  file_name: string;
  file_size: string;
}

const CertificateManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'diploma' | 'certification' | 'license' | 'other'>('all');

  // Mock certificate data (in production, this would come from Supabase)
  const [certificates, setCertificates] = useState<CertificateData[]>([
    {
      id: '1',
      user_id: 'user1',
      user_email: 'anna.ivanova@email.com',
      user_name: 'Анна Иванова',
      certificate_type: 'diploma',
      certificate_url: 'https://example.com/cert1.pdf',
      submitted_at: '2024-01-20T10:30:00Z',
      status: 'pending',
      file_name: 'diploma_anna_ivanova.pdf',
      file_size: '2.3 MB'
    },
    {
      id: '2',
      user_id: 'user2',
      user_email: 'maria.petrova@email.com',
      user_name: 'Мария Петрова',
      certificate_type: 'certification',
      certificate_url: 'https://example.com/cert2.pdf',
      submitted_at: '2024-01-19T14:20:00Z',
      status: 'approved',
      verified_by: 'admin@teacherconnect.kg',
      verified_at: '2024-01-20T09:15:00Z',
      file_name: 'teaching_certification_maria.pdf',
      file_size: '1.8 MB'
    },
    {
      id: '3',
      user_id: 'user3',
      user_email: 'dmitry.sidorov@email.com',
      user_name: 'Дмитрий Сидоров',
      certificate_type: 'license',
      certificate_url: 'https://example.com/cert3.pdf',
      submitted_at: '2024-01-18T16:45:00Z',
      status: 'rejected',
      verified_by: 'admin@teacherconnect.kg',
      verified_at: '2024-01-19T11:30:00Z',
      notes: 'Document appears to be expired',
      file_name: 'teaching_license_dmitry.pdf',
      file_size: '3.1 MB'
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
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <Clock className="w-3 h-3 mr-1" />
          Ожидает
        </Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Одобрен
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Отклонен
        </Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'diploma':
        return <Badge variant="secondary">Диплом</Badge>;
      case 'certification':
        return <Badge variant="secondary">Сертификат</Badge>;
      case 'license':
        return <Badge variant="secondary">Лицензия</Badge>;
      default:
        return <Badge variant="outline">Другое</Badge>;
    }
  };

  const handleApprove = (certificateId: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === certificateId 
        ? { 
            ...cert, 
            status: 'approved' as const,
            verified_by: 'admin@teacherconnect.kg',
            verified_at: new Date().toISOString()
          }
        : cert
    ));
  };

  const handleReject = (certificateId: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.id === certificateId 
        ? { 
            ...cert, 
            status: 'rejected' as const,
            verified_by: 'admin@teacherconnect.kg',
            verified_at: new Date().toISOString()
          }
        : cert
    ));
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificate_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    const matchesType = filterType === 'all' || cert.certificate_type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = certificates.filter(c => c.status === 'pending').length;
  const approvedCount = certificates.filter(c => c.status === 'approved').length;
  const rejectedCount = certificates.filter(c => c.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Certificate Management</h1>
                <p className="text-sm text-gray-500">Review and verify user certificates</p>
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
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Certificate Review</CardTitle>
            <CardDescription>
              Review and verify user-submitted certificates and documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by user name, email, or certificate type..."
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
                  All Status
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('approved')}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === 'rejected' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('rejected')}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Certificates ({filteredCertificates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Certificate Type</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates.map((certificate) => (
                  <TableRow key={certificate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{certificate.user_name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {certificate.user_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(certificate.certificate_type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium">{certificate.file_name}</div>
                          <div className="text-xs text-gray-500">{certificate.file_size}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(certificate.submitted_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(certificate.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(certificate.certificate_url, '_blank')}
                          title="View Certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {certificate.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600"
                              onClick={() => handleApprove(certificate.id)}
                              title="Approve Certificate"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleReject(certificate.id)}
                              title="Reject Certificate"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCertificates.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No certificates found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CertificateManagementPage; 