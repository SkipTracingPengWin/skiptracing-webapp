import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RecoveryAction } from "@/types/recoveryction.type";
import { recoveryService } from "@/services/recovery.services";
import { borrowerService } from "@/services/borrowers.services";
import { agentServices } from "@/services/agent.services";

interface Borrower {
  id: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
}

interface RecoveryActionsState {
  actions: RecoveryAction[];
  borrowers: Borrower[];
  agents: Agent[];
  filteredActions: RecoveryAction[];

  filterType: string;
  filterStatus: string;
  searchQuery: string;

  isLoading: boolean;
  error: string | null;

  fetchActions: () => Promise<void>;
  addAction: (action: RecoveryAction) => Promise<void>;
  updateAction: (index: number, updates: Partial<RecoveryAction>) => Promise<void>;
  deleteAction: (index: number) => Promise<void>;

  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  applyFilters: () => void;
}

const initialActions: RecoveryAction[] = [];
const initialBorrowers: Borrower[] = [];
const initialAgents: Agent[] = [];

export const useRecoveryActionsStore = create<RecoveryActionsState>()(
  devtools((set, get) => ({
    actions: initialActions,
    borrowers: initialBorrowers,
    agents: initialAgents,
    filteredActions: initialActions,

    filterType: "All Types",
    filterStatus: "All Status",
    searchQuery: "",

    isLoading: false,
    error: null,

    /* ---------------- FETCH FROM API ---------------- */
    fetchActions: async () => {
      set({ isLoading: true, error: null });

      try {
        const [actionsData, borrowersData, agentsData] = await Promise.all([
          recoveryService.getActions(),
          borrowerService.getAll(),
          agentServices.getAll()
        ]);

        const mappedActions = actionsData.map((action: any) => ({
          ...action,
          borrower: borrowersData.find((b: any) => b.id === action.borrowerId || b._id === action.borrowerId)?.name || action.borrower || "Unknown Borrower",
          agent: agentsData.find((a: any) => a.id === action.agentId || a._id === action.agentId)?.name || action.agent || "Unassigned"
        }));

        set({
          actions: mappedActions,
          filteredActions: mappedActions,
          borrowers: borrowersData.map((b: any) => ({ id: b.id || b._id, name: b.name })),
          agents: agentsData.map((a: any) => ({ id: a.id || a._id, name: a.name })),
          isLoading: false,
        });
      } catch (error: any) {
        // 🔐 Ignore 401 after logout
        if (error.response?.status === 401) {
          set({ isLoading: false });
          return;
        }

        set({
          error: error.message || "Failed to fetch recovery actions",
          isLoading: false,
        });
      }
    },

    /* ---------------- MUTATIONS ---------------- */
    addAction: async (action) => {
      set({ isLoading: true, error: null });
      try {
        const newAction = await recoveryService.createAction(action);

        // Re-map the new action with names from the store
        const state = get();
        const borrowerName = state.borrowers.find((b) => b.id === (action as any).borrowerId)?.name || "Unknown";
        const agentName = state.agents.find((a) => a.id === (action as any).agentId)?.name || "Unassigned";

        const mergedAction = { ...action, ...newAction, borrower: borrowerName, agent: agentName };

        set((state) => ({
          actions: [...state.actions, mergedAction],
          filteredActions: [...state.actions, mergedAction], // Note: this doesn't re-apply filters immediately, but keeps list sync
          isLoading: false
        }));

        // Re-apply filters to ensure view is correct
        get().applyFilters();

      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateAction: async (index, updates) => {
      const state = get();
      const actionToUpdate = state.actions[index];
      if (!actionToUpdate) return;

      set({ isLoading: true, error: null });
      try {
        // @ts-ignore
        const updated = await recoveryService.updateAction(actionToUpdate.id || actionToUpdate._id, updates);

        set((state) => {
          const newActions = [...state.actions];
          newActions[index] = { ...newActions[index], ...updated };
          return {
            actions: newActions,
            // We should re-run applyFilters, but for now we just update
            filteredActions: newActions,
            isLoading: false
          };
        });
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    deleteAction: async (index) => {
      const state = get();
      const actionToDelete = state.actions[index];
      if (!actionToDelete) return;

      set({ isLoading: true, error: null });
      try {
        // @ts-ignore
        await recoveryService.deleteAction(actionToDelete.id || actionToDelete._id);
        set((state) => ({
          actions: state.actions.filter((_, i) => i !== index),
          filteredActions: state.actions.filter((_, i) => i !== index),
          isLoading: false
        }));
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    /* ---------------- FILTERS ---------------- */
    setFilterType: (type) => set({ filterType: type }),
    setFilterStatus: (status) => set({ filterStatus: status }),
    setSearchQuery: (query) => set({ searchQuery: query }),

    applyFilters: () => {
      const { actions, filterType, filterStatus, searchQuery } = get();

      let filtered = actions;

      if (filterType !== "All Types") {
        filtered = filtered.filter(
          (a) => a.type.toLowerCase() === filterType.toLowerCase()
        );
      }

      if (filterStatus !== "All Status") {
        filtered = filtered.filter(
          (a) => a.status.toLowerCase() === filterStatus.toLowerCase()
        );
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.borrower.toLowerCase().includes(q) ||
            a.agent.toLowerCase().includes(q)
        );
      }

      set({ filteredActions: filtered });
    },
  }))
);
