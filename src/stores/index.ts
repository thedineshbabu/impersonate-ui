/**
 * Zustand Stores Index
 * 
 * This file exports all Zustand stores and their related hooks for easy importing
 * throughout the application. Zustand provides a lightweight, scalable alternative
 * to React Context for state management.
 */

// Auth Store - Authentication and user management
export { 
  useAuthStore, 
  useCurrentUser 
} from './authStore';

// Client Store - Client, user, and team management
export { 
  useClientStore, 
  useUsersByTeam, 
  useTeamsByUser 
} from './clientStore';

// UI Store - UI state management (notifications, modals, loading, etc.)
export { 
  useUIStore,
  useSuccessNotification,
  useErrorNotification,
  useWarningNotification,
  useInfoNotification,
  useLoadingState,
  type Notification,
  type Modal
} from './uiStore';

/**
 * Store Types
 * 
 * These types can be used for TypeScript type checking and documentation
 */
export type { AuthState } from './authStore';
export type { ClientState } from './clientStore';
export type { UIState } from './uiStore'; 