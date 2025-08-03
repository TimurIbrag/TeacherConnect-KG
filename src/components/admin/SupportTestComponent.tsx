import React from 'react';
import { Button } from '@/components/ui/button';
import { useCreateSupportRequest, useSupportRequests } from '@/hooks/useSupportRequests';
import { toast } from 'sonner';

const SupportTestComponent: React.FC = () => {
  const createSupportRequest = useCreateSupportRequest();
  const { data: supportRequests = [], refetch } = useSupportRequests();

  const createTestRequest = async () => {
    try {
      await createSupportRequest.mutateAsync({
        user_name: 'Test User',
        user_email: 'test@example.com',
        subject: 'Test Support Request',
        message: 'This is a test support request to verify the system is working.',
        priority: 'medium'
      });
      
      toast.success('Test support request created successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to create test request');
    }
  };

  const clearAllRequests = () => {
    localStorage.removeItem('support_requests');
    toast.success('All support requests cleared');
    refetch();
  };

  const showCurrentRequests = () => {
    const stored = localStorage.getItem('support_requests');
    console.log('Current support requests in localStorage:', stored);
    console.log('Parsed requests:', stored ? JSON.parse(stored) : []);
    toast.info(`Current requests: ${supportRequests.length}`);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Support System Test</h3>
      <div className="space-y-2">
        <div className="text-sm">
          <strong>Current Requests:</strong> {supportRequests.length}
        </div>
        <div className="flex space-x-2">
          <Button size="sm" onClick={createTestRequest} disabled={createSupportRequest.isPending}>
            {createSupportRequest.isPending ? 'Creating...' : 'Create Test Request'}
          </Button>
          <Button size="sm" variant="outline" onClick={showCurrentRequests}>
            Show Current Requests
          </Button>
          <Button size="sm" variant="destructive" onClick={clearAllRequests}>
            Clear All Requests
          </Button>
        </div>
        {supportRequests.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recent Requests:</h4>
            <div className="space-y-2">
              {supportRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="text-sm p-2 bg-white rounded border">
                  <div><strong>{request.user_name}</strong> - {request.subject}</div>
                  <div className="text-gray-600">{request.user_email}</div>
                  <div className="text-gray-500">{new Date(request.created_at).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTestComponent; 