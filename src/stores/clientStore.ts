import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Client, User, Team } from '../data';

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
  setClients: (clients: Client[]) => void;
  selectClient: (clientId: string) => void;
  selectUser: (userId: string) => void;
  selectTeam: (teamId: string) => void;
  addClient: (client: Client) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;
  addUser: (clientId: string, user: User) => void;
  updateUser: (clientId: string, userId: string, updates: Partial<User>) => void;
  deleteUser: (clientId: string, userId: string) => void;
  addTeam: (clientId: string, team: Team) => void;
  updateTeam: (clientId: string, teamId: string, updates: Partial<Team>) => void;
  deleteTeam: (clientId: string, teamId: string) => void;
  addUserToTeam: (clientId: string, teamId: string, userId: string) => void;
  removeUserFromTeam: (clientId: string, teamId: string, userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for client and user management
 * Handles all client-related state and operations
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
       * Set clients data
       */
      setClients: (clients: Client[]) => {
        set({ clients, error: null });
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
       * Add a new client
       */
      addClient: (client: Client) => {
        set(state => ({
          clients: [...state.clients, client],
          error: null,
        }));
      },

      /**
       * Update an existing client
       */
      updateClient: (clientId: string, updates: Partial<Client>) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId ? { ...client, ...updates } : client
          ),
          selectedClient: state.selectedClient?.id === clientId 
            ? { ...state.selectedClient, ...updates }
            : state.selectedClient,
          error: null,
        }));
      },

      /**
       * Delete a client
       */
      deleteClient: (clientId: string) => {
        set(state => ({
          clients: state.clients.filter(client => client.id !== clientId),
          selectedClient: state.selectedClient?.id === clientId ? null : state.selectedClient,
          error: null,
        }));
      },

      /**
       * Add a new user to a client
       */
      addUser: (clientId: string, user: User) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? { ...client, users: [...client.users, user] }
              : client
          ),
          selectedClient: state.selectedClient?.id === clientId
            ? { ...state.selectedClient, users: [...state.selectedClient.users, user] }
            : state.selectedClient,
          error: null,
        }));
      },

      /**
       * Update an existing user
       */
      updateUser: (clientId: string, userId: string, updates: Partial<User>) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  users: client.users.map(user =>
                    user.userId === userId ? { ...user, ...updates } : user
                  ),
                }
              : client
          ),
          selectedClient: state.selectedClient?.id === clientId
            ? {
                ...state.selectedClient,
                users: state.selectedClient.users.map(user =>
                  user.userId === userId ? { ...user, ...updates } : user
                ),
              }
            : state.selectedClient,
          selectedUser: state.selectedUser?.userId === userId
            ? { ...state.selectedUser, ...updates }
            : state.selectedUser,
          error: null,
        }));
      },

      /**
       * Delete a user from a client
       */
      deleteUser: (clientId: string, userId: string) => {
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
          error: null,
        }));
      },

      /**
       * Add a new team to a client
       */
      addTeam: (clientId: string, team: Team) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? { ...client, teams: [...client.teams, team] }
              : client
          ),
          selectedClient: state.selectedClient?.id === clientId
            ? { ...state.selectedClient, teams: [...state.selectedClient.teams, team] }
            : state.selectedClient,
          error: null,
        }));
      },

      /**
       * Update an existing team
       */
      updateTeam: (clientId: string, teamId: string, updates: Partial<Team>) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  teams: client.teams.map(team =>
                    team.teamId === teamId ? { ...team, ...updates } : team
                  ),
                }
              : client
          ),
          selectedClient: state.selectedClient?.id === clientId
            ? {
                ...state.selectedClient,
                teams: state.selectedClient.teams.map(team =>
                  team.teamId === teamId ? { ...team, ...updates } : team
                ),
              }
            : state.selectedClient,
          selectedTeam: state.selectedTeam?.teamId === teamId
            ? { ...state.selectedTeam, ...updates }
            : state.selectedTeam,
          error: null,
        }));
      },

      /**
       * Delete a team from a client
       */
      deleteTeam: (clientId: string, teamId: string) => {
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
          error: null,
        }));
      },

      /**
       * Add a user to a team
       */
      addUserToTeam: (clientId: string, teamId: string, userId: string) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  teams: client.teams.map(team =>
                    team.teamId === teamId
                      ? { ...team, members: [...team.members, userId] }
                      : team
                  ),
                }
              : client
          ),
          selectedClient: state.selectedClient?.id === clientId
            ? {
                ...state.selectedClient,
                teams: state.selectedClient.teams.map(team =>
                  team.teamId === teamId
                    ? { ...team, members: [...team.members, userId] }
                    : team
                ),
              }
            : state.selectedClient,
          selectedTeam: state.selectedTeam?.teamId === teamId
            ? { ...state.selectedTeam, members: [...state.selectedTeam.members, userId] }
            : state.selectedTeam,
          error: null,
        }));
      },

      /**
       * Remove a user from a team
       */
      removeUserFromTeam: (clientId: string, teamId: string, userId: string) => {
        set(state => ({
          clients: state.clients.map(client =>
            client.id === clientId
              ? {
                  ...client,
                  teams: client.teams.map(team =>
                    team.teamId === teamId
                      ? { ...team, members: team.members.filter(id => id !== userId) }
                      : team
                  ),
                }
              : client
          ),
          selectedClient: state.selectedClient?.id === clientId
            ? {
                ...state.selectedClient,
                teams: state.selectedClient.teams.map(team =>
                  team.teamId === teamId
                    ? { ...team, members: team.members.filter(id => id !== userId) }
                    : team
                ),
              }
            : state.selectedClient,
          selectedTeam: state.selectedTeam?.teamId === teamId
            ? { ...state.selectedTeam, members: state.selectedTeam.members.filter(id => id !== userId) }
            : state.selectedTeam,
          error: null,
        }));
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