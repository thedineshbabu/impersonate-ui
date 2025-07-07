import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { 
  useAuthStore, 
  useCurrentUser, 
  useClientStore, 
  useUIStore,
  useSuccessNotification,
  useErrorNotification,
  useWarningNotification,
  useInfoNotification,
  useLoadingState
} from '../stores';

/**
 * Zustand Example Component
 * 
 * This component demonstrates how to use the Zustand stores for:
 * - Authentication state management
 * - Client and user data management
 * - UI state management (notifications, loading states)
 * - Custom hooks for common operations
 */
const ZustandExample: React.FC = () => {
  // Auth store hooks
  const { isAuthenticated, isImpersonating, startImpersonation, stopImpersonation } = useAuthStore();
  const currentUser = useCurrentUser();
  
  // Client store hooks
  const { clients, selectedClient, selectClient, addClient } = useClientStore();
  
  // UI store hooks
  const { sidebarOpen, toggleSidebar, setGlobalLoading } = useUIStore();
  
  // Custom notification hooks
  const showSuccess = useSuccessNotification();
  const showError = useErrorNotification();
  const showWarning = useWarningNotification();
  const showInfo = useInfoNotification();
  
  // Custom loading state hook
  const { loading: exampleLoading, setLoading: setExampleLoading } = useLoadingState('example');

  /**
   * Handle impersonation demo
   */
  const handleImpersonationDemo = () => {
    if (isImpersonating) {
      stopImpersonation();
      showInfo('Impersonation Stopped', 'You are no longer impersonating a user');
    } else {
      startImpersonation({
        email: 'demo.user@example.com',
        firstName: 'Demo',
        lastName: 'User'
      });
      showSuccess('Impersonation Started', 'You are now impersonating Demo User');
    }
  };

  /**
   * Handle client selection demo
   */
  const handleClientSelection = (clientId: string) => {
    selectClient(clientId);
    showInfo('Client Selected', `Selected client: ${clientId}`);
  };

  /**
   * Handle notification demos
   */
  const handleNotificationDemos = () => {
    showSuccess('Success!', 'This is a success notification');
    setTimeout(() => showError('Error!', 'This is an error notification'), 1000);
    setTimeout(() => showWarning('Warning!', 'This is a warning notification'), 2000);
    setTimeout(() => showInfo('Info!', 'This is an info notification'), 3000);
  };

  /**
   * Handle loading state demo
   */
  const handleLoadingDemo = async () => {
    setExampleLoading(true);
    setGlobalLoading(true);
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setExampleLoading(false);
    setGlobalLoading(false);
    showSuccess('Loading Complete', 'The demo operation has completed successfully');
  };

  /**
   * Handle sidebar toggle demo
   */
  const handleSidebarToggle = () => {
    toggleSidebar();
    showInfo('Sidebar Toggled', `Sidebar is now ${sidebarOpen ? 'closed' : 'open'}`);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zustand Store Examples</CardTitle>
          <CardDescription>
            Demonstrating how to use Zustand stores for state management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Authentication State */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Authentication State</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Authenticated:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isAuthenticated ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Current User:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentUser.email || 'Not logged in'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Impersonating:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isImpersonating ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium">Sidebar Open:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {sidebarOpen ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Client State */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Client State</h3>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium">Total Clients:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {clients.length}
              </p>
              {selectedClient && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected Client:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedClient.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Store Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <Button 
                onClick={handleImpersonationDemo}
                variant="outline"
                size="sm"
              >
                {isImpersonating ? 'Stop Impersonation' : 'Start Impersonation'}
              </Button>
              
              <Button 
                onClick={handleNotificationDemos}
                variant="outline"
                size="sm"
              >
                Show Notifications
              </Button>
              
              <Button 
                onClick={handleLoadingDemo}
                variant="outline"
                size="sm"
                disabled={exampleLoading}
              >
                {exampleLoading ? 'Loading...' : 'Loading Demo'}
              </Button>
              
              <Button 
                onClick={handleSidebarToggle}
                variant="outline"
                size="sm"
              >
                Toggle Sidebar
              </Button>
              
              {clients.length > 0 && (
                <Button 
                  onClick={() => handleClientSelection(clients[0].id)}
                  variant="outline"
                  size="sm"
                >
                  Select First Client
                </Button>
              )}
            </div>
          </div>

          {/* Store Benefits */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Zustand Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200">Performance</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Only re-renders components that subscribe to changed state
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Simplicity</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  No providers or complex setup required
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-200">TypeScript</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Full TypeScript support with type inference
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h4 className="font-medium text-orange-800 dark:text-orange-200">DevTools</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Built-in Redux DevTools integration for debugging
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZustandExample; 