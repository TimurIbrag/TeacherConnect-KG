
import React from 'react';
import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocationMapProps {
  address: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ address }) => {
  // Function to create a Google Maps URL with the address
  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <MapPin className="h-5 w-5 text-primary mt-0.5" />
        <span>{address}</span>
      </div>
      
      <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(getGoogleMapsUrl(address), '_blank')}>
        <ExternalLink className="h-4 w-4" />
        Открыть в Google Maps
      </Button>
      
      <div className="bg-muted h-48 rounded-md flex items-center justify-center">
        <span className="text-muted-foreground">Карта местоположения</span>
      </div>
    </div>
  );
};

export default LocationMap;
