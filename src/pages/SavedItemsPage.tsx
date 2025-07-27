
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { School, User, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SavedItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user, profile, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Empty saved items - will be populated from real data
  const [savedTeachers] = useState([]);
  const [savedSchools] = useState([]);
  
  // Check if user is logged in using proper auth context
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
      toast({
        title: t('auth.authorizationRequired'),
        description: t('savedItems.pleaseLoginForAccess'),
        variant: "destructive",
      });
    }
  }, [user, profile, loading, navigate, toast, t]);

  const filteredTeachers = savedTeachers.filter((teacher: any) =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSchools = savedSchools.filter((school: any) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t('savedItems.title')}</h1>
        <p className="text-muted-foreground">{t('savedItems.description')}</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('savedItems.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="teachers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('savedItems.teachers')} ({filteredTeachers.length})
          </TabsTrigger>
          <TabsTrigger value="schools" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            {t('savedItems.schools')} ({filteredSchools.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="space-y-4">
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Teacher cards would go here */}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('savedItems.noSavedTeachers')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t('savedItems.noSavedTeachersDescription')}
                </p>
                <Button onClick={() => navigate('/teachers')}>
                  {t('savedItems.browseTeachers')}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="schools" className="space-y-4">
          {filteredSchools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* School cards would go here */}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <School className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('savedItems.noSavedSchools')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t('savedItems.noSavedSchoolsDescription')}
                </p>
                <Button onClick={() => navigate('/schools')}>
                  {t('savedItems.browseSchools')}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SavedItemsPage;
