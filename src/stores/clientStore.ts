import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Client, User, Team } from '../data';
import { clientsApi, usersApi, teamsApi, ApiError } from '../services/api';

/**
 * Client management state interface
 */
export interface ClientState {
  // Data
  clients: Client[];
  selectedClient: Client | null;
  selectedUser: User | null;
  selectedTeam: Team | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchClients: (params?: { page?: number; limit?: number; search?: string; status?: string; type?: string }) => Promise<void>;
  fetchClientById: (id: string) => Promise<void>;
  selectClient: (clientId: string) => void;
  selectUser: (userId: string) => void;
  selectTeam: (teamId: string) => void;
  createClient: (client: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (clientId: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  fetchUsersByClient: (clientId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  createUser: (clientId: string, user: Omit<User, 'userId'>) => Promise<void>;
  updateUser: (clientId: string, userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (clientId: string, userId: string) => Promise<void>;
  fetchTeamsByClient: (clientId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  createTeam: (clientId: string, team: Omit<Team, 'teamId'>) => Promise<void>;
  updateTeam: (clientId: string, teamId: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (clientId: string, teamId: string) => Promise<void>;
  addUserToTeam: (clientId: string, teamId: string, userId: string) => Promise<void>;
  removeUserFromTeam: (clientId: string, teamId: string, userId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for client and user management
 * Handles all client-related state and operations with API integration
 */
export const useClientStore = create<ClientState>()(
  devtools(
    (set, get) => ({
      // Initial state
      clients: [],
      selectedClient: null,
      selectedUser: null,
      selectedTeam: null,
      isLoading: false,
      error: null,

      /**
       * Fetch all clients from API
       */
      fetchClients: async (params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await clientsApi.getAll(params);
          set({ clients: response.data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch clients';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch a specific client by ID
       */
      fetchClientById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const client = await clientsApi.getById(id);
          set({ selectedClient: client, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch client';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Select a client by ID
       */
      selectClient: (clientId: string) => {
        const client = get().clients.find(c => c.id === clientId) || null;
        set({ 
          selectedClient: client,
          selectedUser: null, // Reset user selection when client changes
          selectedTeam: null, // Reset team selection when client changes
        });
      },

      /**
       * Select a user by ID within the selected client
       */
      selectUser: (userId: string) => {
        const { selectedClient } = get();
        if (!selectedClient) return;
        
        const user = selectedClient.users.find(u => u.userId === userId) || null;
        set({ selectedUser: user });
      },

      /**
       * Select a team by ID within the selected client
       */
      selectTeam: (teamId: string) => {
        const { selectedClient } = get();
        if (!selectedClient) return;
        
        const team = selectedClient.teams.find(t => t.teamId === teamId) || null;
        set({ selectedTeam: team });
      },

      /**
       * Create a new client
       */
      createClient: async (clientData) => {
        try {
          set({ isLoading: true, error: null });
          const newClient = await clientsApi.create(clientData);
          set(state => ({
            clients: [...state.clients, newClient],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create client';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Update an existing client
       */
      updateClient: async (clientId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedClient = await clientsApi.update(clientId, updates);
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId ? updatedClient : client
            ),
            selectedClient: state.selectedClient?.id === clientId 
              ? updatedClient
              : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update client';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Delete a client
       */
      deleteClient: async (clientId: string) => {
        try {
          set({ isLoading: true, error: null });
          await clientsApi.delete(clientId);
          set(state => ({
            clients: state.clients.filter(client => client.id !== clientId),
            selectedClient: state.selectedClient?.id === clientId ? null : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete client';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch users for a specific client
       */
      fetchUsersByClient: async (clientId: string, params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await clientsApi.getUsers(clientId, params);
          set(state => ({
            selectedClient: state.selectedClient?.id === clientId
              ? { ...state.selectedClient, users: response.data }
              : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch users';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Create a new user for a client
       */
      createUser: async (clientId: string, userData) => {
        try {
          set({ isLoading: true, error: null });
          const newUser = await usersApi.create({ ...userData, clientId });
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId
                ? { ...client, users: [...client.users, newUser] }
                : client
            ),
            selectedClient: state.selectedClient?.id === clientId
              ? { ...state.selectedClient, users: [...state.selectedClient.users, newUser] }
              : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create user';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Update an existing user
       */
      updateUser: async (clientId: string, userId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedUser = await usersApi.update(userId, updates);
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId
                ? {
                    ...client,
                    users: client.users.map(user =>
                      user.userId === userId ? updatedUser : user
                    ),
                  }
                : client
            ),
            selectedClient: state.selectedClient?.id === clientId
              ? {
                  ...state.selectedClient,
                  users: state.selectedClient.users.map(user =>
                    user.userId === userId ? updatedUser : user
                  ),
                }
              : state.selectedClient,
            selectedUser: state.selectedUser?.userId === userId
              ? updatedUser
              : state.selectedUser,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update user';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Delete a user from a client
       */
      deleteUser: async (clientId: string, userId: string) => {
        try {
          set({ isLoading: true, error: null });
          await usersApi.delete(userId);
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId
                ? { ...client, users: client.users.filter(user => user.userId !== userId) }
                : client
            ),
            selectedClient: state.selectedClient?.id === clientId
              ? { ...state.selectedClient, users: state.selectedClient.users.filter(user => user.userId !== userId) }
              : state.selectedClient,
            selectedUser: state.selectedUser?.userId === userId ? null : state.selectedUser,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete user';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch teams for a specific client
       */
      fetchTeamsByClient: async (clientId: string, params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await teamsApi.getAll({ ...params, clientId });
          set(state => ({
            selectedClient: state.selectedClient?.id === clientId
              ? { ...state.selectedClient, teams: response.data }
              : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch teams';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Create a new team for a client
       */
      createTeam: async (clientId: string, teamData) => {
        try {
          set({ isLoading: true, error: null });
          const newTeam = await teamsApi.create({ ...teamData, clientId });
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId
                ? { ...client, teams: [...client.teams, newTeam] }
                : client
            ),
            selectedClient: state.selectedClient?.id === clientId
              ? { ...state.selectedClient, teams: [...state.selectedClient.teams, newTeam] }
              : state.selectedClient,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Update an existing team
       */
      updateTeam: async (clientId: string, teamId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedTeam = await teamsApi.update(teamId, updates);
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId
                ? {
                    ...client,
                    teams: client.teams.map(team =>
                      team.teamId === teamId ? updatedTeam : team
                    ),
                  }
                : client
            ),
            selectedClient: state.selectedClient?.id === clientId
              ? {
                  ...state.selectedClient,
                  teams: state.selectedClient.teams.map(team =>
                    team.teamId === teamId ? updatedTeam : team
                  ),
                }
              : state.selectedClient,
            selectedTeam: state.selectedTeam?.teamId === teamId
              ? updatedTeam
              : state.selectedTeam,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Delete a team from a client
       */
      deleteTeam: async (clientId: string, teamId: string) => {
        try {
          set({ isLoading: true, error: null });
          await teamsApi.delete(teamId);
          set(state => ({
            clients: state.clients.map(client =>
              client.id === clientId
                ? { ...client, teams: client.teams.filter(team => team.teamId !== teamId) }
                : client
            ),
            selectedClient: state.selectedClient?.id === clientId
              ? { ...state.selectedClient, teams: state.selectedClient.teams.filter(team => team.teamId !== teamId) }
              : state.selectedClient,
            selectedTeam: state.selectedTeam?.teamId === teamId ? null : state.selectedTeam,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Add a user to a team
       */
      addUserToTeam: async (clientId: string, teamId: string, userId: string) => {
        try {
          set({ isLoading: true, error: null });
          await teamsApi.addMember({ userId, teamId });
          // Refresh team data to get updated member list
          const { fetchTeamsByClient } = get();
          await fetchTeamsByClient(clientId);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to add user to team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Remove a user from a team
       */
      removeUserFromTeam: async (clientId: string, teamId: string, userId: string) => {
        try {
          set({ isLoading: true, error: null });
          await teamsApi.removeMember({ userId, teamId });
          // Refresh team data to get updated member list
          const { fetchTeamsByClient } = get();
          await fetchTeamsByClient(clientId);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to remove user from team';
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
      name: 'client-store',
    }
  )
);

/**
 * Custom hook for getting users by team
 */
export const useUsersByTeam = (teamId: string) => {
  const { selectedClient } = useClientStore();
  
  if (!selectedClient) return [];
  
  const team = selectedClient.teams.find(t => t.teamId === teamId);
  if (!team) return [];
  
  return selectedClient.users.filter(user => team.members.includes(user.userId));
};

/**
 * Custom hook for getting teams by user
 */
export const useTeamsByUser = (userId: string) => {
  const { selectedClient } = useClientStore();
  
  if (!selectedClient) return [];
  
  return selectedClient.teams.filter(team => team.members.includes(userId));
}; 