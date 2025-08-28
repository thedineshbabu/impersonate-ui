import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useClientStore, useProductStore, useRoleStore } from '../stores';

/**
 * API Test Component
 * 
 * This component tests the API integration and displays the results
 * to verify that the mock data is working correctly.
 */
const ApiTest: React.FC = () => {
  const { clients, fetchClients, isLoading: clientsLoading, error: clientsError } = useClientStore();
  const { products, fetchProducts, isLoading: productsLoading, error: productsError } = useProductStore();
  const { roles, fetchRoles, isLoading: rolesLoading, error: rolesError } = useRoleStore();
  
  const [testResults, setTestResults] = useState<{
    clients: boolean;
    products: boolean;
    roles: boolean;
  }>({
    clients: false,
    products: false,
    roles: false,
  });

  /**
   * Test all API endpoints
   */
  const runApiTests = async () => {
    try {
      // Test clients API
      await fetchClients();
      setTestResults(prev => ({ ...prev, clients: true }));
      
      // Test products API
      await fetchProducts();
      setTestResults(prev => ({ ...prev, products: true }));
      
      // Test roles API
      await fetchRoles();
      setTestResults(prev => ({ ...prev, roles: true }));
      
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  useEffect(() => {
    runApiTests();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Integration Test</CardTitle>
          <CardDescription>
            Testing API endpoints and mock data functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Results */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Clients API</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Status: {testResults.clients ? '✅ Success' : '⏳ Testing...'}
                </p>
                <p className="text-sm">
                  Loading: {clientsLoading ? 'Yes' : 'No'}
                </p>
                <p className="text-sm">
                  Count: {clients.length}
                </p>
                {clientsError && (
                  <p className="text-sm text-red-600">
                    Error: {clientsError}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Products API</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Status: {testResults.products ? '✅ Success' : '⏳ Testing...'}
                </p>
                <p className="text-sm">
                  Loading: {productsLoading ? 'Yes' : 'No'}
                </p>
                <p className="text-sm">
                  Count: {products.length}
                </p>
                {productsError && (
                  <p className="text-sm text-red-600">
                    Error: {productsError}
                  </p>
                )}
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Roles API</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  Status: {testResults.roles ? '✅ Success' : '⏳ Testing...'}
                </p>
                <p className="text-sm">
                  Loading: {rolesLoading ? 'Yes' : 'No'}
                </p>
                <p className="text-sm">
                  Count: {roles.length}
                </p>
                {rolesError && (
                  <p className="text-sm text-red-600">
                    Error: {rolesError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sample Data Display */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sample Data</h3>
            
            {/* Clients */}
            <div>
              <h4 className="font-medium mb-2">Clients ({clients.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {clients.slice(0, 4).map((client) => (
                  <div key={client.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {client.id}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-medium mb-2">Products ({products.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {products.slice(0, 4).map((product) => (
                  <div key={product.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Type: {product.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles */}
            <div>
              <h4 className="font-medium mb-2">Roles ({roles.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {roles.slice(0, 4).map((role) => (
                  <div key={role.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="font-medium">{role.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Type: {role.type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Retry Button */}
          <div className="flex justify-center">
            <Button onClick={runApiTests} disabled={clientsLoading || productsLoading || rolesLoading}>
              {clientsLoading || productsLoading || rolesLoading ? 'Testing...' : 'Retry Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTest; 