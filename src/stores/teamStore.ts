import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { teamsApi, ApiError } from '../services/api';

/**
 * Team interface
 */
export interface Team {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  leaderId?: string;
  parentTeamId?: string;
  clientId?: string;
  productId?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Team member interface
 */
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: string;
  joinedAt: string;
  metadata?: Record<string, any>;
}

/**
 * Team management state interface
 */
export interface TeamState {
  // Data
  teams: Team[];
  selectedTeam: Team | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTeams: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    type?: string; 
    clientId?: string; 
    productId?: string 
  }) => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  selectTeam: (teamId: string) => void;
  createTeam: (team: Omit<Team, 'id' | 'members' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  addMember: (memberData: { userId: string; teamId: string; role?: string; metadata?: any }) => Promise<void>;
  removeMember: (memberData: { userId: string; teamId: string; reason?: string }) => Promise<void>;
  fetchTeamMembers: (teamId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  fetchTeamLeader: (teamId: string) => Promise<void>;
  fetchSubTeams: (teamId: string, params?: { page?: number; limit?: number }) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Zustand store for team management
 * Handles all team-related state and operations with API integration
 */
export const useTeamStore = create<TeamState>()(
  devtools(
    (set, get) => ({
      // Initial state
      teams: [],
      selectedTeam: null,
      isLoading: false,
      error: null,

      /**
       * Fetch all teams from API
       */
      fetchTeams: async (params) => {
        try {
          set({ isLoading: true, error: null });
          const response = await teamsApi.getAll(params);
          set({ teams: response.data, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch teams';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch a specific team by ID
       */
      fetchTeamById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const team = await teamsApi.getById(id);
          set({ selectedTeam: team, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Select a team by ID
       */
      selectTeam: (teamId: string) => {
        const team = get().teams.find(t => t.id === teamId) || null;
        set({ selectedTeam: team });
      },

      /**
       * Create a new team
       */
      createTeam: async (teamData) => {
        try {
          set({ isLoading: true, error: null });
          const newTeam = await teamsApi.create(teamData);
          set(state => ({
            teams: [...state.teams, newTeam],
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
      updateTeam: async (teamId: string, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedTeam = await teamsApi.update(teamId, updates);
          set(state => ({
            teams: state.teams.map(team =>
              team.id === teamId ? updatedTeam : team
            ),
            selectedTeam: state.selectedTeam?.id === teamId 
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
       * Delete a team
       */
      deleteTeam: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });
          await teamsApi.delete(teamId);
          set(state => ({
            teams: state.teams.filter(team => team.id !== teamId),
            selectedTeam: state.selectedTeam?.id === teamId ? null : state.selectedTeam,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Add a member to a team
       */
      addMember: async (memberData) => {
        try {
          set({ isLoading: true, error: null });
          await teamsApi.addMember(memberData);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to add member to team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Remove a member from a team
       */
      removeMember: async (memberData) => {
        try {
          set({ isLoading: true, error: null });
          await teamsApi.removeMember(memberData);
          set({ isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to remove member from team';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch team members
       */
      fetchTeamMembers: async (teamId: string, params) => {
        try {
          set({ isLoading: true, error: null });
          const members = await teamsApi.getMembers(teamId, params);
          set({ isLoading: false });
          return members;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch team members';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      /**
       * Fetch team leader
       */
      fetchTeamLeader: async (teamId: string) => {
        try {
          set({ isLoading: true, error: null });
          const leader = await teamsApi.getLeader(teamId);
          set(state => ({
            selectedTeam: state.selectedTeam?.id === teamId
              ? { ...state.selectedTeam, leaderId: leader.id }
              : state.selectedTeam,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch team leader';
          set({ error: errorMessage, isLoading: false });
        }
      },

      /**
       * Fetch sub-teams
       */
      fetchSubTeams: async (teamId: string, params) => {
        try {
          set({ isLoading: true, error: null });
          const subTeams = await teamsApi.getSubTeams(teamId, params);
          set({ isLoading: false });
          return subTeams;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch sub-teams';
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
      name: 'team-store',
    }
  )
);

/**
 * Hook to get teams by client
 */
export const useTeamsByClient = (clientId: string) => {
  const { teams } = useTeamStore();
  return teams.filter(team => team.clientId === clientId);
};

/**
 * Hook to get teams by product
 */
export const useTeamsByProduct = (productId: string) => {
  const { teams } = useTeamStore();
  return teams.filter(team => team.productId === productId);
};

/**
 * Hook to get teams by type
 */
export const useTeamsByType = (type: string) => {
  const { teams } = useTeamStore();
  return teams.filter(team => team.type === type);
};

/**
 * Hook to get sub-teams of a parent team
 */
export const useSubTeams = (parentTeamId: string) => {
  const { teams } = useTeamStore();
  return teams.filter(team => team.parentTeamId === parentTeamId);
}; 