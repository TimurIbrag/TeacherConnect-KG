
import React from 'react';
import { ExternalLink, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LocationMapProps {
  address: string;
  verified?: boolean;
}

const LocationMap: React.FC<LocationMapProps> = ({ address, verified = false }) => {
  // Function to create a Google Maps URL with the address
  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <span>{address}</span>
        </div>
        {verified ? (
          <Badge variant="secondary" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Подтверждено
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Не подтверждено
          </Badge>
        )}
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
