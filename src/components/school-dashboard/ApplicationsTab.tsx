
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, FileText, MessageSquare, UserCog, UserRound, Inbox } from 'lucide-react';

const ApplicationsTab = () => {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('applications.title')}</CardTitle>
        <CardDescription>
          {t('applications.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new">
          <TabsList className="mb-4">
            <TabsTrigger value="new">{t('applications.new')} (0)</TabsTrigger>
            <TabsTrigger value="processed">{t('applications.inProgress')} (0)</TabsTrigger>
            <TabsTrigger value="archived">{t('applications.archive')} (0)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="space-y-4">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Inbox className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('applications.noNewApplications')}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t('applications.noApplicationsDescription')}
                </p>
                <Button variant="outline">
                  {t('applications.createVacancy')}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="processed" className="space-y-4">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCog className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('applications.noInProgressApplications')}
                </h3>
                <p className="text-gray-500">
                  {t('applications.noInProgressDescription')}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="archived">
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileBarChart className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('applications.noArchivedApplications')}
                </h3>
                <p className="text-gray-500">
                  {t('applications.noArchivedDescription')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ApplicationsTab;
