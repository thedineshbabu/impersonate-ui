import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import keycloak from '../keycloak';

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
  
  // Impersonation state
  isImpersonating: boolean;
  impersonatedUserEmail: string | null;
  impersonatedUserFirstName: string | null;
  impersonatedUserLastName: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  startImpersonation: (user: {
    email: string;
    firstName: string;
    lastName: string;
  }) => void;
  stopImpersonation: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Zustand store for authentication state management
 * Replaces the AuthContext with a more efficient and scalable solution
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
          set({ isLoading: true });
          
          // Initialize Keycloak
          await keycloak.init({ onLoad: 'check-sso' });
          
          if (keycloak.authenticated) {
            set({
              isAuthenticated: true,
              userEmail: keycloak.tokenParsed?.email || null,
              userFirstName: keycloak.tokenParsed?.given_name || null,
              userLastName: keycloak.tokenParsed?.family_name || null,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
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
            set({
              isAuthenticated: true,
              userEmail: keycloak.tokenParsed?.email || null,
              userFirstName: keycloak.tokenParsed?.given_name || null,
              userLastName: keycloak.tokenParsed?.family_name || null,
            });
          };

          keycloak.onAuthLogout = () => {
            get().stopImpersonation();
            set({
              isAuthenticated: false,
              userEmail: null,
              userFirstName: null,
              userLastName: null,
            });
          };

          keycloak.onAuthError = () => {
            get().stopImpersonation();
            set({
              isAuthenticated: false,
              userEmail: null,
              userFirstName: null,
              userLastName: null,
            });
          };

          keycloak.onTokenExpired = () => {
            keycloak.updateToken(70).catch(() => {
              get().stopImpersonation();
              set({
                isAuthenticated: false,
                userEmail: null,
                userFirstName: null,
                userLastName: null,
              });
            });
          };

        } catch (error) {
          console.error('Keycloak initialization failed:', error);
          set({ isLoading: false });
        }
      },

      /**
       * Login with email hint
       */
      login: async (email: string) => {
        try {
          await keycloak.login({ loginHint: email });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      /**
       * Logout and clear all authentication state
       */
      logout: async () => {
        try {
          get().stopImpersonation();
          await keycloak.logout();
        } catch (error) {
          console.error('Logout failed:', error);
          throw error;
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
    }),
    {
      name: 'auth-storage',
      // Only persist certain fields, not sensitive data
      partialize: (state) => ({
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