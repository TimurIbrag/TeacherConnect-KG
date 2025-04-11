
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { schoolsData } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  MapPin, 
  MessageSquare,
  Star,
  Building,
  Eye,
  Home,
  Check
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobCard from '@/components/JobCard';

const SchoolProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  // Find school by ID
  const schoolId = Number(id);
  const school = schoolsData.find(s => s.id === schoolId);
  
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
  
  const handleApplyToJob = (jobId: number) => {
    if (appliedJobs.includes(jobId)) {
      toast({
        title: "Вы уже откликнулись на эту вакансию",
        description: "Вы получите уведомление, когда школа рассмотрит вашу заявку",
        variant: "default",
      });
      return;
    }
    
    setAppliedJobs([...appliedJobs, jobId]);
    toast({
      title: "Заявка отправлена!",
      description: "Ваш отклик на вакансию успешно отправлен",
      variant: "success",
    });
  };
  
  if (!school) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Школа не найдена</h1>
        <p className="mb-6">Организация с указанным ID не существует.</p>
        <Button asChild>
          <Link to="/schools">Вернуться к списку школ</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="relative h-48 w-full">
              <img 
                src={school.photo} 
                alt={school.name} 
                className="h-full w-full object-cover rounded-t-lg" 
              />
              {school.housing && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-accent text-white">
                    <Home className="h-3 w-3 mr-1" />
                    Жилье
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{school.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{school.address}</span>
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">{school.type}</Badge>
                    <Badge variant="secondary">{school.specialization}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-accent fill-accent mr-1" />
                      <span>{school.ratings}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:self-start">
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('button.message')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-6">
              <Tabs defaultValue="about">
                <TabsList className="mb-6">
                  <TabsTrigger value="about">О школе</TabsTrigger>
                  <TabsTrigger value="vacancies">
                    Вакансии
                    <Badge className="ml-2 bg-primary text-primary-foreground" variant="default">
                      {school.openPositions.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="facilities">Инфраструктура</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">О школе</h3>
                    <p className="text-muted-foreground">{school.about}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Тип</h3>
                      <div className="flex items-start gap-2">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <span>{school.type}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Специализация</h3>
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                        <span>{school.specialization}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Местоположение</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>{school.address}</span>
                    </div>
                    <div className="bg-muted h-48 rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">Карта местоположения</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="vacancies" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Открытые вакансии</h3>
                    <div className="space-y-4">
                      {school.openPositions.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          title={job.title}
                          schedule={job.schedule}
                          salary={job.salary}
                          requirements={job.requirements}
                          additionalInfo={job.additionalInfo}
                          schoolName={school.name}
                          schoolId={school.id}
                          onApply={() => handleApplyToJob(job.id)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {school.openPositions.length === 0 && (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">Нет открытых вакансий</h3>
                      <p className="text-muted-foreground">
                        В настоящее время школа не разместила открытых вакансий.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="facilities" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Инфраструктура</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {school.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-md border">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {school.housing && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Дополнительные преимущества</h3>
                      <div className="flex items-center gap-2 p-3 rounded-md border border-accent/30 bg-accent/5">
                        <Home className="h-5 w-5 text-accent" />
                        <span>Школа предоставляет жилье для учителей</span>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Stats & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Просмотры профиля:</span>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{school.views}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Количество вакансий:</span>
                <span className="font-medium">{school.openPositions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Откликов получено:</span>
                <span className="font-medium">{school.applications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Рейтинг:</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-accent fill-accent" />
                  <span className="font-medium">{school.ratings}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Похожие школы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schoolsData
                  .filter(s => s.id !== schoolId && s.type === school.type)
                  .slice(0, 3)
                  .map(similarSchool => (
                    <div key={similarSchool.id} className="flex flex-col gap-2">
                      <div className="h-24 w-full rounded-md overflow-hidden">
                        <img 
                          src={similarSchool.photo} 
                          alt={similarSchool.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{similarSchool.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {similarSchool.address}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="mt-1" asChild>
                        <Link to={`/schools/${similarSchool.id}`}>
                          Просмотр
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/schools">Все школы</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolProfilePage;
