import { create } from 'zustand';

export interface Agent {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  role?: string;
}

interface AgentStore {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  fetchAgents: () => Promise<void>;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  isLoading: false,
  error: null,
  fetchAgents: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API service call
      // const data = await agentService.getAll();
      
      // Mock data for development
      const mockAgents: Agent[] = [
        { id: '1', name: 'Agent Smith', role: 'FIELD_AGENT' },
        { id: '2', name: 'Agent Jones', role: 'RECOVERY_AGENT' },
      ];
      
      set({ agents: mockAgents, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
}));