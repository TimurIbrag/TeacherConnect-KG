import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, MapPin, CheckCircle } from 'lucide-react';

interface SchoolData {
  name: string;
  address: string;
  type: string;
  category: string;
  city: string;
  about: string;
  website: string;
  infrastructure: string[];
  locationVerified: boolean;
  housing: boolean;
}

interface ProfileDisplayCardProps {
  schoolData: SchoolData;
  profilePhoto: string | null;
  onEditClick: () => void;
  onPhotoChange: (file: File | null) => void;
  onLocationVerificationClick: () => void;
}

const ProfileDisplayCard: React.FC<ProfileDisplayCardProps> = ({
  schoolData,
  profilePhoto,
  onEditClick,
  onPhotoChange,
  onLocationVerificationClick
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Профиль школы</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={onEditClick}>
            <Edit className="h-4 w-4" />
            Редактировать
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          {/* Rectangular school photo */}
          <div className="w-32 h-20 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 relative">
            {profilePhoto ? (
              <>
                <img src={profilePhoto} alt={schoolData.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onPhotoChange(null)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
                <Building className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground text-center px-2">Добавить фото школы</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onPhotoChange(file);
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium">{schoolData.name || "Название школы не указано"}</h3>
            {schoolData.address && (
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {schoolData.address}
                </p>
                {schoolData.locationVerified ? (
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Подтверждено
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={onLocationVerificationClick}
                  >
                    Подтвердить адрес
                  </Button>
                )}
              </div>
            )}
            {schoolData.city && (
              <p className="text-sm text-muted-foreground mt-1">
                Город: {schoolData.city}
              </p>
            )}
            {schoolData.website && (
              <a 
                href={schoolData.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:underline mt-1 inline-block"
              >
                {schoolData.website}
              </a>
            )}
          </div>
        </div>
        
        {(schoolData.type || schoolData.category) && (
          <div className="flex flex-wrap gap-2">
            {schoolData.type && <Badge variant="outline">{schoolData.type}</Badge>}
            {schoolData.category && <Badge variant="secondary">{schoolData.category}</Badge>}
            {schoolData.housing && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                С жильем
              </Badge>
            )}
          </div>
        )}
        
        {schoolData.about && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">О школе</h4>
            <p className="text-sm">
              {schoolData.about}
            </p>
          </div>
        )}
        
        {schoolData.infrastructure.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Инфраструктура</h4>
            <div className="grid grid-cols-2 gap-2">
              {schoolData.infrastructure.map((item, index) => (
                <div key={index} className="flex items-center gap-2 border p-2 rounded">
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!schoolData.name && !schoolData.about && !schoolData.address && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              Информация о школе не заполнена. Нажмите "Редактировать", чтобы добавить данные.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileDisplayCard;