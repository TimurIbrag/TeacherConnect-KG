
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
      question: t('faq.createProfile.question'),
      answer: t('faq.createProfile.answer')
    },
    {
      question: t('faq.findSchool.question'),
      answer: t('faq.findSchool.answer')
    },
    {
      question: t('faq.applyVacancy.question'),
      answer: t('faq.applyVacancy.answer')
    },
    {
      question: t('faq.contactSupport.question'),
      answer: t('faq.contactSupport.answer')
    },
    {
      question: t('faq.profileVisibility.question'),
      answer: t('faq.profileVisibility.answer')
    },
    {
      question: t('faq.safety.question'),
      answer: t('faq.safety.answer')
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('faq.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('faq.frequentlyAsked')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
