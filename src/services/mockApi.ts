/**
 * Mock API Service
 * Provides sample data for development when backend is not available
 */

import { Client, User, Team, Product, Resource, Role } from '../data';

/**
 * Mock API Response wrapper
 */
export interface MockApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Mock Paginated Response wrapper
 */
export interface MockPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Simulate API delay for realistic behavior
 */
const simulateApiDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock Clients Data
 */
const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    type: 'enterprise',
    status: 'active',
    contactEmail: 'contact@acme.com',
    contactPhone: '+1-555-0101',
    address: '123 Business St, City, State 12345',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    metadata: {
      industry: 'Technology',
      size: 'Large',
      region: 'North America'
    }
  },
  {
    id: 'client-2',
    name: 'TechStart Inc',
    type: 'startup',
    status: 'active',
    contactEmail: 'hello@techstart.com',
    contactPhone: '+1-555-0102',
    address: '456 Innovation Ave, Tech City, TC 67890',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
    metadata: {
      industry: 'Software',
      size: 'Small',
      region: 'West Coast'
    }
  },
  {
    id: 'client-3',
    name: 'Global Solutions Ltd',
    type: 'enterprise',
    status: 'active',
    contactEmail: 'info@globalsolutions.com',
    contactPhone: '+1-555-0103',
    address: '789 Corporate Blvd, Business District, BD 11111',
    createdAt: '2024-03-10T09:15:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
    metadata: {
      industry: 'Consulting',
      size: 'Medium',
      region: 'International'
    }
  }
];

/**
 * Mock Users Data
 */
const mockUsers: User[] = [
  {
    userId: 'user-1',
    email: 'john.doe@acme.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    status: 'active',
    clientId: 'client-1',
    teamId: 'team-1',
    lastLogin: '2024-01-20T08:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
    metadata: {
      department: 'IT',
      title: 'System Administrator'
    }
  },
  {
    userId: 'user-2',
    email: 'jane.smith@acme.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    status: 'active',
    clientId: 'client-1',
    teamId: 'team-2',
    lastLogin: '2024-01-19T14:45:00Z',
    createdAt: '2024-01-16T11:00:00Z',
    metadata: {
      department: 'Marketing',
      title: 'Marketing Manager'
    }
  },
  {
    userId: 'user-3',
    email: 'bob.wilson@techstart.com',
    firstName: 'Bob',
    lastName: 'Wilson',
    role: 'admin',
    status: 'active',
    clientId: 'client-2',
    teamId: 'team-3',
    lastLogin: '2024-01-18T16:20:00Z',
    createdAt: '2024-02-20T14:30:00Z',
    metadata: {
      department: 'Engineering',
      title: 'CTO'
    }
  }
];

/**
 * Mock Teams Data
 */
const mockTeams: Team[] = [
  {
    teamId: 'team-1',
    name: 'IT Operations',
    type: 'technical',
    status: 'active',
    clientId: 'client-1',
    leaderId: 'user-1',
    memberCount: 5,
    createdAt: '2024-01-15T10:00:00Z',
    metadata: {
      department: 'IT',
      description: 'Handles all IT infrastructure and operations'
    }
  },
  {
    teamId: 'team-2',
    name: 'Marketing Team',
    type: 'business',
    status: 'active',
    clientId: 'client-1',
    leaderId: 'user-2',
    memberCount: 3,
    createdAt: '2024-01-16T11:00:00Z',
    metadata: {
      department: 'Marketing',
      description: 'Manages marketing campaigns and brand strategy'
    }
  },
  {
    teamId: 'team-3',
    name: 'Development Team',
    type: 'technical',
    status: 'active',
    clientId: 'client-2',
    leaderId: 'user-3',
    memberCount: 8,
    createdAt: '2024-02-20T14:30:00Z',
    metadata: {
      department: 'Engineering',
      description: 'Core development team for product development'
    }
  }
];

/**
 * Mock Products Data
 */
const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Enterprise CRM',
    type: 'software',
    category: 'business',
    status: 'active',
    clientId: 'client-1',
    description: 'Comprehensive customer relationship management solution',
    version: '2.1.0',
    price: 999.99,
    createdAt: '2024-01-15T10:00:00Z',
    metadata: {
      features: ['Contact Management', 'Sales Pipeline', 'Reporting'],
      technology: 'React, Node.js, PostgreSQL'
    }
  },
  {
    id: 'product-2',
    name: 'Cloud Storage Pro',
    type: 'service',
    category: 'infrastructure',
    status: 'active',
    clientId: 'client-1',
    description: 'Secure cloud storage solution with advanced features',
    version: '1.5.2',
    price: 199.99,
    createdAt: '2024-01-20T12:00:00Z',
    metadata: {
      features: ['File Sync', 'Version Control', 'Sharing'],
      technology: 'AWS S3, React, Node.js'
    }
  },
  {
    id: 'product-3',
    name: 'Analytics Dashboard',
    type: 'software',
    category: 'analytics',
    status: 'active',
    clientId: 'client-2',
    description: 'Real-time analytics and reporting dashboard',
    version: '1.0.0',
    price: 499.99,
    createdAt: '2024-02-25T09:00:00Z',
    metadata: {
      features: ['Real-time Charts', 'Custom Reports', 'Data Export'],
      technology: 'Vue.js, Python, MongoDB'
    }
  }
];

/**
 * Mock Resources Data
 */
const mockResources: Resource[] = [
  {
    id: 'resource-1',
    name: 'Database Access',
    type: 'database',
    category: 'infrastructure',
    status: 'active',
    clientId: 'client-1',
    productId: 'product-1',
    description: 'Access to customer database',
    permissions: ['read', 'write'],
    createdAt: '2024-01-15T10:00:00Z',
    metadata: {
      connectionString: 'postgresql://db.example.com:5432/crm',
      backupSchedule: 'daily'
    }
  },
  {
    id: 'resource-2',
    name: 'API Endpoints',
    type: 'api',
    category: 'development',
    status: 'active',
    clientId: 'client-1',
    productId: 'product-1',
    description: 'REST API endpoints for CRM functionality',
    permissions: ['read', 'write', 'delete'],
    createdAt: '2024-01-16T11:00:00Z',
    metadata: {
      baseUrl: 'https://api.crm.example.com/v1',
      rateLimit: '1000 requests/hour'
    }
  },
  {
    id: 'resource-3',
    name: 'File Storage',
    type: 'storage',
    category: 'infrastructure',
    status: 'active',
    clientId: 'client-2',
    productId: 'product-3',
    description: 'File storage for analytics data',
    permissions: ['read', 'write'],
    createdAt: '2024-02-25T09:00:00Z',
    metadata: {
      bucketName: 'analytics-data-bucket',
      region: 'us-west-2'
    }
  }
];

/**
 * Mock Roles Data
 */
const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'System Administrator',
    type: 'technical',
    status: 'active',
    clientId: 'client-1',
    productId: 'product-1',
    description: 'Full system access and administration',
    permissions: ['read', 'write', 'delete', 'admin'],
    createdAt: '2024-01-15T10:00:00Z',
    metadata: {
      level: 'admin',
      scope: 'system-wide'
    }
  },
  {
    id: 'role-2',
    name: 'User Manager',
    type: 'business',
    status: 'active',
    clientId: 'client-1',
    productId: 'product-1',
    description: 'Manage users and basic system settings',
    permissions: ['read', 'write'],
    createdAt: '2024-01-16T11:00:00Z',
    metadata: {
      level: 'manager',
      scope: 'user-management'
    }
  },
  {
    id: 'role-3',
    name: 'Developer',
    type: 'technical',
    status: 'active',
    clientId: 'client-2',
    productId: 'product-3',
    description: 'Development and testing access',
    permissions: ['read', 'write'],
    createdAt: '2024-02-25T09:00:00Z',
    metadata: {
      level: 'developer',
      scope: 'development'
    }
  }
];

/**
 * Mock API Client
 */
class MockApiClient {
  /**
   * Generic GET request with mock data
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    await simulateApiDelay();
    
    // Parse endpoint to determine which data to return
    if (endpoint.includes('/clients')) {
      if (endpoint.includes('/clients/') && !endpoint.includes('/users') && !endpoint.includes('/products')) {
        // Get specific client
        const clientId = endpoint.split('/').pop();
        const client = mockClients.find(c => c.id === clientId);
        if (!client) throw new Error('Client not found');
        return { data: client, success: true } as T;
      } else {
        // Get all clients
        return { 
          data: mockClients, 
          total: mockClients.length, 
          page: 1, 
          limit: 10, 
          totalPages: 1,
          success: true 
        } as T;
      }
    }
    
    if (endpoint.includes('/users')) {
      if (endpoint.includes('/users/')) {
        // Get specific user
        const userId = endpoint.split('/').pop();
        const user = mockUsers.find(u => u.userId === userId);
        if (!user) throw new Error('User not found');
        return { data: user, success: true } as T;
      } else {
        // Get all users
        return { 
          data: mockUsers, 
          total: mockUsers.length, 
          page: 1, 
          limit: 10, 
          totalPages: 1,
          success: true 
        } as T;
      }
    }
    
    if (endpoint.includes('/teams')) {
      if (endpoint.includes('/teams/')) {
        // Get specific team
        const teamId = endpoint.split('/').pop();
        const team = mockTeams.find(t => t.teamId === teamId);
        if (!team) throw new Error('Team not found');
        return { data: team, success: true } as T;
      } else {
        // Get all teams
        return { 
          data: mockTeams, 
          total: mockTeams.length, 
          page: 1, 
          limit: 10, 
          totalPages: 1,
          success: true 
        } as T;
      }
    }
    
    if (endpoint.includes('/products')) {
      if (endpoint.includes('/products/')) {
        // Get specific product
        const productId = endpoint.split('/').pop();
        const product = mockProducts.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        return { data: product, success: true } as T;
      } else {
        // Get all products
        return { 
          data: mockProducts, 
          total: mockProducts.length, 
          page: 1, 
          limit: 10, 
          totalPages: 1,
          success: true 
        } as T;
      }
    }
    
    if (endpoint.includes('/resources')) {
      if (endpoint.includes('/resources/')) {
        // Get specific resource
        const resourceId = endpoint.split('/').pop();
        const resource = mockResources.find(r => r.id === resourceId);
        if (!resource) throw new Error('Resource not found');
        return { data: resource, success: true } as T;
      } else {
        // Get all resources
        return { 
          data: mockResources, 
          total: mockResources.length, 
          page: 1, 
          limit: 10, 
          totalPages: 1,
          success: true 
        } as T;
      }
    }
    
    if (endpoint.includes('/roles')) {
      if (endpoint.includes('/roles/')) {
        // Get specific role
        const roleId = endpoint.split('/').pop();
        const role = mockRoles.find(r => r.id === roleId);
        if (!role) throw new Error('Role not found');
        return { data: role, success: true } as T;
      } else {
        // Get all roles
        return { 
          data: mockRoles, 
          total: mockRoles.length, 
          page: 1, 
          limit: 10, 
          totalPages: 1,
          success: true 
        } as T;
      }
    }
    
    if (endpoint.includes('/health')) {
      return { status: 'healthy', timestamp: new Date().toISOString(), success: true } as T;
    }
    
    throw new Error('Endpoint not found');
  }

  /**
   * Generic POST request (mock implementation)
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    await simulateApiDelay();
    return { message: 'Success', success: true } as T;
  }

  /**
   * Generic PUT request (mock implementation)
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    await simulateApiDelay();
    return { message: 'Updated successfully', success: true } as T;
  }

  /**
   * Generic DELETE request (mock implementation)
   */
  async delete<T>(endpoint: string): Promise<T> {
    await simulateApiDelay();
    return { message: 'Deleted successfully', success: true } as T;
  }
}

// Create mock API client instance
export const mockApiClient = new MockApiClient();

/**
 * Mock API Services
 */
export const mockHealthApi = {
  check: () => mockApiClient.get<{ status: string; timestamp: string }>('/health'),
  info: () => mockApiClient.get<{ version: string; environment: string }>('/info'),
  metrics: () => mockApiClient.get<{ uptime: number; memory: any }>('/metrics'),
};

export const mockAuthApi = {
  login: (credentials: { email: string; password: string }) =>
    mockApiClient.post<{ access_token: string; refresh_token: string }>('/auth/login', credentials),
  
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) =>
    mockApiClient.post<{ message: string }>('/auth/register', userData),
  
  refresh: (refreshToken: string) =>
    mockApiClient.post<{ access_token: string }>('/auth/refresh', { refresh_token: refreshToken }),
  
  logout: () => mockApiClient.post<{ message: string }>('/auth/logout'),
  
  profile: () => mockApiClient.get<{ id: string; email: string; firstName: string; lastName: string }>('/auth/profile'),
  
  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    mockApiClient.put<{ message: string }>('/auth/change-password', passwords),
};

export const mockUsersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    mockApiClient.get<MockPaginatedResponse<any>>('/users', params),
  
  getById: (id: string) => mockApiClient.get<any>(`/users/${id}`),
  
  create: (userData: any) => mockApiClient.post<any>('/users', userData),
  
  update: (id: string, userData: any) => mockApiClient.put<any>(`/users/${id}`, userData),
  
  delete: (id: string) => mockApiClient.delete<void>(`/users/${id}`),
  
  getByClient: (clientId: string, params?: { page?: number; limit?: number }) =>
    mockApiClient.get<MockPaginatedResponse<any>>(`/clients/${clientId}/users`, params),
};

export const mockClientsApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string 
  }) => mockApiClient.get<MockPaginatedResponse<any>>('/clients', params),
  
  getById: (id: string) => mockApiClient.get<any>(`/clients/${id}`),
  
  create: (clientData: any) => mockApiClient.post<any>('/clients', clientData),
  
  update: (id: string, clientData: any) => mockApiClient.put<any>(`/clients/${id}`, clientData),
  
  delete: (id: string) => mockApiClient.delete<void>(`/clients/${id}`),
  
  getUsers: (id: string, params?: { page?: number; limit?: number }) =>
    mockApiClient.get<MockPaginatedResponse<any>>(`/clients/${id}/users`, params),
  
  getProducts: (id: string, params?: { page?: number; limit?: number }) =>
    mockApiClient.get<MockPaginatedResponse<any>>(`/clients/${id}/products`, params),
};

export const mockProductsApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    category?: string; 
    clientId?: string 
  }) => mockApiClient.get<MockPaginatedResponse<any>>('/products', params),
  
  getById: (id: string) => mockApiClient.get<any>(`/products/${id}`),
  
  create: (productData: any) => mockApiClient.post<any>('/products', productData),
  
  update: (id: string, productData: any) => mockApiClient.put<any>(`/products/${id}`, productData),
  
  delete: (id: string) => mockApiClient.delete<void>(`/products/${id}`),
  
  getFeatures: (id: string) => mockApiClient.get<any>(`/products/${id}/features`),
  
  getSpecifications: (id: string) => mockApiClient.get<any>(`/products/${id}/specifications`),
};

export const mockResourcesApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    category?: string; 
    clientId?: string; 
    productId?: string 
  }) => mockApiClient.get<MockPaginatedResponse<any>>('/resources', params),
  
  getById: (id: string) => mockApiClient.get<any>(`/resources/${id}`),
  
  create: (resourceData: any) => mockApiClient.post<any>('/resources', resourceData),
  
  update: (id: string, resourceData: any) => mockApiClient.put<any>(`/resources/${id}`, resourceData),
  
  delete: (id: string) => mockApiClient.delete<void>(`/resources/${id}`),
  
  getPermissions: (id: string) => mockApiClient.get<any>(`/resources/${id}/permissions`),
  
  getAccessLogs: (id: string, params?: { 
    page?: number; 
    limit?: number; 
    startDate?: string; 
    endDate?: string 
  }) => mockApiClient.get<any>(`/resources/${id}/access-logs`, params),
};

export const mockRolesApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    clientId?: string; 
    productId?: string 
  }) => mockApiClient.get<MockPaginatedResponse<any>>('/roles', params),
  
  getById: (id: string) => mockApiClient.get<any>(`/roles/${id}`),
  
  create: (roleData: any) => mockApiClient.post<any>('/roles', roleData),
  
  update: (id: string, roleData: any) => mockApiClient.put<any>(`/roles/${id}`, roleData),
  
  delete: (id: string) => mockApiClient.delete<void>(`/roles/${id}`),
  
  assignToUser: (assignmentData: { userId: string; roleId: string; metadata?: any }) =>
    mockApiClient.post<any>('/roles/assign', assignmentData),
  
  removeFromUser: (removalData: { userId: string; roleId: string; reason?: string }) =>
    mockApiClient.post<void>('/roles/remove', removalData),
  
  getUsers: (id: string, params?: { page?: number; limit?: number }) =>
    mockApiClient.get<any>(`/roles/${id}/users`, params),
  
  getPermissions: (id: string) => mockApiClient.get<any>(`/roles/${id}/permissions`),
};

export const mockTeamsApi = {
  getAll: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    clientId?: string; 
    productId?: string 
  }) => mockApiClient.get<MockPaginatedResponse<any>>('/teams', params),
  
  getById: (id: string) => mockApiClient.get<any>(`/teams/${id}`),
  
  create: (teamData: any) => mockApiClient.post<any>('/teams', teamData),
  
  update: (id: string, teamData: any) => mockApiClient.put<any>(`/teams/${id}`, teamData),
  
  delete: (id: string) => mockApiClient.delete<void>(`/teams/${id}`),
  
  addMember: (memberData: { userId: string; teamId: string; role?: string; metadata?: any }) =>
    mockApiClient.post<any>('/teams/add-member', memberData),
  
  removeMember: (memberData: { userId: string; teamId: string; reason?: string }) =>
    mockApiClient.post<void>('/teams/remove-member', memberData),
  
  getMembers: (id: string, params?: { page?: number; limit?: number }) =>
    mockApiClient.get<any>(`/teams/${id}/members`, params),
  
  getLeader: (id: string) => mockApiClient.get<any>(`/teams/${id}/leader`),
  
  getSubTeams: (id: string, params?: { page?: number; limit?: number }) =>
    mockApiClient.get<any>(`/teams/${id}/sub-teams`, params),
};

export const mockAuditApi = {
  getLogs: (params?: { 
    page?: number; 
    limit?: number; 
    userId?: string; 
    action?: string; 
    resource?: string; 
    startDate?: string; 
    endDate?: string 
  }) => mockApiClient.get<MockPaginatedResponse<any>>('/audit/logs', params),
  
  getLogById: (id: string) => mockApiClient.get<any>(`/audit/logs/${id}`),
  
  exportLogs: (params?: { 
    format?: 'csv' | 'json'; 
    startDate?: string; 
    endDate?: string 
  }) => mockApiClient.get<any>('/audit/export', params),
}; 