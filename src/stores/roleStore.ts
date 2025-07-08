import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { rolesApi, ApiError } from '../services/api';

/**
 * Role interface
 */
export interface Role {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  permissions: string[];
  clientId?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Role assignment interface
 */
export interface RoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string;
  metadata?: Record<string, any>;
}

/**
 * Role management state interface
 */
export interface RoleState {
  // Data
  roles: Role[];
  selectedRole: Role | null;
  roleAssignments: RoleAssignment[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRoles: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    clientId?: string; 
    productId?: string 
  }) => Promise<void>;
  fetchRoleById: (id: string) => Promise<void>;
  selectRole: (roleId: string) => void;
  createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRole: (roleId: string, updates: Partial<Role>) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  assignRoleToUser: (assignmentData: { userId: string; roleId: string; metadata?: any }) => Promise<void>;
  removeRoleFromUser: (removalData: { userId: string; roleId: string; reason?: string }) => Promise<void>;
  fetchRoleUsers: (roleId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  fetchRolePermissions: (roleId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for role management
 * Handles all role-related state and operations with API integration
 */
export const useRoleStore = create<RoleState>()(
  devtools(
    (set, get) => ({
      // Initial state
      roles: [],
      selectedRole: null,
      roleAssignments: [],
      isLoading: false,
      error: null,

      /**
       * Fetch all roles from API
       */
      fetchRoles: async (params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await rolesApi.getAll(params);
          set({ roles: response.data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch roles';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch a specific role by ID
       */
      fetchRoleById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const role = await rolesApi.getById(id);
          set({ selectedRole: role, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch role';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Select a role by ID
       */
      selectRole: (roleId: string) => {
        const role = get().roles.find(r => r.id === roleId) || null;
        set({ selectedRole: role });
      },

      /**
       * Create a new role
       */
      createRole: async (roleData) => {
        try {
          set({ isLoading: true, error: null });
          const newRole = await rolesApi.create(roleData);
          set(state => ({
            roles: [...state.roles, newRole],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create role';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Update an existing role
       */
      updateRole: async (roleId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedRole = await rolesApi.update(roleId, updates);
          set(state => ({
            roles: state.roles.map(role =>
              role.id === roleId ? updatedRole : role
            ),
            selectedRole: state.selectedRole?.id === roleId 
              ? updatedRole
              : state.selectedRole,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update role';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Delete a role
       */
      deleteRole: async (roleId: string) => {
        try {
          set({ isLoading: true, error: null });
          await rolesApi.delete(roleId);
          set(state => ({
            roles: state.roles.filter(role => role.id !== roleId),
            selectedRole: state.selectedRole?.id === roleId ? null : state.selectedRole,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete role';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Assign a role to a user
       */
      assignRoleToUser: async (assignmentData) => {
        try {
          set({ isLoading: true, error: null });
          await rolesApi.assignToUser(assignmentData);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to assign role to user';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Remove a role from a user
       */
      removeRoleFromUser: async (removalData) => {
        try {
          set({ isLoading: true, error: null });
          await rolesApi.removeFromUser(removalData);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to remove role from user';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch users assigned to a role
       */
      fetchRoleUsers: async (roleId: string, params) => {
        try {
          set({ isLoading: true, error: null });
          const users = await rolesApi.getUsers(roleId, params);
          set({ isLoading: false });
          return users;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch role users';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Fetch role permissions
       */
      fetchRolePermissions: async (roleId: string) => {
        try {
          set({ isLoading: true, error: null });
          const permissions = await rolesApi.getPermissions(roleId);
          set(state => ({
            selectedRole: state.selectedRole?.id === roleId
              ? { ...state.selectedRole, permissions }
              : state.selectedRole,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch role permissions';
          set({ error: errorMessage, isLoading: false });
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
      name: 'role-store',
    }
  )
);

/**
 * Hook to get roles by client
 */
export const useRolesByClient = (clientId: string) => {
  const { roles } = useRoleStore();
  return roles.filter(role => role.clientId === clientId);
};

/**
 * Hook to get roles by product
 */
export const useRolesByProduct = (productId: string) => {
  const { roles } = useRoleStore();
  return roles.filter(role => role.productId === productId);
};

/**
 * Hook to get roles by type
 */
export const useRolesByType = (type: string) => {
  const { roles } = useRoleStore();
  return roles.filter(role => role.type === type);
}; 