import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RecoveryAction } from "@/types/recoveryction.type";
import { recoveryService } from "@/services/recovery.services";
import { borrowerService } from "@/services/borrowers.services";

interface Borrower {
  id: string;
  name: string;
}

interface RecoveryActionsState {
  actions: RecoveryAction[];
  borrowers: Borrower[];
  filteredActions: RecoveryAction[];

  filterType: string;
  filterStatus: string;
  searchQuery: string;

  isLoading: boolean;
  error: string | null;

  fetchActions: () => Promise<void>;
  addAction: (action: Partial<RecoveryAction>) => Promise<void>;
  updateAction: (id: string, updates: Partial<RecoveryAction>) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;

  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  applyFilters: () => void;
}

const initialActions: RecoveryAction[] = [];
const initialBorrowers: Borrower[] = [];

export const useRecoveryActionsStore = create<RecoveryActionsState>()(
  devtools((set, get) => ({
    actions: initialActions,
    borrowers: initialBorrowers,
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
        const [actionsData, borrowersData] = await Promise.all([
          recoveryService.getActions(),
          borrowerService.getAll()
        ]);

        // Map actions with borrower names
        const mappedActions = actionsData.map((action: any) => ({
          ...action,
          borrowerName: borrowersData.find((b: any) =>
            (b.id === action.borrowerId || b._id === action.borrowerId)
          )?.name || "Unknown Borrower"
        }));

        set({
          actions: mappedActions,
          filteredActions: mappedActions,
          borrowers: borrowersData.map((b: any) => ({
            id: b.id || b._id,
            name: b.name
          })),
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
    addAction: async (actionData) => {
      set({ isLoading: true, error: null });
      try {
        // API expects only: borrowerId, type, status, executedAt (optional)
        const payload: any = {
          borrowerId: actionData.borrowerId,
          type: actionData.type,
          status: actionData.status || "PENDING",
        };

        // Only add optional fields if they have a value
        if (actionData.executedAt) {
          payload.executedAt = actionData.executedAt;
        }

        if (actionData.note) {
          payload.note = actionData.note;
        }

        if (actionData.executedBy) {
          payload.executedBy = actionData.executedBy;
        }

        console.log("📤 Sending recovery action payload:", JSON.stringify(payload, null, 2));
        const newAction = await recoveryService.createAction(payload);

        // Map the new action with borrower name
        const state = get();
        const borrowerName = state.borrowers.find((b) =>
          b.id === newAction.borrowerId
        )?.name || "Unknown";

        const mergedAction = {
          ...newAction,
          borrowerName
        };

        set((state) => ({
          actions: [...state.actions, mergedAction],
          filteredActions: [...state.filteredActions, mergedAction],
          isLoading: false
        }));

        // Re-apply filters
        get().applyFilters();

      } catch (error: any) {
        console.error("❌ Failed to create recovery action:", error);
        console.error("📋 Response data:", JSON.stringify(error.response?.data, null, 2));
        console.error("📊 Response status:", error.response?.status);
        console.error("📝 Error message:", error.message);
        set({ error: error.response?.data?.message || error.message, isLoading: false });
        throw error;
      }
    },

    updateAction: async (id, updates) => {
      set({ isLoading: true, error: null });
      try {
        const updated = await recoveryService.updateAction(id, updates);

        set((state) => {
          const newActions = state.actions.map(action =>
            action.id === id ? { ...action, ...updated } : action
          );
          return {
            actions: newActions,
            filteredActions: newActions,
            isLoading: false
          };
        });
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    deleteAction: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await recoveryService.deleteAction(id);
        set((state) => ({
          actions: state.actions.filter((a) => a.id !== id),
          filteredActions: state.filteredActions.filter((a) => a.id !== id),
          isLoading: false
        }));
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
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
          (a) => a.borrowerName?.toLowerCase().includes(q)
        );
      }

      set({ filteredActions: filtered });
    },
  }))
);
