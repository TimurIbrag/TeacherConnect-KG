import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Trash2, AlertTriangle } from 'lucide-react';
import { DataSeedingService } from '@/services/DataSeedingService';
import { useToast } from '@/hooks/use-toast';

const DataSeedingComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isClearingAll, setIsClearingAll] = useState(false);
  const [isFixingRecursion, setIsFixingRecursion] = useState(false);
  const [counts, setCounts] = useState({ teachers: 0, schools: 0 });
  const { toast } = useToast();

  const fetchCounts = async () => {
    const data = await DataSeedingService.checkExistingData();
    setCounts(data);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleCreateSampleData = async () => {
    setIsLoading(true);
    try {
      const result = await DataSeedingService.seedSampleData();
      if (result.success) {
        toast({
          title: "✅ Успешно!",
          description: "Образцовые данные созданы",
        });
        await fetchCounts();
      } else {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось создать данные",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при создании данных",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSampleData = async () => {
    setIsClearing(true);
    try {
      const result = await DataSeedingService.clearSampleData();
      if (result.success) {
        toast({
          title: "✅ Успешно!",
          description: "Образцовые данные удалены",
        });
        await fetchCounts();
      } else {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось удалить данные",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при удалении данных",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleClearAllProfiles = async () => {
    if (!confirm('⚠️ ВНИМАНИЕ: Это удалит ВСЕ профили из базы данных! Это действие нельзя отменить. Продолжить?')) {
      return;
    }

    setIsClearingAll(true);
    try {
      const result = await DataSeedingService.clearAllDefaultProfiles();
      if (result.success) {
        toast({
          title: "✅ Успешно!",
          description: "Все профили удалены из базы данных",
        });
        await fetchCounts();
      } else {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось удалить профили",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при удалении профилей",
        variant: "destructive",
      });
    } finally {
      setIsClearingAll(false);
    }
  };

  const handleFixRecursion = async () => {
    if (!confirm('🔧 Исправить проблему с рекурсией в таблице profiles? Это может занять некоторое время.')) {
      return;
    }

    setIsFixingRecursion(true);
    try {
      const result = await DataSeedingService.fixProfilesTableRecursion();
      if (result.success) {
        toast({
          title: "✅ Успешно!",
          description: "Проблема с рекурсией исправлена",
        });
        await fetchCounts();
      } else {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось исправить рекурсию",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при исправлении рекурсии",
        variant: "destructive",
      });
    } finally {
      setIsFixingRecursion(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          <Sprout className="inline w-6 h-6 text-green-600 mr-2" />
          Инструмент управления данными (Временный)
        </h2>
        <p className="text-gray-600">
          Управление профилями и данными в базе данных
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              📊 Текущий статус
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Учителя:</span>
              <span className="font-semibold text-blue-600">{counts.teachers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Школы:</span>
              <span className="font-semibold text-green-600">{counts.schools}</span>
            </div>
            <Button 
              onClick={fetchCounts} 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              Обновить
            </Button>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              ⚡ Действия
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleCreateSampleData}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Sprout className="w-4 h-4 mr-2" />
              {isLoading ? 'Создание...' : 'Создать образцовые данные'}
            </Button>
            
            <Button
              onClick={handleClearSampleData}
              disabled={isClearing}
              variant="outline"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isClearing ? 'Удаление...' : 'Удалить образцовые данные'}
            </Button>

            <Button
              onClick={handleClearAllProfiles}
              disabled={isClearingAll}
              variant="destructive"
              className="w-full"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {isClearingAll ? 'Удаление...' : 'Удалить ВСЕ профили'}
            </Button>

            <Button
              onClick={handleFixRecursion}
              disabled={isFixingRecursion}
              variant="outline"
              className="w-full bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {isFixingRecursion ? 'Исправление...' : 'Исправить рекурсию profiles'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* What this does */}
      <Card>
        <CardHeader>
          <CardTitle>Что делает этот инструмент:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Создает 5 образцовых профилей учителей с реалистичными данными</li>
            <li>Создает 5 образцовых профилей школ с реалистичными данными</li>
            <li>Устанавливает все профили как опубликованные и завершенные</li>
            <li>Использует кыргызские имена и локации</li>
            <li>Удаляет все существующие профили (включая дефолтные)</li>
            <li>Позволяет очистить только образцовые данные</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export { DataSeedingComponent }; 