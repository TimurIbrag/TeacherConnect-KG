
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQPage: React.FC = () => {
  const { t } = useLanguage();
  
  const faqItems = [
    {
      question: 'Как создать профиль?',
      answer: 'Для создания профиля необходимо зарегистрироваться, затем заполнить все необходимые поля в личном кабинете. Учителя указывают свою специализацию, опыт работы, образование и предпочтения по работе. Школы заполняют информацию о своём учебном заведении.'
    },
    {
      question: 'Как найти подходящую школу?',
      answer: 'Используйте фильтры на странице "Школы", чтобы найти учебное заведение по местоположению, специализации и другим параметрам. Вы можете просматривать профили школ и их открытые вакансии.'
    },
    {
      question: 'Как откликнуться на вакансию?',
      answer: 'На странице вакансии нажмите на кнопку "Откликнуться". Школа получит уведомление о вашем отклике и сможет просмотреть ваш профиль. После этого с вами могут связаться для дальнейшего обсуждения.'
    },
    {
      question: 'Что делать, если нет ответа на отклик?',
      answer: 'Если школа не отвечает на ваш отклик в течение недели, вы можете отправить повторное сообщение через систему чата на платформе. Также рекомендуем продолжать поиск и откликаться на другие интересующие вас вакансии.'
    },
    {
      question: 'Как удалить свой аккаунт?',
      answer: 'Для удаления аккаунта перейдите в настройки профиля, выберите раздел "Удаление аккаунта" и следуйте инструкциям. Обратите внимание, что это действие необратимо, и все ваши данные будут удалены из системы.'
    },
    {
      question: 'Могу ли я изменить тип аккаунта?',
      answer: 'Нет, тип аккаунта (учитель или школа) выбирается при регистрации и не может быть изменен. Если вам необходимо сменить тип аккаунта, придется создать новую учетную запись.'
    },
    {
      question: 'Как обновить информацию в профиле?',
      answer: 'Войдите в личный кабинет, перейдите в раздел "Профиль" и нажмите кнопку "Редактировать". После внесения изменений нажмите "Сохранить".'
    }
  ];

  return (
    <div className="container px-4 py-8 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Часто задаваемые вопросы</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQPage;
