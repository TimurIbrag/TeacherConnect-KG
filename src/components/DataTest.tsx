import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export const DataTest: React.FC = () => {
  const [testResults, setTestResults] = React.useState<any>({});

  const runTests = async () => {
    console.log('🧪 Running data tests...');
    const results: any = {};

    try {
      // Test 1: Check if we can connect to Supabase
      console.log('🔧 Testing Supabase connection...');
      const { data: connectionTest, error: connectionError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      results.connection = {
        success: !connectionError,
        error: connectionError?.message,
        data: connectionTest
      };

      // Test 2: Check profiles table
      console.log('👥 Testing profiles table...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      results.profiles = {
        success: !profilesError,
        error: profilesError?.message,
        count: profilesData?.length || 0,
        data: profilesData
      };

      // Test 3: Check teacher_profiles table
      console.log('👨‍🏫 Testing teacher_profiles table...');
      const { data: teacherData, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .limit(5);
      
      results.teacherProfiles = {
        success: !teacherError,
        error: teacherError?.message,
        count: teacherData?.length || 0,
        data: teacherData
      };

      // Test 4: Check school_profiles table
      console.log('🏫 Testing school_profiles table...');
      const { data: schoolData, error: schoolError } = await supabase
        .from('school_profiles')
        .select('*')
        .limit(5);
      
      results.schoolProfiles = {
        success: !schoolError,
        error: schoolError?.message,
        count: schoolData?.length || 0,
        data: schoolData
      };

      // Test 5: Test the exact query that useTeachers uses
      console.log('🔍 Testing useTeachers query...');
      const { data: teachersQueryData, error: teachersQueryError } = await supabase
        .from('teacher_profiles')
        .select(`*, profiles (*)`)
        .limit(5);
      
      results.teachersQuery = {
        success: !teachersQueryError,
        error: teachersQueryError?.message,
        count: teachersQueryData?.length || 0,
        data: teachersQueryData
      };

      // Test 6: Test the exact query that useSchools uses
      console.log('🔍 Testing useSchools query...');
      const { data: schoolsQueryData, error: schoolsQueryError } = await supabase
        .from('school_profiles')
        .select(`*, profiles (*)`)
        .eq('is_published', true)
        .limit(5);
      
      results.schoolsQuery = {
        success: !schoolsQueryError,
        error: schoolsQueryError?.message,
        count: schoolsQueryData?.length || 0,
        data: schoolsQueryData
      };

    } catch (error) {
      console.error('❌ Error running tests:', error);
      results.generalError = error;
    }

    console.log('📊 Test results:', results);
    setTestResults(results);
  };

  React.useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <h3 className="text-lg font-bold text-blue-800 mb-4">🧪 Data Fetching Test Results</h3>
      
      <button 
        onClick={runTests}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        🔄 Run Tests Again
      </button>

      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]: [string, any]) => (
          <div key={testName} className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-gray-800">{testName}</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
              {result.error && <p><strong>Error:</strong> {result.error}</p>}
              {result.count !== undefined && <p><strong>Count:</strong> {result.count}</p>}
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-blue-600">View Data</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 