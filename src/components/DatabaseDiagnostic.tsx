import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseDiagnostic: React.FC = () => {
  const [diagnosticData, setDiagnosticData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDiagnostic = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);

      results.profiles = {
        success: !profilesError,
        error: profilesError?.message,
        count: profiles?.length || 0,
        data: profiles
      };

      // Test 2: Check teacher_profiles table
      const { data: teacherProfiles, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .limit(5);

      results.teacherProfiles = {
        success: !teacherError,
        error: teacherError?.message,
        count: teacherProfiles?.length || 0,
        data: teacherProfiles
      };

      // Test 3: Check school_profiles table
      const { data: schoolProfiles, error: schoolError } = await supabase
        .from('school_profiles')
        .select('*')
        .limit(5);

      results.schoolProfiles = {
        success: !schoolError,
        error: schoolError?.message,
        count: schoolProfiles?.length || 0,
        data: schoolProfiles
      };

      // Test 4: Check what columns exist in profiles
      const { data: profileColumns, error: columnError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      results.profileColumns = {
        success: !columnError,
        error: columnError?.message,
        columns: profileColumns && profileColumns.length > 0 ? Object.keys(profileColumns[0]) : []
      };

      // Test 5: Try to create a test profile
      const testId = 'test-profile-' + Date.now();
      const { data: testProfile, error: testError } = await supabase
        .from('profiles')
        .insert({
          id: testId,
          email: 'test@example.com',
          full_name: 'Test Teacher',
          role: 'teacher',
          is_published: true,
          is_profile_complete: true,
          is_active: true
        })
        .select()
        .single();

      results.testProfile = {
        success: !testError,
        error: testError?.message,
        data: testProfile
      };

      // Clean up test profile
      if (testProfile) {
        await supabase
          .from('profiles')
          .delete()
          .eq('id', testId);
      }

    } catch (error) {
      console.error('Diagnostic error:', error);
      results.generalError = error;
    }

    setDiagnosticData(results);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostic();
  }, []);

  return (
    <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
      <h3 className="text-lg font-bold text-red-800 mb-4">🔍 Database Diagnostic</h3>
      
      <button 
        onClick={runDiagnostic}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? '🔄 Running...' : '🔄 Run Diagnostic'}
      </button>

      <div className="space-y-4">
        {Object.entries(diagnosticData).map(([testName, result]: [string, any]) => (
          <div key={testName} className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-gray-800">{testName}</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
              {result.error && <p><strong>Error:</strong> <span className="text-red-600">{result.error}</span></p>}
              {result.count !== undefined && <p><strong>Count:</strong> <span className="text-blue-600 font-bold">{result.count}</span></p>}
              {result.columns && <p><strong>Columns:</strong> <span className="text-green-600">{result.columns.join(', ')}</span></p>}
              {result.data && result.data.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-green-600">View Data ({result.data.length} items)</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
              {result.data && result.data.length === 0 && (
                <p className="text-orange-600">⚠️ No data returned</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 