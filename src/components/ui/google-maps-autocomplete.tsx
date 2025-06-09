
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface GoogleMapsAutocompleteProps {
  value?: string;
  onPlaceSelected: (place: {
    address: string;
    lat: number;
    lng: number;
    formatted_address: string;
  }) => void;
  placeholder?: string;
  className?: string;
}

// Note: This component requires Google Maps API to be loaded
// For now, it's a placeholder that simulates the functionality
const GoogleMapsAutocomplete: React.FC<GoogleMapsAutocompleteProps> = ({
  value = '',
  onPlaceSelected,
  placeholder,
  className = ''
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is loaded
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setIsGoogleMapsLoaded(true);
    } else {
      // For now, we'll simulate without Google Maps
      console.warn('Google Maps API not loaded. Using fallback functionality.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Simulate autocomplete suggestions (placeholder)
    if (newValue.length > 2) {
      const mockSuggestions = [
        {
          description: `${newValue}, Бишкек, Кыргызстан`,
          place_id: '1',
          lat: 42.8746,
          lng: 74.5698
        },
        {
          description: `${newValue}, Ош, Кыргызстан`,
          place_id: '2',
          lat: 40.5283,
          lng: 72.7985
        }
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(suggestion.description);
    setShowSuggestions(false);
    
    onPlaceSelected({
      address: suggestion.description,
      lat: suggestion.lat,
      lng: suggestion.lng,
      formatted_address: suggestion.description
    });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t('common.error'),
        description: 'Геолокация не поддерживается вашим браузером',
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // In a real implementation, you would reverse geocode these coordinates
        // For now, we'll use a placeholder
        const currentLocationAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        
        setInputValue(currentLocationAddress);
        onPlaceSelected({
          address: currentLocationAddress,
          lat: latitude,
          lng: longitude,
          formatted_address: currentLocationAddress
        });

        toast({
          title: t('address.locationVerified'),
          description: 'Текущее местоположение установлено',
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: t('common.error'),
          description: 'Не удалось получить текущее местоположение',
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder || t('address.searchPlaceholder')}
            className="pr-10"
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          className="flex items-center gap-1"
        >
          <Navigation className="h-4 w-4" />
          {t('address.useCurrentLocation')}
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              type="button"
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}

      {!isGoogleMapsLoaded && (
        <p className="text-xs text-amber-600 mt-1">
          Для полной функциональности требуется Google Maps API
        </p>
      )}
    </div>
  );
};

export default GoogleMapsAutocomplete;
