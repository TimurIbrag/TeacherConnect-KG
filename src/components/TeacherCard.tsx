
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye, Navigation } from 'lucide-react';

interface TeacherCardProps {
  id: number;
  name: string;
  photo: string;
  specialization: string;
  experience: string;
  location: string;
  ratings: number;
  views: number;
  distance?: number;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  id,
  name,
  photo,
  specialization,
  experience,
  location,
  ratings,
  views,
  distance,
}) => {
  const { t } = useLanguage();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={photo} alt={name} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge variant="secondary">{specialization}</Badge>
                <span className="text-sm text-muted-foreground">{experience}</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
                {distance !== undefined && (
                  <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
                    <Navigation className="w-3 h-3" />
                    {distance} км
                  </Badge>
                )}
              </div>
            </div>
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
        <Link to={`/teachers/${id}`}>
          <Button size="sm">{t('teachers.viewProfile')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TeacherCard;
