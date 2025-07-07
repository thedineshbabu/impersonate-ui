import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useClientStore } from './stores/clientStore';
import { getClients } from './data';
import Layout from './components/Layout';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import ClientDetails from './ClientDetails';
import UserAccess from './components/UserAccess';
import UserDetails from './components/UserDetails';
import TeamDetails from './components/TeamDetails';
import ImpersonateUser from './components/ImpersonateUser';
import Resources from './components/Resources';
import RoleStepperForm from './components/RoleStepperForm';
import Products from './components/Products';
import NotificationToast from './components/NotificationToast';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const { setClients } = useClientStore();

  // Initialize authentication and load client data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeAuth();
        // Load client data
        const clients = getClients();
        setClients(clients);
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [initializeAuth, setClients]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/client/:clientId" element={<ClientDetails />} />
        <Route path="/client/:clientId/users" element={<UserAccess />} />
        <Route path="/client/:clientId/users/:userId" element={<UserDetails />} />
        <Route path="/client/:clientId/teams/:teamId" element={<TeamDetails />} />
        <Route path="/impersonate" element={<ImpersonateUser />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/roles" element={<RoleStepperForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
      <NotificationToast />
    </Router>
  );
};

export default App;
