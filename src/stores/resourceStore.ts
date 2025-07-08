import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { resourcesApi, ApiError } from '../services/api';

/**
 * Resource interface
 */
export interface Resource {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: string;
  url: string;
  permissions: string[];
  clientId?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Resource management state interface
 */
export interface ResourceState {
  // Data
  resources: Resource[];
  selectedResource: Resource | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchResources: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    category?: string; 
    clientId?: string; 
    productId?: string 
  }) => Promise<void>;
  fetchResourceById: (id: string) => Promise<void>;
  selectResource: (resourceId: string) => void;
  createResource: (resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateResource: (resourceId: string, updates: Partial<Resource>) => Promise<void>;
  deleteResource: (resourceId: string) => Promise<void>;
  fetchResourcePermissions: (resourceId: string) => Promise<void>;
  fetchResourceAccessLogs: (resourceId: string, params?: { 
    page?: number; 
    limit?: number; 
    startDate?: string; 
    endDate?: string 
  }) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for resource management
 * Handles all resource-related state and operations with API integration
 */
export const useResourceStore = create<ResourceState>()(
  devtools(
    (set, get) => ({
      // Initial state
      resources: [],
      selectedResource: null,
      isLoading: false,
      error: null,

      /**
       * Fetch all resources from API
       */
      fetchResources: async (params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await resourcesApi.getAll(params);
          set({ resources: response.data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch resources';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch a specific resource by ID
       */
      fetchResourceById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const resource = await resourcesApi.getById(id);
          set({ selectedResource: resource, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch resource';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Select a resource by ID
       */
      selectResource: (resourceId: string) => {
        const resource = get().resources.find(r => r.id === resourceId) || null;
        set({ selectedResource: resource });
      },

      /**
       * Create a new resource
       */
      createResource: async (resourceData) => {
        try {
          set({ isLoading: true, error: null });
          const newResource = await resourcesApi.create(resourceData);
          set(state => ({
            resources: [...state.resources, newResource],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create resource';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Update an existing resource
       */
      updateResource: async (resourceId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedResource = await resourcesApi.update(resourceId, updates);
          set(state => ({
            resources: state.resources.map(resource =>
              resource.id === resourceId ? updatedResource : resource
            ),
            selectedResource: state.selectedResource?.id === resourceId 
              ? updatedResource
              : state.selectedResource,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update resource';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Delete a resource
       */
      deleteResource: async (resourceId: string) => {
        try {
          set({ isLoading: true, error: null });
          await resourcesApi.delete(resourceId);
          set(state => ({
            resources: state.resources.filter(resource => resource.id !== resourceId),
            selectedResource: state.selectedResource?.id === resourceId ? null : state.selectedResource,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete resource';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch resource permissions
       */
      fetchResourcePermissions: async (resourceId: string) => {
        try {
          set({ isLoading: true, error: null });
          const permissions = await resourcesApi.getPermissions(resourceId);
          set(state => ({
            selectedResource: state.selectedResource?.id === resourceId
              ? { ...state.selectedResource, permissions }
              : state.selectedResource,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch resource permissions';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch resource access logs
       */
      fetchResourceAccessLogs: async (resourceId: string, params) => {
        try {
          set({ isLoading: true, error: null });
          const accessLogs = await resourcesApi.getAccessLogs(resourceId, params);
          set({ isLoading: false });
          return accessLogs;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch resource access logs';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Set loading state
       */
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      /**
       * Set error state
       */
      setError: (error: string | null) => {
        set({ error });
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'resource-store',
    }
  )
);

/**
 * Hook to get resources by client
 */
export const useResourcesByClient = (clientId: string) => {
  const { resources } = useResourceStore();
  return resources.filter(resource => resource.clientId === clientId);
};

/**
 * Hook to get resources by product
 */
export const useResourcesByProduct = (productId: string) => {
  const { resources } = useResourceStore();
  return resources.filter(resource => resource.productId === productId);
};

/**
 * Hook to get resources by type
 */
export const useResourcesByType = (type: string) => {
  const { resources } = useResourceStore();
  return resources.filter(resource => resource.type === type);
};

/**
 * Hook to get resources by category
 */
export const useResourcesByCategory = (category: string) => {
  const { resources } = useResourceStore();
  return resources.filter(resource => resource.category === category);
}; 