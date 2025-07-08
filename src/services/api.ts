/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 */

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * HTTP Client with error handling and authentication
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication headers
   */
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Generic GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

/**
 * Health Check API
 */
export const healthApi = {
  check: () => apiClient.get<{ status: string; timestamp: string }>('/health'),
  info: () => apiClient.get<{ version: string; environment: string }>('/info'),
  metrics: () => apiClient.get<{ uptime: number; memory: any }>('/metrics'),
};

/**
 * Authentication API
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ access_token: string; refresh_token: string }>('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
    apiClient.post<{ message: string }>('/auth/register', userData),
  
  refresh: (refreshToken: string) =>
    apiClient.post<{ access_token: string }>('/auth/refresh', { refresh_token: refreshToken }),
  
  logout: () => apiClient.post<{ message: string }>('/auth/logout'),
  
  profile: () => apiClient.get<{ id: string; email: string; firstName: string; lastName: string }>('/auth/profile'),
  
  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    apiClient.put<{ message: string }>('/auth/change-password', passwords),
};

/**
 * Users API
 */
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    apiClient.get<PaginatedResponse<any>>('/users', params),
  
  getById: (id: string) => apiClient.get<any>(`/users/${id}`),
  
  create: (userData: any) => apiClient.post<any>('/users', userData),
  
  update: (id: string, userData: any) => apiClient.put<any>(`/users/${id}`, userData),
  
  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),
  
  getByClient: (clientId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<any>>(`/clients/${clientId}/users`, params),
};

/**
 * Clients API
 */
export const clientsApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string 
  }) => apiClient.get<PaginatedResponse<any>>('/clients', params),
  
  getById: (id: string) => apiClient.get<any>(`/clients/${id}`),
  
  create: (clientData: any) => apiClient.post<any>('/clients', clientData),
  
  update: (id: string, clientData: any) => apiClient.put<any>(`/clients/${id}`, clientData),
  
  delete: (id: string) => apiClient.delete<void>(`/clients/${id}`),
  
  getUsers: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<any>>(`/clients/${id}/users`, params),
  
  getProducts: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<any>>(`/clients/${id}/products`, params),
};

/**
 * Products API
 */
export const productsApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    category?: string; 
    clientId?: string 
  }) => apiClient.get<PaginatedResponse<any>>('/products', params),
  
  getById: (id: string) => apiClient.get<any>(`/products/${id}`),
  
  create: (productData: any) => apiClient.post<any>('/products', productData),
  
  update: (id: string, productData: any) => apiClient.put<any>(`/products/${id}`, productData),
  
  delete: (id: string) => apiClient.delete<void>(`/products/${id}`),
  
  getFeatures: (id: string) => apiClient.get<any>(`/products/${id}/features`),
  
  getSpecifications: (id: string) => apiClient.get<any>(`/products/${id}/specifications`),
};

/**
 * Resources API
 */
export const resourcesApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    category?: string; 
    clientId?: string; 
    productId?: string 
  }) => apiClient.get<PaginatedResponse<any>>('/resources', params),
  
  getById: (id: string) => apiClient.get<any>(`/resources/${id}`),
  
  create: (resourceData: any) => apiClient.post<any>('/resources', resourceData),
  
  update: (id: string, resourceData: any) => apiClient.put<any>(`/resources/${id}`, resourceData),
  
  delete: (id: string) => apiClient.delete<void>(`/resources/${id}`),
  
  getPermissions: (id: string) => apiClient.get<any>(`/resources/${id}/permissions`),
  
  getAccessLogs: (id: string, params?: { 
    page?: number; 
    limit?: number; 
    startDate?: string; 
    endDate?: string 
  }) => apiClient.get<any>(`/resources/${id}/access-logs`, params),
};

/**
 * Roles API
 */
export const rolesApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    clientId?: string; 
    productId?: string 
  }) => apiClient.get<PaginatedResponse<any>>('/roles', params),
  
  getById: (id: string) => apiClient.get<any>(`/roles/${id}`),
  
  create: (roleData: any) => apiClient.post<any>('/roles', roleData),
  
  update: (id: string, roleData: any) => apiClient.put<any>(`/roles/${id}`, roleData),
  
  delete: (id: string) => apiClient.delete<void>(`/roles/${id}`),
  
  assignToUser: (assignmentData: { userId: string; roleId: string; metadata?: any }) =>
    apiClient.post<any>('/roles/assign', assignmentData),
  
  removeFromUser: (removalData: { userId: string; roleId: string; reason?: string }) =>
    apiClient.post<void>('/roles/remove', removalData),
  
  getUsers: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<any>(`/roles/${id}/users`, params),
  
  getPermissions: (id: string) => apiClient.get<any>(`/roles/${id}/permissions`),
};

/**
 * Teams API
 */
export const teamsApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    clientId?: string; 
    productId?: string 
  }) => apiClient.get<PaginatedResponse<any>>('/teams', params),
  
  getById: (id: string) => apiClient.get<any>(`/teams/${id}`),
  
  create: (teamData: any) => apiClient.post<any>('/teams', teamData),
  
  update: (id: string, teamData: any) => apiClient.put<any>(`/teams/${id}`, teamData),
  
  delete: (id: string) => apiClient.delete<void>(`/teams/${id}`),
  
  addMember: (memberData: { userId: string; teamId: string; role?: string; metadata?: any }) =>
    apiClient.post<any>('/teams/add-member', memberData),
  
  removeMember: (memberData: { userId: string; teamId: string; reason?: string }) =>
    apiClient.post<void>('/teams/remove-member', memberData),
  
  getMembers: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<any>(`/teams/${id}/members`, params),
  
  getLeader: (id: string) => apiClient.get<any>(`/teams/${id}/leader`),
  
  getSubTeams: (id: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<any>(`/teams/${id}/sub-teams`, params),
};

/**
 * Audit API
 */
export const auditApi = {
  getLogs: (params?: { 
    page?: number; 
    limit?: number; 
    userId?: string; 
    action?: string; 
    resource?: string; 
    startDate?: string; 
    endDate?: string 
  }) => apiClient.get<PaginatedResponse<any>>('/audit/logs', params),
  
  getLogById: (id: string) => apiClient.get<any>(`/audit/logs/${id}`),
  
  exportLogs: (params?: { 
    format?: 'csv' | 'json'; 
    startDate?: string; 
    endDate?: string 
  }) => apiClient.get<any>('/audit/export', params),
};

/**
 * Error handling utility
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API response interceptor for common error handling
 */
export const handleApiError = (error: any): never => {
  if (error instanceof ApiError) {
    throw error;
  }
  
  if (error.response) {
    throw new ApiError(
      error.response.data?.message || 'API request failed',
      error.response.status,
      error.response.data?.code
    );
  }
  
  throw new ApiError(error.message || 'Network error');
}; 