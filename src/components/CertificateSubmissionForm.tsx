import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCertificate } from '@/hooks/useCertificates';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

const CertificateSubmissionForm: React.FC = () => {
  const { user, profile } = useAuth();
  const createCertificate = useCreateCertificate();
  
  const [formData, setFormData] = useState({
    certificate_type: 'diploma' as 'diploma' | 'license' | 'honor' | 'certification' | 'other',
    document_title: '',
    issuing_institution: '',
    issue_date: '',
    expiry_date: '',
    certificate_url: '',
    file_name: '',
    file_size: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a certificate.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCertificate.mutateAsync({
        user_id: user.id,
        user_email: user.email || '',
        user_name: profile.full_name || user.email?.split('@')[0] || 'Unknown User',
        certificate_type: formData.certificate_type,
        certificate_url: formData.certificate_url,
        file_name: formData.file_name,
        file_size: formData.file_size,
        document_title: formData.document_title,
        issuing_institution: formData.issuing_institution,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
      });

      toast({
        title: "Success",
        description: "Certificate submitted successfully! It will be reviewed by administrators.",
      });

      // Reset form
      setFormData({
        certificate_type: 'diploma',
        document_title: '',
        issuing_institution: '',
        issue_date: '',
        expiry_date: '',
        certificate_url: '',
        file_name: '',
        file_size: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Certificate Submission</CardTitle>
          <CardDescription>Please log in to submit your certificates</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Certificate</CardTitle>
        <CardDescription>
          Submit your diplomas, licenses, or other certificates for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certificate_type">Certificate Type</Label>
              <Select
                value={formData.certificate_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, certificate_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select certificate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diploma">Диплом (Diploma)</SelectItem>
                  <SelectItem value="license">Лицензия (License)</SelectItem>
                  <SelectItem value="honor">Почетная грамота (Honor)</SelectItem>
                  <SelectItem value="certification">Сертификат (Certification)</SelectItem>
                  <SelectItem value="other">Другое (Other)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_title">Document Title</Label>
              <Input
                id="document_title"
                value={formData.document_title}
                onChange={(e) => setFormData(prev => ({ ...prev, document_title: e.target.value }))}
                placeholder="e.g., Bachelor's Degree in Education"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issuing_institution">Issuing Institution</Label>
              <Input
                id="issuing_institution"
                value={formData.issuing_institution}
                onChange={(e) => setFormData(prev => ({ ...prev, issuing_institution: e.target.value }))}
                placeholder="e.g., University of Bishkek"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date (if applicable)</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_url">Document URL</Label>
              <Input
                id="certificate_url"
                type="url"
                value={formData.certificate_url}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate_url: e.target.value }))}
                placeholder="https://example.com/certificate.pdf"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file_name">File Name</Label>
              <Input
                id="file_name"
                value={formData.file_name}
                onChange={(e) => setFormData(prev => ({ ...prev, file_name: e.target.value }))}
                placeholder="e.g., diploma_2024.pdf"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file_size">File Size</Label>
              <Input
                id="file_size"
                value={formData.file_size}
                onChange={(e) => setFormData(prev => ({ ...prev, file_size: e.target.value }))}
                placeholder="e.g., 2.3 MB"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information about your certificate..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={createCertificate.isPending}
          >
            {createCertificate.isPending ? 'Submitting...' : 'Submit Certificate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CertificateSubmissionForm; 