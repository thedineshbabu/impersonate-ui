import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { X, Moon, Sun, Monitor, Bell, RefreshCw } from 'lucide-react';

interface PreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    // Save preferences logic here
    console.log('Saving preferences:', { theme, notifications, autoRefresh });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your application settings</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Appearance Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Monitor className="mr-2 h-4 w-4" />
              Appearance
            </h3>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="flex items-center"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="flex items-center"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === 'auto' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('auto')}
                  className="flex items-center"
                >
                  <Monitor className="mr-2 h-4 w-4" />
                  Auto
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="notifications">Enable notifications</Label>
            </div>
          </div>

          <Separator />

          {/* Data Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Data
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoRefresh"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="autoRefresh">Auto-refresh data</Label>
            </div>
          </div>
        </CardContent>

        <div className="flex justify-end space-x-2 p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Preferences;
