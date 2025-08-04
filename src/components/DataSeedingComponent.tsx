import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataSeedingService } from '@/services/DataSeedingService';
import { useToast } from '@/hooks/use-toast';

export const DataSeedingComponent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState<{ teachers: number; schools: number }>({ teachers: 0, schools: 0 });
  const { toast } = useToast();

  const checkDataStatus = async () => {
    const status = await DataSeedingService.checkExistingData();
    setDataStatus({ teachers: status.teachers, schools: status.schools });
  };

  useEffect(() => {
    checkDataStatus();
  }, []);

  const handleSeedData = async () => {
    setLoading(true);
    try {
      const result = await DataSeedingService.seedSampleData();
      if (result.success) {
        toast({
          title: "✅ Данные созданы",
          description: "Образцы профилей учителей и школ успешно добавлены",
        });
        await checkDataStatus();
      } else {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось создать данные",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при создании данных",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      const result = await DataSeedingService.clearSampleData();
      if (result.success) {
        toast({
          title: "🗑️ Данные удалены",
          description: "Образцы профилей успешно удалены",
        });
        await checkDataStatus();
      } else {
        toast({
          title: "❌ Ошибка",
          description: "Не удалось удалить данные",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Clear error:', error);
      toast({
        title: "❌ Ошибка",
        description: "Произошла ошибка при удалении данных",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
      <h3 className="text-lg font-bold text-green-800 mb-4">🌱 Data Seeding Tool</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Teachers:</span>
                <span className="font-bold text-blue-600">{dataStatus.teachers}</span>
              </div>
              <div className="flex justify-between">
                <span>Schools:</span>
                <span className="font-bold text-green-600">{dataStatus.schools}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={handleSeedData}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600"
              size="sm"
            >
              {loading ? '🔄 Creating...' : '🌱 Create Sample Data'}
            </Button>
            
            <Button 
              onClick={handleClearData}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600"
              size="sm"
            >
              {loading ? '🔄 Clearing...' : '🗑️ Clear Sample Data'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-sm text-gray-600">
        <p><strong>What this does:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Creates 3 sample teacher profiles with realistic data</li>
          <li>Creates 3 sample school profiles with realistic data</li>
          <li>Sets all profiles as published and complete</li>
          <li>Uses Kyrgyz names and locations</li>
        </ul>
      </div>
    </div>
  );
}; 