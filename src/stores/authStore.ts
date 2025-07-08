import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import keycloak from '../keycloak';
import { authApi, ApiError } from '../services/api';

/**
 * Authentication state interface
 */
export interface AuthState {
  // Authentication state
  isAuthenticated: boolean;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Impersonation state
  isImpersonating: boolean;
  impersonatedUserEmail: string | null;
  impersonatedUserFirstName: string | null;
  impersonatedUserLastName: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  refreshToken: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  startImpersonation: (user: {
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
  stopImpersonation: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for authentication state management
 * Integrates with both Keycloak SSO and backend API authentication
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      userEmail: null,
      userFirstName: null,
      userLastName: null,
      isLoading: true,
      error: null,
      isImpersonating: false,
      impersonatedUserEmail: null,
      impersonatedUserFirstName: null,
      impersonatedUserLastName: null,

      /**
       * Initialize authentication with Keycloak
       * Sets up event handlers and checks for existing sessions
       */
      initializeAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Initialize Keycloak
          await keycloak.init({ onLoad: 'check-sso' });
          
          if (keycloak.authenticated) {
            // Store Keycloak token for API calls
            localStorage.setItem('access_token', keycloak.token || '');
            
            set({
              isAuthenticated: true,
              userEmail: keycloak.tokenParsed?.email || null,
              userFirstName: keycloak.tokenParsed?.given_name || null,
              userLastName: keycloak.tokenParsed?.family_name || null,
              isLoading: false,
            });
          } else {
            // Check for API token
            const apiToken = localStorage.getItem('access_token');
            if (apiToken) {
              try {
                const profile = await authApi.profile();
                set({
                  isAuthenticated: true,
                  userEmail: profile.email,
                  userFirstName: profile.firstName,
                  userLastName: profile.lastName,
                  isLoading: false,
                });
              } catch (error) {
                // Token is invalid, clear it
                localStorage.removeItem('access_token');
                set({ isLoading: false });
              }
            } else {
              set({ isLoading: false });
            }
          }

          // Check for existing impersonation state
          const impersonatedToken = localStorage.getItem('impersonated_token');
          const impersonatedEmail = localStorage.getItem('impersonated_user_email');
          const impersonatedFirstName = localStorage.getItem('impersonated_user_first_name');
          const impersonatedLastName = localStorage.getItem('impersonated_user_last_name');

          if (impersonatedToken && impersonatedEmail) {
            set({
              isImpersonating: true,
              impersonatedUserEmail: impersonatedEmail,
              impersonatedUserFirstName: impersonatedFirstName,
              impersonatedUserLastName: impersonatedLastName,
            });
          }

          // Set up Keycloak event handlers
          keycloak.onAuthSuccess = () => {
            localStorage.setItem('access_token', keycloak.token || '');
            set({
              isAuthenticated: true,
              userEmail: keycloak.tokenParsed?.email || null,
              userFirstName: keycloak.tokenParsed?.given_name || null,
              userLastName: keycloak.tokenParsed?.family_name || null,
            });
          };

          keycloak.onAuthLogout = () => {
            get().stopImpersonation();
            localStorage.removeItem('access_token');
            set({
              isAuthenticated: false,
              userEmail: null,
              userFirstName: null,
              userLastName: null,
            });
          };

          keycloak.onAuthError = () => {
            get().stopImpersonation();
            localStorage.removeItem('access_token');
            set({
              isAuthenticated: false,
              userEmail: null,
              userFirstName: null,
              userLastName: null,
            });
          };

          keycloak.onTokenExpired = () => {
            keycloak.updateToken(70).then(() => {
              localStorage.setItem('access_token', keycloak.token || '');
            }).catch(() => {
              get().stopImpersonation();
              localStorage.removeItem('access_token');
              set({
                isAuthenticated: false,
                userEmail: null,
                userFirstName: null,
                userLastName: null,
              });
            });
          };

        } catch (error) {
          console.error('Authentication initialization failed:', error);
          set({ isLoading: false, error: 'Authentication initialization failed' });
        }
      },

      /**
       * Login with email and optional password
       * Supports both Keycloak SSO and API-based authentication
       */
      login: async (email: string, password?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          if (password) {
            // API-based login
            const response = await authApi.login({ email, password });
            localStorage.setItem('access_token', response.access_token);
            if (response.refresh_token) {
              localStorage.setItem('refresh_token', response.refresh_token);
            }
            
            // Fetch user profile
            const profile = await authApi.profile();
            set({
              isAuthenticated: true,
              userEmail: profile.email,
              userFirstName: profile.firstName,
              userLastName: profile.lastName,
              isLoading: false,
            });
          } else {
            // Keycloak SSO login
            await keycloak.login({ loginHint: email });
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Login failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Register a new user
       */
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          await authApi.register(userData);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Refresh authentication token
       */
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await authApi.refresh(refreshToken);
          localStorage.setItem('access_token', response.access_token);
        } catch (error) {
          // Refresh failed, redirect to login
          get().logout();
          throw error;
        }
      },

      /**
       * Change user password
       */
      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          set({ isLoading: true, error: null });
          await authApi.changePassword({ currentPassword, newPassword });
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Password change failed';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Logout and clear all authentication state
       */
      logout: async () => {
        try {
          set({ isLoading: true });
          get().stopImpersonation();
          
          // Try to logout from API
          try {
            await authApi.logout();
          } catch (error) {
            // API logout failed, continue with local cleanup
            console.warn('API logout failed:', error);
          }
          
          // Clear local storage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          
          // Try Keycloak logout
          try {
            await keycloak.logout();
          } catch (error) {
            // Keycloak logout failed, continue with local cleanup
            console.warn('Keycloak logout failed:', error);
          }
          
          set({
            isAuthenticated: false,
            userEmail: null,
            userFirstName: null,
            userLastName: null,
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout failed:', error);
          // Force local cleanup even if logout fails
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({
            isAuthenticated: false,
            userEmail: null,
            userFirstName: null,
            userLastName: null,
            isLoading: false,
          });
        }
      },

      /**
       * Start impersonating a user
       */
      startImpersonation: (user) => {
        // In a real implementation, you would get an impersonation token from the backend
        const impersonationToken = 'mock-impersonation-token';
        
        localStorage.setItem('impersonated_token', impersonationToken);
        localStorage.setItem('impersonated_user_email', user.email);
        localStorage.setItem('impersonated_user_first_name', user.firstName);
        localStorage.setItem('impersonated_user_last_name', user.lastName);

        set({
          isImpersonating: true,
          impersonatedUserEmail: user.email,
          impersonatedUserFirstName: user.firstName,
          impersonatedUserLastName: user.lastName,
        });
      },

      /**
       * Stop impersonating and clear impersonation state
       */
      stopImpersonation: () => {
        localStorage.removeItem('impersonated_token');
        localStorage.removeItem('impersonated_user_email');
        localStorage.removeItem('impersonated_user_first_name');
        localStorage.removeItem('impersonated_user_last_name');

        set({
          isImpersonating: false,
          impersonatedUserEmail: null,
          impersonatedUserFirstName: null,
          impersonatedUserLastName: null,
        });
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Set error state
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        // Only persist non-sensitive data
        userEmail: state.userEmail,
        userFirstName: state.userFirstName,
        userLastName: state.userLastName,
        isImpersonating: state.isImpersonating,
        impersonatedUserEmail: state.impersonatedUserEmail,
        impersonatedUserFirstName: state.impersonatedUserFirstName,
        impersonatedUserLastName: state.impersonatedUserLastName,
      }),
    }
  )
);

/**
 * Custom hook for accessing current user information
 * Returns the impersonated user if impersonating, otherwise the authenticated user
 */
export const useCurrentUser = () => {
  const { 
    isImpersonating, 
    impersonatedUserEmail, 
    impersonatedUserFirstName, 
    impersonatedUserLastName,
    userEmail,
    userFirstName,
    userLastName,
  } = useAuthStore();

  if (isImpersonating) {
    return {
      email: impersonatedUserEmail,
      firstName: impersonatedUserFirstName,
      lastName: impersonatedUserLastName,
      isImpersonating: true,
    };
  }

  return {
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
    isImpersonating: false,
  };
}; 