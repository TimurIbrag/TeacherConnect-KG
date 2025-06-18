
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye, Briefcase, Navigation, CheckCircle } from 'lucide-react';

interface SchoolCardProps {
  id: number;
  name: string;
  photo: string;
  address: string;
  type: string;
  specialization: string;
  openPositions: Array<{ id: number; title: string }>;
  ratings: number;
  views: number;
  housing?: boolean;
  distance?: number;
  locationVerified?: boolean;
  city?: string;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  id,
  name,
  photo,
  address,
  type,
  specialization,
  openPositions,
  ratings,
  views,
  housing,
  distance,
  locationVerified = Math.random() > 0.3, // Mock verification status
  city,
}) => {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full">
        <img 
          src={photo} 
          alt={name} 
          className="h-full w-full object-cover" 
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {housing && (
            <Badge className="bg-accent text-white">Жилье</Badge>
          )}
          {locationVerified && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Адрес подтвержден
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium">{name}</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline">{type}</Badge>
          <Badge variant="secondary">{specialization}</Badge>
          {city && <Badge variant="outline" className="text-xs">{city}</Badge>}
        </div>
        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{address}</span>
            {locationVerified && (
              <CheckCircle className="w-3 h-3 text-green-600" />
            )}
          </div>
          {distance !== undefined && (
            <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
              <Navigation className="w-3 h-3" />
              {distance} км
            </Badge>
          )}
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-1 text-sm">
            <Briefcase className="w-3 h-3 text-primary" />
            <span className="font-medium text-primary">
              {openPositions.length} {openPositions.length === 1 ? 'вакансия' : 'вакансии'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t p-4 bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1" title="Rating">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm">{ratings}</span>
          </div>
          <div className="flex items-center gap-1" title="Profile views">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{views}</span>
          </div>
        </div>
        <Link to={`/schools/${id}`}>
          <Button size="sm">{t('schools.viewJobs')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SchoolCard;
