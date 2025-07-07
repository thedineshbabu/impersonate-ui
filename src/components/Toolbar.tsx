import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import Preferences from './Preferences';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';
import { 
  Menu, 
  User, 
  LogOut, 
  AlertTriangle,
  LayoutDashboard,
  Settings,
  UserCircle,
  Building2,
  Users,
  Star,
  FileText,
  HelpCircle,
  Info,
  Shield
} from 'lucide-react';

interface ToolbarProps {
  onMenuClick?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onMenuClick }) => {
  const { userEmail, userFirstName, userLastName, logout, isImpersonating, impersonatedUserEmail, impersonatedUserFirstName, impersonatedUserLastName } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const handleViewProfile = () => {
    setShowProfileModal(true);
  };

  const handlePreferences = () => {
    setShowPreferences(true);
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Burger Menu - Always visible */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {/* Main Navigation */}
              <DropdownMenuItem 
                onClick={() => handleNavigation('/')} 
                className={isActiveRoute('/') ? 'bg-accent' : ''}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleNavigation('/impersonate')} 
                className={isActiveRoute('/impersonate') ? 'bg-accent' : ''}
              >
                <User className="mr-2 h-4 w-4" />
                <span>Impersonate User</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleNavigation('/roles')} 
                className={isActiveRoute('/roles') ? 'bg-accent' : ''}
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>Manage Roles</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleViewProfile}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePreferences}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <h1 className="text-xl font-semibold">KF Platform Talent Suite</h1>
          
          {isImpersonating && impersonatedUserEmail && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertTriangle className="h-3 w-3" />
              <span>
                Impersonating: {impersonatedUserFirstName && impersonatedUserLastName 
                  ? `${impersonatedUserFirstName} ${impersonatedUserLastName}` 
                  : impersonatedUserEmail}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:block">
                  {userFirstName && userLastName 
                    ? `${userFirstName} ${userLastName}` 
                    : userEmail}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleViewProfile}>
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePreferences}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <Preferences
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  );
};

export default Toolbar;
