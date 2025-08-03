import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface EmailData {
  id: string;
  to: string;
  subject: string;
  message: string;
  requestId: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
  adminId?: string;
  adminName?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  message: string;
  category: 'support' | 'general' | 'notification';
}

export const useEmailService = () => {
  const queryClient = useQueryClient();

  // Get all sent emails
  const useSentEmails = () => {
    return useQuery({
      queryKey: ['sent-emails'],
      queryFn: async (): Promise<EmailData[]> => {
        const storedEmails = localStorage.getItem('support_emails');
        return storedEmails ? JSON.parse(storedEmails) : [];
      },
      refetchInterval: 30000,
    });
  };

  // Send email
  const useSendEmail = () => {
    return useMutation({
      mutationFn: async (emailData: Omit<EmailData, 'id' | 'sentAt' | 'status'>): Promise<EmailData> => {
        // In production, this would use a real email service like SendGrid, Mailgun, etc.
        const email: EmailData = {
          ...emailData,
          id: Date.now().toString(),
          sentAt: new Date().toISOString(),
          status: 'sent'
        };

        // Store email in localStorage
        const existingEmails = localStorage.getItem('support_emails');
        const emails = existingEmails ? JSON.parse(existingEmails) : [];
        emails.push(email);
        localStorage.setItem('support_emails', JSON.stringify(emails));

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return email;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sent-emails'] });
      },
    });
  };

  // Get email templates
  const useEmailTemplates = () => {
    return useQuery({
      queryKey: ['email-templates'],
      queryFn: async (): Promise<EmailTemplate[]> => {
        const storedTemplates = localStorage.getItem('email_templates');
        if (storedTemplates) {
          return JSON.parse(storedTemplates);
        }

        // Default templates
        const defaultTemplates: EmailTemplate[] = [
          {
            id: '1',
            name: 'Подтверждение получения запроса',
            subject: 'Ваш запрос получен',
            message: 'Уважаемый пользователь,\n\nМы получили ваш запрос и работаем над его решением. Мы свяжемся с вами в ближайшее время.\n\nС уважением,\nКоманда поддержки TeacherConnect KG',
            category: 'support'
          },
          {
            id: '2',
            name: 'Решение проблемы',
            subject: 'Решение вашего запроса',
            message: 'Уважаемый пользователь,\n\nВаш запрос был решен. Если у вас есть дополнительные вопросы, не стесняйтесь обращаться к нам.\n\nС уважением,\nКоманда поддержки TeacherConnect KG',
            category: 'support'
          },
          {
            id: '3',
            name: 'Дополнительная информация',
            subject: 'Требуется дополнительная информация',
            message: 'Уважаемый пользователь,\n\nДля решения вашего запроса нам требуется дополнительная информация. Пожалуйста, предоставьте следующие детали:\n\n[Укажите необходимую информацию]\n\nС уважением,\nКоманда поддержки TeacherConnect KG',
            category: 'support'
          }
        ];

        localStorage.setItem('email_templates', JSON.stringify(defaultTemplates));
        return defaultTemplates;
      },
    });
  };

  // Create email template
  const useCreateEmailTemplate = () => {
    return useMutation({
      mutationFn: async (template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> => {
        const newTemplate: EmailTemplate = {
          ...template,
          id: Date.now().toString()
        };

        const existingTemplates = localStorage.getItem('email_templates');
        const templates = existingTemplates ? JSON.parse(existingTemplates) : [];
        templates.push(newTemplate);
        localStorage.setItem('email_templates', JSON.stringify(templates));

        return newTemplate;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      },
    });
  };

  return {
    useSentEmails,
    useSendEmail,
    useEmailTemplates,
    useCreateEmailTemplate
  };
}; 