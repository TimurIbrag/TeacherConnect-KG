import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, MessageSquare, Star, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface DisplaySchool {
  id: string | number;
  name: string;
  photo: string;
  address: string;
  type: string;
  specialization: string;
  ratings: number;
  housing: boolean;
}

interface SchoolHeaderProps {
  school: DisplaySchool;
}

const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school }) => {
  const { t } = useLanguage();

  return (
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
    </Card>
  );
};

export default SchoolHeader;