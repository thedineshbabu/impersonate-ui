import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
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

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
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
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
