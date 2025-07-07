import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore, type Notification } from '../stores/uiStore';
import { cn } from '../lib/utils';

/**
 * Notification Toast Component
 * 
 * Displays notifications from the Zustand UI store with auto-dismiss functionality
 * and different styles based on notification type.
 */
const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  /**
   * Get icon based on notification type
   */
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  /**
   * Get background color based on notification type
   */
  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  /**
   * Get text color based on notification type
   */
  const getTextColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-start p-4 rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
            'transform translate-x-0 opacity-100',
            getBackgroundColor(notification.type)
          )}
          role="alert"
          aria-live="polite"
        >
          {/* Icon */}
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4 className={cn(
                'text-sm font-medium mb-1',
                getTextColor(notification.type)
              )}>
                {notification.title}
              </h4>
            )}
            <p className={cn(
              'text-sm',
              getTextColor(notification.type)
            )}>
              {notification.message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => removeNotification(notification.id)}
            className={cn(
              'flex-shrink-0 ml-3 p-1 rounded-md transition-colors duration-200',
              'hover:bg-black/10 dark:hover:bg-white/10',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            )}
            aria-label="Close notification"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast; 