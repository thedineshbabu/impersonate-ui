/**
 * Stores Index
 * Central export point for all Zustand stores
 */

// Auth Store
export { useAuthStore } from './authStore';
export type { AuthState } from './authStore';

// Client Store
export { useClientStore } from './clientStore';
export type { ClientState } from './clientStore';

// Product Store
export { useProductStore, useProductsByClient, useProductsByCategory, useProductsByType } from './productStore';
export type { ProductState, Product } from './productStore';

// Resource Store
export { useResourceStore, useResourcesByClient, useResourcesByProduct, useResourcesByType, useResourcesByCategory } from './resourceStore';
export type { ResourceState, Resource } from './resourceStore';

// Role Store
export { useRoleStore, useRolesByClient, useRolesByProduct, useRolesByType } from './roleStore';
export type { RoleState, Role, RoleAssignment } from './roleStore';

// Team Store
export { useTeamStore, useTeamsByClient, useTeamsByProduct, useTeamsByType, useSubTeams } from './teamStore';
export type { TeamState, Team, TeamMember } from './teamStore';

// UI Store
export { useUIStore } from './uiStore';
export type { UIState } from './uiStore';

// API Service
export { 
  apiClient, 
  healthApi, 
  authApi, 
  usersApi, 
  clientsApi, 
  productsApi, 
  resourcesApi, 
  rolesApi, 
  teamsApi, 
  auditApi,
  ApiError,
  handleApiError 
} from '../services/api';

export type { ApiResponse, PaginatedResponse } from '../services/api'; 