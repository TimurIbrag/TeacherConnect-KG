import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Globe, Lock } from 'lucide-react';

interface ProfileVisibilityCardProps {
  isProfilePublic: boolean;
  isProfileComplete: boolean;
  onVisibilityChange: (checked: boolean) => void;
}

const ProfileVisibilityCard: React.FC<ProfileVisibilityCardProps> = ({
  isProfilePublic,
  isProfileComplete,
  onVisibilityChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isProfilePublic ? (
            <Globe className="h-5 w-5 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
          Видимость профиля
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isProfilePublic ? "Профиль опубликован" : "Профиль скрыт"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isProfilePublic 
                ? "Ваш профиль и активные вакансии видны соискателям"
                : "Только вы можете видеть ваш профиль и вакансии"
              }
            </p>
          </div>
          <Switch
            checked={isProfilePublic}
            onCheckedChange={onVisibilityChange}
            disabled={!isProfileComplete}
          />
        </div>
        
        {!isProfileComplete && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Заполните обязательные поля профиля (название, адрес, описание) для публикации
            </p>
          </div>
        )}

        {isProfilePublic && isProfileComplete && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✓ Ваш профиль опубликован и доступен для поиска
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileVisibilityCard;