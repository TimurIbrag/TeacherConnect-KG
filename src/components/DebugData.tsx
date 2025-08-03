import React from 'react';
import { useTeachers } from '@/hooks/useTeachers';
import { useSchools } from '@/hooks/useSchools';
import { useAdminStats } from '@/hooks/useAdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DebugData: React.FC = () => {
  const teachers = useTeachers(1, 10);
  const schools = useSchools();
  const adminStats = useAdminStats();

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Debug Data Component</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Teachers Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> {teachers.status}</p>
            <p><strong>Is Loading:</strong> {teachers.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Error:</strong> {teachers.isError ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {teachers.error?.message || 'None'}</p>
            <p><strong>Data Length:</strong> {teachers.data?.data?.length || 0}</p>
            <p><strong>Count:</strong> {teachers.data?.count || 0}</p>
            <div className="mt-4">
              <strong>Raw Data:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(teachers.data, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schools Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> {schools.status}</p>
            <p><strong>Is Loading:</strong> {schools.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Error:</strong> {schools.isError ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {schools.error?.message || 'None'}</p>
            <p><strong>Data Length:</strong> {schools.data?.length || 0}</p>
            <div className="mt-4">
              <strong>Raw Data:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(schools.data, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> {adminStats.status}</p>
            <p><strong>Is Loading:</strong> {adminStats.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Is Error:</strong> {adminStats.isError ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {adminStats.error?.message || 'None'}</p>
            <div className="mt-4">
              <strong>Raw Data:</strong>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(adminStats.data, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 