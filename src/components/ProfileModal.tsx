import React from 'react';
import { useAuthStore, useCurrentUser } from '../stores/authStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { isImpersonating } = useAuthStore();
  const currentUser = useCurrentUser();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            View your profile information and current status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
              {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">
                {currentUser.firstName && currentUser.lastName 
                  ? `${currentUser.firstName} ${currentUser.lastName}` 
                  : 'Not available'}
              </h3>
              <p className="text-sm text-muted-foreground">{currentUser.email || 'Not available'}</p>
            </div>
          </div>

          {isImpersonating && (
            <div className="flex items-center justify-center">
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Impersonating User</span>
              </Badge>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
