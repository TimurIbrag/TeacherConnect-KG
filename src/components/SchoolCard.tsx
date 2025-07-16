
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Eye, Briefcase, Navigation, CheckCircle, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

interface SchoolCardProps {
  id: number;
  name: string;
  photo: string;
  photos?: string[];
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
  description?: string;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  id,
  name,
  photo,
  photos = [],
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
  description,
}) => {
  const { t } = useLanguage();
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const photoList = photos.length > 0 ? photos : (photo ? [photo] : []);
  const hasMultiplePhotos = photoList.length > 1;
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev === 0 ? photoList.length - 1 : prev - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev === photoList.length - 1 ? 0 : prev + 1));
  };
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full group">
        {/* Photo swiper */}
        {photoList.length > 0 ? (
          <img
            src={photoList[currentPhoto]}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Фото не добавлено</p>
            </div>
          </div>
        )}
        {/* Swiper arrows on hover */}
        {hasMultiplePhotos && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              onClick={handlePrev}
              tabIndex={-1}
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              onClick={handleNext}
              tabIndex={-1}
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {housing && (
            <Badge className="bg-orange-500 text-white flex items-center gap-1">
              <Home className="w-3 h-3" />
              С жильем
            </Badge>
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
        <h3 className="text-lg font-medium mb-2">{name}</h3>
        <div className="flex flex-wrap gap-2 mt-1">
          <Badge variant="outline">{type}</Badge>
          <Badge variant="secondary">{specialization}</Badge>
          {city && <Badge variant="outline" className="text-xs">{city}</Badge>}
        </div>
        <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{address}</span>
            {locationVerified && (
              <CheckCircle className="w-3 h-3 text-green-600 ml-1" />
            )}
          </div>
          {distance !== undefined && (
            <Badge variant="outline" className="ml-2 flex items-center gap-1 text-xs">
              <Navigation className="w-3 h-3" />
              {distance} км
            </Badge>
          )}
        </div>
        {/* Truncated description, normal text, no green oval */}
        <div className="mt-3">
          <p className="text-gray-700 text-sm line-clamp-2">{description || specialization}</p>
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
          <div className="flex items-center gap-1" title="Profile views">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{views}</span>
          </div>
        </div>
        <Link to={`/school-profile/${id}`}>
          <Button size="sm">Смотреть профиль</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SchoolCard;
