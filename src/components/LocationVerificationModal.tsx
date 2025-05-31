
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: string;
  onVerify: (verifiedData: { address: string; coordinates: { lat: number; lng: number } }) => void;
}

// Mock Google Maps functionality - in production, you'd use the actual Google Maps API
const LocationVerificationModal: React.FC<LocationVerificationModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onVerify
}) => {
  const { toast } = useToast();
  const [searchAddress, setSearchAddress] = useState(currentAddress);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
    confidence: 'high' | 'medium' | 'low';
  } | null>(null);
  
  // Mock coordinates for Kyrgyzstan cities
  const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'Бишкек': { lat: 42.8746, lng: 74.5698 },
    'Ош': { lat: 40.5283, lng: 72.7985 },
    'Каракол': { lat: 42.4907, lng: 78.3936 },
    'Джалал-Абад': { lat: 40.9333, lng: 73.0000 },
    'Нарын': { lat: 41.4300, lng: 75.9911 },
  };

  const handleVerifyLocation = async () => {
    if (!searchAddress.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите адрес для проверки",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification logic
    const city = Object.keys(mockCoordinates).find(city => 
      searchAddress.toLowerCase().includes(city.toLowerCase())
    );
    
    if (city) {
      // Add some randomness for specific location within city
      const baseCoords = mockCoordinates[city];
      const randomOffset = () => (Math.random() - 0.5) * 0.01; // Small offset
      
      setVerificationResult({
        address: searchAddress,
        coordinates: {
          lat: baseCoords.lat + randomOffset(),
          lng: baseCoords.lng + randomOffset()
        },
        confidence: 'high'
      });
    } else {
      // Default to Bishkek with low confidence
      setVerificationResult({
        address: searchAddress,
        coordinates: mockCoordinates['Бишкек'],
        confidence: 'low'
      });
    }
    
    setIsVerifying(false);
  };

  const handleConfirmVerification = () => {
    if (verificationResult) {
      onVerify({
        address: verificationResult.address,
        coordinates: verificationResult.coordinates
      });
      
      toast({
        title: "Местоположение подтверждено",
        description: "Адрес школы успешно верифицирован",
      });
      
      onClose();
    }
  };

  const reset = () => {
    setVerificationResult(null);
    setSearchAddress(currentAddress);
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, currentAddress]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Верификация местоположения
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Адрес школы</Label>
            <Input
              id="address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Введите полный адрес школы"
            />
          </div>
          
          <Button 
            onClick={handleVerifyLocation}
            disabled={isVerifying || !searchAddress.trim()}
            className="w-full"
          >
            {isVerifying ? "Проверка местоположения..." : "Проверить местоположение"}
          </Button>
          
          {verificationResult && (
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                {verificationResult.confidence === 'high' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium">
                    {verificationResult.confidence === 'high' 
                      ? "Местоположение найдено" 
                      : "Местоположение найдено с низкой точностью"
                    }
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {verificationResult.address}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Координаты: {verificationResult.coordinates.lat.toFixed(6)}, {verificationResult.coordinates.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              
              {/* Mock map placeholder */}
              <div className="bg-muted h-32 rounded-md flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Предварительный просмотр карты
                </span>
              </div>
              
              {verificationResult.confidence === 'low' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    Точность определения местоположения низкая. Убедитесь, что адрес указан корректно.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          {verificationResult && (
            <Button onClick={handleConfirmVerification}>
              Подтвердить местоположение
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationVerificationModal;
