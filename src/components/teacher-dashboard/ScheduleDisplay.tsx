import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleDetails {
  [day: string]: {
    available: boolean;
    startTime?: string;
    endTime?: string;
  };
}

interface ScheduleDisplayProps {
  scheduleDetails?: ScheduleDetails;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Понедельник', short: 'Пн' },
  { key: 'tuesday', label: 'Вторник', short: 'Вт' },
  { key: 'wednesday', label: 'Среда', short: 'Ср' },
  { key: 'thursday', label: 'Четверг', short: 'Чт' },
  { key: 'friday', label: 'Пятница', short: 'Пт' },
  { key: 'saturday', label: 'Суббота', short: 'Сб' },
  { key: 'sunday', label: 'Воскресенье', short: 'Вс' }
];

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ scheduleDetails }) => {
  if (!scheduleDetails || Object.keys(scheduleDetails).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Расписание
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Расписание не настроено</p>
        </CardContent>
      </Card>
    );
  }

  const availableDays = DAYS_OF_WEEK.filter(day => 
    scheduleDetails[day.key]?.available
  );

  const unavailableDays = DAYS_OF_WEEK.filter(day => 
    !scheduleDetails[day.key]?.available
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Расписание доступности
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableDays.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Доступные дни:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableDays.map(day => {
                const daySchedule = scheduleDetails[day.key];
                return (
                  <div key={day.key} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-sm font-medium text-green-800">
                      {day.label}
                    </span>
                    {daySchedule.startTime && daySchedule.endTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-green-700">
                          {daySchedule.startTime} - {daySchedule.endTime}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {unavailableDays.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Недоступные дни:</h4>
            <div className="flex flex-wrap gap-1">
              {unavailableDays.map(day => (
                <Badge key={day.key} variant="outline" className="text-xs text-gray-500">
                  {day.short}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {availableDays.length === 0 && (
          <p className="text-gray-500 text-sm">Нет доступных дней</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleDisplay; 