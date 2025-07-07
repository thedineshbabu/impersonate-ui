import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // Auto-dismiss after duration (ms)
  persistent?: boolean; // Don't auto-dismiss
}

/**
 * Modal interface
 */
export interface Modal {
  id: string;
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClose?: () => void;
}

/**
 * UI state interface
 */
export interface UIState {
  // Notifications
  notifications: Notification[];
  
  // Modals
  modals: Modal[];
  
  // Sidebar state
  sidebarOpen: boolean;
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  
  // Actions
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Modal actions
  openModal: (modal: Omit<Modal, 'isOpen'>) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Loading actions
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  clearLoadingState: (key: string) => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

/**
 * Zustand store for UI state management
 * Handles notifications, modals, sidebar, loading states, and theme
 */
export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      modals: [],
      sidebarOpen: true,
      globalLoading: false,
      loadingStates: {},
      theme: 'system',
      sidebarCollapsed: false,

      /**
       * Add a new notification
       */
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = { ...notification, id };
        
        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-dismiss if duration is set and not persistent
        if (notification.duration && !notification.persistent) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration);
        }
      },

      /**
       * Remove a notification by ID
       */
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      /**
       * Clear all notifications
       */
      clearNotifications: () => {
        set({ notifications: [] });
      },

      /**
       * Open a modal
       */
      openModal: (modal) => {
        const id = modal.id || Math.random().toString(36).substr(2, 9);
        const newModal = { ...modal, id, isOpen: true };
        
        set(state => ({
          modals: [...state.modals.filter(m => m.id !== id), newModal],
        }));
      },

      /**
       * Close a modal by ID
       */
      closeModal: (id) => {
        set(state => {
          const modal = state.modals.find(m => m.id === id);
          if (modal?.onClose) {
            modal.onClose();
          }
          
          return {
            modals: state.modals.map(m =>
              m.id === id ? { ...m, isOpen: false } : m
            ),
          };
        });
      },

      /**
       * Close all modals
       */
      closeAllModals: () => {
        set(state => {
          // Call onClose for all open modals
          state.modals.forEach(modal => {
            if (modal.isOpen && modal.onClose) {
              modal.onClose();
            }
          });
          
          return {
            modals: state.modals.map(m => ({ ...m, isOpen: false })),
          };
        });
      },

      /**
       * Toggle sidebar open/closed
       */
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      /**
       * Set sidebar open state
       */
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      /**
       * Toggle sidebar collapsed state
       */
      toggleSidebarCollapsed: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      /**
       * Set sidebar collapsed state
       */
      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      /**
       * Set global loading state
       */
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },

      /**
       * Set loading state for a specific key
       */
      setLoadingState: (key, loading) => {
        set(state => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading,
          },
        }));
      },

      /**
       * Clear loading state for a specific key
       */
      clearLoadingState: (key) => {
        set(state => {
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[key];
          return { loadingStates: newLoadingStates };
        });
      },

      /**
       * Set theme
       */
      setTheme: (theme) => {
        set({ theme });
        
        // Apply theme to document
        const root = document.documentElement;
        if (theme === 'dark') {
          root.classList.add('dark');
        } else if (theme === 'light') {
          root.classList.remove('dark');
        } else {
          // System theme
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },
    }),
    {
      name: 'ui-store',
    }
  )
);

/**
 * Custom hook for showing success notifications
 */
export const useSuccessNotification = () => {
  const addNotification = useUIStore(state => state.addNotification);
  
  return (title: string, message: string, duration = 5000) => {
    addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  };
};

/**
 * Custom hook for showing error notifications
 */
export const useErrorNotification = () => {
  const addNotification = useUIStore(state => state.addNotification);
  
  return (title: string, message: string, persistent = false) => {
    addNotification({
      type: 'error',
      title,
      message,
      persistent,
    });
  };
};

/**
 * Custom hook for showing warning notifications
 */
export const useWarningNotification = () => {
  const addNotification = useUIStore(state => state.addNotification);
  
  return (title: string, message: string, duration = 7000) => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  };
};

/**
 * Custom hook for showing info notifications
 */
export const useInfoNotification = () => {
  const addNotification = useUIStore(state => state.addNotification);
  
  return (title: string, message: string, duration = 4000) => {
    addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  };
};

/**
 * Custom hook for managing loading states
 */
export const useLoadingState = (key: string) => {
  const loading = useUIStore(state => state.loadingStates[key] || false);
  const setLoadingState = useUIStore(state => state.setLoadingState);
  const clearLoadingState = useUIStore(state => state.clearLoadingState);
  
  return {
    loading,
    setLoading: (isLoading: boolean) => setLoadingState(key, isLoading),
    clearLoading: () => clearLoadingState(key),
  };
}; 