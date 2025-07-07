import React, { useState } from 'react';
import Toolbar from './Toolbar';
import Footer from './Footer';
import Preferences from './Preferences';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const handlePreferencesClose = () => {
    setShowPreferences(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toolbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <Preferences
        isOpen={showPreferences}
        onClose={handlePreferencesClose}
      />
    </div>
  );
};

export default Layout;
