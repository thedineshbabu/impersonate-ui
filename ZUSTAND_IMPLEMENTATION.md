# Zustand Implementation in KFone Platform UI

## Overview

This document describes the implementation of Zustand state management in the KFone Platform UI project. Zustand has been integrated to replace React Context API for better performance, simplicity, and developer experience.

## Why Zustand?

### Benefits Over React Context
- **Performance**: Only re-renders components that subscribe to changed state
- **Simplicity**: No providers or complex setup required
- **TypeScript**: Full TypeScript support with type inference
- **DevTools**: Built-in Redux DevTools integration for debugging
- **Bundle Size**: Lightweight (~2KB) compared to Redux
- **Flexibility**: Can be used for both global and local state

### Key Features
- Persistent state with localStorage
- DevTools integration for debugging
- TypeScript-first design
- Custom hooks for common operations
- Modular store architecture

## Store Architecture

### 1. Auth Store (`src/stores/authStore.ts`)

**Purpose**: Manages authentication state and user impersonation

**State**:
```typescript
interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  isLoading: boolean;
  
  // Impersonation state
  isImpersonating: boolean;
  impersonatedUserEmail: string | null;
  impersonatedUserFirstName: string | null;
  impersonatedUserLastName: string | null;
}
```

**Key Actions**:
- `initializeAuth()`: Initialize Keycloak authentication
- `login(email)`: Login with email hint
- `logout()`: Logout and clear state
- `startImpersonation(user)`: Start impersonating a user
- `stopImpersonation()`: Stop impersonation

**Custom Hooks**:
- `useCurrentUser()`: Returns current user (authenticated or impersonated)

**Persistence**: Impersonation state is persisted to localStorage

### 2. Client Store (`src/stores/clientStore.ts`)

**Purpose**: Manages client, user, and team data

**State**:
```typescript
interface ClientState {
  // Data
  clients: Client[];
  selectedClient: Client | null;
  selectedUser: User | null;
  selectedTeam: Team | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}
```

**Key Actions**:
- `setClients(clients)`: Set client data
- `selectClient(clientId)`: Select a client
- `addClient(client)`: Add new client
- `updateClient(clientId, updates)`: Update client
- `deleteClient(clientId)`: Delete client
- `addUser(clientId, user)`: Add user to client
- `updateUser(clientId, userId, updates)`: Update user
- `deleteUser(clientId, userId)`: Delete user
- `addTeam(clientId, team)`: Add team to client
- `updateTeam(clientId, teamId, updates)`: Update team
- `deleteTeam(clientId, teamId)`: Delete team
- `addUserToTeam(clientId, teamId, userId)`: Add user to team
- `removeUserFromTeam(clientId, teamId, userId)`: Remove user from team

**Custom Hooks**:
- `useUsersByTeam(teamId)`: Get users in a specific team
- `useTeamsByUser(userId)`: Get teams for a specific user

### 3. UI Store (`src/stores/uiStore.ts`)

**Purpose**: Manages UI state (notifications, modals, loading, theme)

**State**:
```typescript
interface UIState {
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: Modal[];
  
  // Sidebar state
  sidebarOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
}
```

**Key Actions**:
- `addNotification(notification)`: Add notification with auto-dismiss
- `removeNotification(id)`: Remove notification
- `openModal(modal)`: Open modal
- `closeModal(id)`: Close modal
- `toggleSidebar()`: Toggle sidebar
- `setGlobalLoading(loading)`: Set global loading state
- `setLoadingState(key, loading)`: Set specific loading state
- `setTheme(theme)`: Set theme (light/dark/system)

**Custom Hooks**:
- `useSuccessNotification()`: Show success notifications
- `useErrorNotification()`: Show error notifications
- `useWarningNotification()`: Show warning notifications
- `useInfoNotification()`: Show info notifications
- `useLoadingState(key)`: Manage loading state for specific operations

## Usage Examples

### Basic Store Usage

```typescript
import { useAuthStore, useClientStore, useUIStore } from '../stores';

const MyComponent = () => {
  // Auth store
  const { isAuthenticated, userEmail, login, logout } = useAuthStore();
  const currentUser = useCurrentUser();
  
  // Client store
  const { clients, selectedClient, selectClient } = useClientStore();
  
  // UI store
  const { sidebarOpen, toggleSidebar } = useUIStore();
  
  // Custom hooks
  const showSuccess = useSuccessNotification();
  const { loading, setLoading } = useLoadingState('my-operation');
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      await login('user@example.com');
      showSuccess('Login Successful', 'Welcome back!');
    } catch (error) {
      showError('Login Failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <p>Welcome, {currentUser.firstName}!</p>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
};
```

### Notification System

```typescript
import { useSuccessNotification, useErrorNotification } from '../stores';

const NotificationExample = () => {
  const showSuccess = useSuccessNotification();
  const showError = useErrorNotification();
  
  const handleOperation = async () => {
    try {
      await someAsyncOperation();
      showSuccess('Operation Complete', 'Data saved successfully');
    } catch (error) {
      showError('Operation Failed', 'Please try again later');
    }
  };
  
  return <button onClick={handleOperation}>Perform Operation</button>;
};
```

### Loading States

```typescript
import { useLoadingState } from '../stores';

const LoadingExample = () => {
  const { loading, setLoading } = useLoadingState('data-fetch');
  
  const fetchData = async () => {
    setLoading(true);
    try {
      await fetch('/api/data');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      <button onClick={fetchData} disabled={loading}>
        Fetch Data
      </button>
    </div>
  );
};
```

## Migration from Context API

### Before (Context API)
```typescript
// AuthContext.tsx
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // ... more state and logic
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Component usage
const MyComponent = () => {
  const { isAuthenticated, login } = useAuth();
  // ...
};
```

### After (Zustand)
```typescript
// authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      login: async (email) => {
        // implementation
      },
      // ... more actions
    }),
    { name: 'auth-storage' }
  )
);

// Component usage
const MyComponent = () => {
  const { isAuthenticated, login } = useAuthStore();
  // ...
};
```

## DevTools Integration

Zustand stores are configured with Redux DevTools for debugging:

```typescript
export const useClientStore = create<ClientState>()(
  devtools(
    (set, get) => ({
      // store implementation
    }),
    {
      name: 'client-store',
    }
  )
);
```

To use DevTools:
1. Install Redux DevTools browser extension
2. Open browser DevTools
3. Go to Redux tab
4. See state changes, actions, and time-travel debugging

## Performance Optimizations

### Selective Subscriptions
```typescript
// Only subscribe to specific state
const isAuthenticated = useAuthStore(state => state.isAuthenticated);
const userEmail = useAuthStore(state => state.userEmail);

// Instead of subscribing to entire store
const { isAuthenticated, userEmail } = useAuthStore();
```

### Memoization
```typescript
import { useMemo } from 'react';

const MyComponent = () => {
  const clients = useClientStore(state => state.clients);
  
  const activeClients = useMemo(() => 
    clients.filter(client => client.status === 'active'),
    [clients]
  );
  
  return <div>{activeClients.length} active clients</div>;
};
```

## Testing

### Store Testing
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      isAuthenticated: false,
      userEmail: null,
      // ... reset other state
    });
  });
  
  it('should handle login', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('test@example.com');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userEmail).toBe('test@example.com');
  });
});
```

## Best Practices

### 1. Store Organization
- Keep stores focused on specific domains
- Use descriptive names for stores and actions
- Export types for better TypeScript support

### 2. State Updates
- Use immutable updates with spread operator
- Avoid direct state mutations
- Use `get()` for accessing current state in actions

### 3. Performance
- Subscribe only to needed state
- Use `useMemo` for expensive computations
- Avoid unnecessary re-renders

### 4. Error Handling
- Handle errors in async actions
- Use UI store for error notifications
- Provide fallback states

### 5. Persistence
- Only persist necessary state
- Use `partialize` to exclude sensitive data
- Handle storage errors gracefully

## Future Enhancements

### Planned Features
1. **Middleware Support**: Add custom middleware for logging, analytics
2. **Async Actions**: Implement async action patterns
3. **Store Composition**: Combine stores for complex state
4. **Offline Support**: Handle offline state management
5. **Real-time Updates**: WebSocket integration with stores

### Migration Path
1. **Gradual Migration**: Migrate components one by one
2. **Backward Compatibility**: Keep Context API during transition
3. **Performance Monitoring**: Track re-render improvements
4. **Developer Training**: Document patterns and best practices

## Conclusion

Zustand provides a modern, performant, and developer-friendly approach to state management in the KFone Platform UI project. The modular store architecture, TypeScript support, and DevTools integration make it an excellent choice for managing complex application state.

The implementation demonstrates:
- Clean separation of concerns
- Type-safe state management
- Efficient re-rendering
- Developer-friendly debugging
- Scalable architecture

For more information, see the [Zustand documentation](https://github.com/pmndrs/zustand) and the example component in `src/components/ZustandExample.tsx`. 