import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import keycloak from './keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
  isImpersonating: boolean;
  impersonatedUserEmail: string | null;
  impersonatedUserFirstName: string | null;
  impersonatedUserLastName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUserEmail, setImpersonatedUserEmail] = useState<string | null>(null);
  const [impersonatedUserFirstName, setImpersonatedUserFirstName] = useState<string | null>(null);
  const [impersonatedUserLastName, setImpersonatedUserLastName] = useState<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initializedRef.current) {
      return;
    }

    initializedRef.current = true;

    // Initialize Keycloak only once
    keycloak.init({ onLoad: 'check-sso' })
      .then(() => {
        setIsLoading(false);
        if (keycloak.authenticated) {
          setIsAuthenticated(true);
          setUserEmail(keycloak.tokenParsed?.email || null);
          setUserFirstName(keycloak.tokenParsed?.given_name || null);
          setUserLastName(keycloak.tokenParsed?.family_name || null);
        }

        // Check for impersonated tokens
        const impersonatedToken = localStorage.getItem('impersonated_token');
        const impersonatedEmail = localStorage.getItem('impersonated_user_email');
        const impersonatedFirstName = localStorage.getItem('impersonated_user_first_name');
        const impersonatedLastName = localStorage.getItem('impersonated_user_last_name');

        if (impersonatedToken && impersonatedEmail) {
          setIsImpersonating(true);
          setImpersonatedUserEmail(impersonatedEmail);
          setImpersonatedUserFirstName(impersonatedFirstName);
          setImpersonatedUserLastName(impersonatedLastName);
        }
      })
      .catch((error) => {
        console.error('Keycloak initialization failed:', error);
        setIsLoading(false);
      });

    // Set up event handlers
    keycloak.onAuthSuccess = () => {
      setIsAuthenticated(true);
      setUserEmail(keycloak.tokenParsed?.email || null);
      setUserFirstName(keycloak.tokenParsed?.given_name || null);
      setUserLastName(keycloak.tokenParsed?.family_name || null);
    };

    keycloak.onAuthLogout = () => {
      setIsAuthenticated(false);
      setUserEmail(null);
      setUserFirstName(null);
      setUserLastName(null);
      setIsImpersonating(false);
      setImpersonatedUserEmail(null);
      setImpersonatedUserFirstName(null);
      setImpersonatedUserLastName(null);
      localStorage.removeItem('impersonated_token');
      localStorage.removeItem('impersonated_user_email');
      localStorage.removeItem('impersonated_user_first_name');
      localStorage.removeItem('impersonated_user_last_name');
    };

    keycloak.onAuthError = () => {
      setIsAuthenticated(false);
      setUserEmail(null);
      setUserFirstName(null);
      setUserLastName(null);
      setIsImpersonating(false);
      setImpersonatedUserEmail(null);
      setImpersonatedUserFirstName(null);
      setImpersonatedUserLastName(null);
    };

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(70).catch(() => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserFirstName(null);
        setUserLastName(null);
        setIsImpersonating(false);
        setImpersonatedUserEmail(null);
        setImpersonatedUserFirstName(null);
        setImpersonatedUserLastName(null);
      });
    };
  }, []);

  const login = (email: string) => {
    keycloak.login({ loginHint: email }).catch((error) => {
      console.error('Login failed:', error);
    });
  };

  const logout = () => {
    // Clear impersonated tokens on logout
    localStorage.removeItem('impersonated_token');
    localStorage.removeItem('impersonated_user_email');
    localStorage.removeItem('impersonated_user_first_name');
    localStorage.removeItem('impersonated_user_last_name');
    setIsImpersonating(false);
    setImpersonatedUserEmail(null);
    setImpersonatedUserFirstName(null);
    setImpersonatedUserLastName(null);

    keycloak.logout().catch((error) => {
      console.error('Logout failed:', error);
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      userEmail,
      userFirstName,
      userLastName,
      isLoading,
      login,
      logout,
      isImpersonating,
      impersonatedUserEmail,
      impersonatedUserFirstName,
      impersonatedUserLastName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
