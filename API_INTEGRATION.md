# API Integration Documentation

## Overview

The KFone Platform UI has been updated to integrate with the backend API instead of using local mock data. This document outlines the changes made and how to use the new API-integrated features.

## Changes Made

### 1. API Service Layer (`src/services/api.ts`)

Created a comprehensive API service layer that handles all HTTP requests to the backend:

- **ApiClient**: Generic HTTP client with authentication and error handling
- **Module-specific APIs**: Separate API modules for each backend endpoint
  - `healthApi` - Health checks and system info
  - `authApi` - Authentication and user management
  - `usersApi` - User CRUD operations
  - `clientsApi` - Client management
  - `productsApi` - Product management
  - `resourcesApi` - Resource management
  - `rolesApi` - Role management
  - `teamsApi` - Team management
  - `auditApi` - Audit logs

### 2. Updated Zustand Stores

All stores have been updated to use the API instead of local data:

#### Auth Store (`src/stores/authStore.ts`)
- Integrated with both Keycloak SSO and API authentication
- Added API-based login, register, and token refresh
- Maintains backward compatibility with Keycloak

#### Client Store (`src/stores/clientStore.ts`)
- All CRUD operations now use API endpoints
- Added async operations with proper error handling
- Maintains local state synchronization

#### New Stores Created:
- **Product Store** (`src/stores/productStore.ts`) - Product management
- **Resource Store** (`src/stores/resourceStore.ts`) - Resource management
- **Role Store** (`src/stores/roleStore.ts`) - Role management
- **Team Store** (`src/stores/teamStore.ts`) - Team management

### 3. Updated Dashboard Component

The main Dashboard component has been updated to:
- Use API stores instead of local data
- Show loading states during API calls
- Display error notifications for failed requests
- Support real-time data updates

## Configuration

### Environment Variables

Create a `.env` file in the UI project root:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8081

# Keycloak Configuration (if using SSO)
REACT_APP_KEYCLOAK_URL=http://localhost:8080
REACT_APP_KEYCLOAK_REALM=kfone-platform
REACT_APP_KEYCLOAK_CLIENT_ID=kfone-ui

# Environment
REACT_APP_ENV=development
```

### API Base URL

The API client automatically uses the `REACT_APP_API_URL` environment variable or defaults to `http://localhost:8081`.

## Usage Examples

### Using Stores in Components

```tsx
import { useClientStore, useRoleStore } from './stores';

const MyComponent = () => {
  const { 
    clients, 
    isLoading, 
    error, 
    fetchClients, 
    createClient 
  } = useClientStore();
  
  const { roles, fetchRoles } = useRoleStore();

  useEffect(() => {
    fetchClients();
    fetchRoles();
  }, [fetchClients, fetchRoles]);

  const handleCreateClient = async (clientData) => {
    try {
      await createClient(clientData);
      // Success notification will be shown automatically
    } catch (error) {
      // Error notification will be shown automatically
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {clients.map(client => (
        <div key={client.id}>{client.name}</div>
      ))}
    </div>
  );
};
```

### Direct API Usage

```tsx
import { clientsApi, authApi } from './stores';

// Create a client
const newClient = await clientsApi.create({
  name: 'New Client',
  subscribedProducts: ['Product A', 'Product B'],
  users: [],
  teams: []
});

// Login with API
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password'
});
```

## Error Handling

The API service includes comprehensive error handling:

- **ApiError class**: Custom error class with status codes and messages
- **Automatic error notifications**: Errors are automatically displayed via the UI store
- **Network error handling**: Handles network failures and timeouts
- **Authentication errors**: Automatic token refresh and logout on auth failures

## Authentication

The system supports both authentication methods:

1. **Keycloak SSO**: Traditional SSO flow with automatic token management
2. **API Authentication**: Direct API login with email/password

Tokens are automatically managed and included in API requests.

## Data Flow

1. **Component mounts** → Calls store actions
2. **Store actions** → Make API requests
3. **API responses** → Update store state
4. **Store state changes** → Trigger component re-renders
5. **Error handling** → Show notifications and update error state

## Migration Notes

### Breaking Changes

- Client interface now requires `users` and `teams` arrays
- All CRUD operations are now async
- Error handling is now centralized through the UI store

### Backward Compatibility

- Keycloak integration remains unchanged
- Existing component structure is preserved
- Local state management patterns are maintained

## Testing

To test the API integration:

1. Start the backend API server on port 8081
2. Start the UI development server
3. Navigate to the dashboard
4. Verify that data loads from the API
5. Test CRUD operations (create, read, update, delete)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend has CORS configured for the UI domain
2. **Authentication Errors**: Check that tokens are being sent correctly
3. **Network Errors**: Verify the API URL is correct and the server is running
4. **Data Loading Issues**: Check the browser network tab for failed requests

### Debug Mode

Enable debug logging by setting `REACT_APP_ENV=development` in your `.env` file.

## Next Steps

1. **Database Integration**: Connect the backend to a real database
2. **Real-time Updates**: Implement WebSocket connections for live data
3. **Advanced Features**: Add pagination, filtering, and search
4. **Performance Optimization**: Implement caching and request deduplication 