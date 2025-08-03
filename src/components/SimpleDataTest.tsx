import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SimpleDataTest: React.FC = () => {
  const [results, setResults] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);

  const testDirectFetch = async () => {
    setLoading(true);
    console.log('🧪 Starting simple data test...');
    
    const testResults: any = {};

    try {
      // Test 1: Direct profiles fetch
      console.log('🔍 Testing direct profiles fetch...');
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(3);
      
      testResults.profiles = {
        success: !profilesError,
        error: profilesError?.message,
        count: profilesData?.length || 0,
        data: profilesData
      };

      // Test 2: Direct teacher_profiles fetch
      console.log('🔍 Testing direct teacher_profiles fetch...');
      const { data: teacherData, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .limit(3);
      
      testResults.teacherProfiles = {
        success: !teacherError,
        error: teacherError?.message,
        count: teacherData?.length || 0,
        data: teacherData
      };

      // Test 3: Direct school_profiles fetch
      console.log('🔍 Testing direct school_profiles fetch...');
      const { data: schoolData, error: schoolError } = await supabase
        .from('school_profiles')
        .select('*')
        .limit(3);
      
      testResults.schoolProfiles = {
        success: !schoolError,
        error: schoolError?.message,
        count: schoolData?.length || 0,
        data: schoolData
      };

      // Test 4: Test with no filters (like the original working system)
      console.log('🔍 Testing teacher_profiles with no filters...');
      const { data: teacherNoFilter, error: teacherNoFilterError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .limit(3);
      
      testResults.teacherNoFilter = {
        success: !teacherNoFilterError,
        error: teacherNoFilterError?.message,
        count: teacherNoFilter?.length || 0,
        data: teacherNoFilter
      };

      // Test 5: Test with no filters for schools
      console.log('🔍 Testing school_profiles with no filters...');
      const { data: schoolNoFilter, error: schoolNoFilterError } = await supabase
        .from('school_profiles')
        .select('*')
        .limit(3);
      
      testResults.schoolNoFilter = {
        success: !schoolNoFilterError,
        error: schoolNoFilterError?.message,
        count: schoolNoFilter?.length || 0,
        data: schoolNoFilter
      };

    } catch (error) {
      console.error('❌ Error in simple test:', error);
      testResults.generalError = error;
    }

    console.log('📊 Simple test results:', testResults);
    setResults(testResults);
    setLoading(false);
  };

  React.useEffect(() => {
    testDirectFetch();
  }, []);

  return (
    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
      <h3 className="text-lg font-bold text-green-800 mb-4">🔧 Simple Direct Data Test</h3>
      
      <button 
        onClick={testDirectFetch}
        disabled={loading}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? '🔄 Testing...' : '🔄 Test Again'}
      </button>

      <div className="space-y-4">
        {Object.entries(results).map(([testName, result]: [string, any]) => (
          <div key={testName} className="bg-white p-3 rounded border">
            <h4 className="font-semibold text-gray-800">{testName}</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
              {result.error && <p><strong>Error:</strong> <span className="text-red-600">{result.error}</span></p>}
              {result.count !== undefined && <p><strong>Count:</strong> <span className="text-blue-600 font-bold">{result.count}</span></p>}
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