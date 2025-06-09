
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Maximize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedLocationMapProps {
  latitude?: number;
  longitude?: number;
  address?: string;
  onLocationChange?: (location: { lat: number; lng: number; address: string }) => void;
  interactive?: boolean;
  height?: string;
  className?: string;
}

const EnhancedLocationMap: React.FC<EnhancedLocationMapProps> = ({
  latitude = 42.8746, // Default to Bishkek
  longitude = 74.5698,
  address = '',
  onLocationChange,
  interactive = false,
  height = '300px',
  className = ''
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({ lat: latitude, lng: longitude });

  useEffect(() => {
    // Check if Google Maps is loaded
    if (typeof window !== 'undefined' && window.google?.maps) {
      setIsGoogleMapsLoaded(true);
    }
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t('common.error'),
        description: 'Геолокация не поддерживается',
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setCurrentLocation(newLocation);
        
        if (onLocationChange) {
          onLocationChange({
            ...newLocation,
            address: `${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)}`
          });
        }

        toast({
          title: t('address.locationVerified'),
          description: 'Местоположение обновлено',
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: t('common.error'),
          description: 'Не удалось получить местоположение',
          variant: "destructive",
        });
      }
    );
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
    window.open(url, '_blank');
  };

  // Placeholder map display when Google Maps is not available
  const PlaceholderMap = () => (
    <div 
      className="relative bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-center p-4">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">
          Карта: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
        </p>
        {address && (
          <p className="text-xs text-gray-500 mb-4">{address}</p>
        )}
        
        <div className="flex gap-2 justify-center">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleGetCurrentLocation}
            className="flex items-center gap-1"
          >
            <Navigation className="h-4 w-4" />
            {t('address.useCurrentLocation')}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={openInGoogleMaps}
            className="flex items-center gap-1"
          >
            <Maximize2 className="h-4 w-4" />
            Google Maps
          </Button>
        </div>
      </div>
      
      {/* Simulated map marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <MapPin className="h-6 w-6 text-red-500 drop-shadow-lg" />
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {!isGoogleMapsLoaded ? (
            <PlaceholderMap />
          ) : (
            <div 
              id="google-map"
              className="rounded-lg overflow-hidden border"
              style={{ height }}
            >
              {/* Google Maps would be initialized here */}
              <PlaceholderMap />
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
              </span>
            </div>
            
            {interactive && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleGetCurrentLocation}
                className="text-xs"
              >
                {t('address.verifyLocation')}
              </Button>
            )}
          </div>
          
          {!isGoogleMapsLoaded && (
            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
              Для отображения интерактивной карты требуется Google Maps API
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedLocationMap;
