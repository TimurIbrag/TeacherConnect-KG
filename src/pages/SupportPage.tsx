
import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, Send, ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateSupportRequest } from '@/hooks/useSupportRequests';

const SupportPage: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const createSupportRequest = useCreateSupportRequest();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Имитация загрузки данных с использованием skeleton loader
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('📝 Submitting support request:', { name, email, subject, message });
    
    try {
      const result = await createSupportRequest.mutateAsync({
        user_name: name,
        user_email: email,
        subject: subject,
        message: message,
        priority: 'medium'
      });
      
      console.log('✅ Support request created successfully:', result);
      
      toast({
        title: t('support.messageSent'),
        description: t('support.responseTime'),
        variant: "default",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('❌ Error creating support request:', error);
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container px-4 py-8 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full md:col-span-2" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('support.title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('support.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('support.contactForm')}
            </CardTitle>
            <CardDescription>
              {t('support.contactFormDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('support.name')}</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('support.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('support.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('support.emailPlaceholder')}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">{t('support.subject')}</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t('support.subjectPlaceholder')}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">{t('support.message')}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('support.messagePlaceholder')}
                    rows={5}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('support.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {t('support.sendMessage')}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              {t('support.contactInfo')}
            </CardTitle>
            <CardDescription>
              {t('support.contactInfoDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('support.emailSupport')}</h3>
                  <p className="text-sm text-gray-600">support@teacherconnect.kg</p>
                  <p className="text-xs text-gray-500">{t('support.responseTime')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('support.liveChat')}</h3>
                  <p className="text-sm text-gray-600">{t('support.liveChatDescription')}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{t('support.documentation')}</h3>
                  <p className="text-sm text-gray-600">{t('support.documentationDescription')}</p>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    {t('support.viewDocs')}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">{t('support.commonIssues')}</h3>
              <div className="space-y-2 text-sm">
                <Button variant="link" className="p-0 h-auto text-left justify-start">
                  {t('support.howToRegister')}
                </Button>
                <Button variant="link" className="p-0 h-auto text-left justify-start">
                  {t('support.howToCreateProfile')}
                </Button>
                <Button variant="link" className="p-0 h-auto text-left justify-start">
                  {t('support.howToApply')}
                </Button>
                <Button variant="link" className="p-0 h-auto text-left justify-start">
                  {t('support.accountIssues')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
