
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { User, BookOpen, MapPin, Clock, Award, FileText, Eye, Heart, MessageSquare, Settings, Upload, Download } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { ServicesTab } from '@/components/teacher-dashboard/ServicesTab';

type TeacherProfile = Database['public']['Tables']['teacher_profiles']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export default function TeacherDashboardPage() {
  const { user, profile } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    specialization: '',
    bio: '',
    education: '',
    experience_years: 0,
    location: '',
    skills: [] as string[],
    languages: {} as any,
    available: false,
    is_published: false,
  });

  useEffect(() => {
    if (user) {
      fetchTeacherProfile();
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching teacher profile:', error);
        return;
      }

      if (data) {
        setTeacherProfile(data);
        setFormData({
          specialization: data.specialization || '',
          bio: data.bio || '',
          education: data.education || '',
          experience_years: data.experience_years || 0,
          location: data.location || '',
          skills: data.skills || [],
          languages: data.languages || {},
          available: data.available || false,
          is_published: data.is_published || false,
        });
      }
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updateData = {
        ...formData,
        date_of_birth: teacherProfile?.date_of_birth || null,
        certificates: teacherProfile?.certificates || [],
        resume_url: teacherProfile?.resume_url || null,
        schedule_details: teacherProfile?.schedule_details || null,
        is_profile_complete: teacherProfile?.is_profile_complete || false,
      };

      const { data, error } = await supabase
        .from('teacher_profiles')
        .upsert({
          id: user.id,
          ...updateData,
        })
        .select()
        .single();

      if (error) throw error;

      setTeacherProfile(data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your teaching profile and connect with students
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={teacherProfile?.is_published ? "default" : "secondary"}>
            {teacherProfile?.is_published ? "Published" : "Draft"}
          </Badge>
          <Badge variant={teacherProfile?.available ? "default" : "secondary"}>
            {teacherProfile?.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{teacherProfile?.view_count || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your basic teaching profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="e.g., Mathematics, English, Physics"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                {teacherProfile?.date_of_birth && (
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={teacherProfile.date_of_birth}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Textarea
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="Describe your educational background"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bio">About Me</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell students about yourself, your teaching style, and experience"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => handleInputChange('available', checked)}
                />
                <Label htmlFor="available">Available for new students</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                />
                <Label htmlFor="is_published">Publish profile (make it visible to students)</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Availability</CardTitle>
              <CardDescription>
                Set your teaching schedule and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Schedule Details</Label>
                  {teacherProfile?.schedule_details ? (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <pre className="text-sm">
                        {JSON.stringify(teacherProfile.schedule_details, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      No schedule details set yet.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Certificates</CardTitle>
              <CardDescription>
                Upload your teaching certificates and resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Resume</Label>
                {teacherProfile?.resume_url ? (
                  <div className="flex items-center gap-2 mt-2">
                    <FileText className="h-4 w-4" />
                    <a 
                      href={teacherProfile.resume_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  </div>
                ) : (
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label>Certificates</Label>
                {teacherProfile?.certificates && teacherProfile.certificates.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {teacherProfile.certificates.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Add Certificates
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile preferences and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profile Completeness</Label>
                    <p className="text-sm text-muted-foreground">
                      {teacherProfile?.is_profile_complete ? 'Complete' : 'Incomplete'}
                    </p>
                  </div>
                  <Badge variant={teacherProfile?.is_profile_complete ? "default" : "secondary"}>
                    {teacherProfile?.is_profile_complete ? 'Complete' : 'Incomplete'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
