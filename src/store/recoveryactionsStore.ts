import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { RecoveryAction } from "@/types/recoveryction.type"; // Adjust path as needed

interface RecoveryActionsState {
  actions: RecoveryAction[];
  addAction: (action: RecoveryAction) => void;
  updateAction: (index: number, updates: Partial<RecoveryAction>) => void;
  deleteAction: (index: number) => void;
}

const initialActions: RecoveryAction[] = [
  {
    type: "Call",
    icon: "Phone",
    borrower: "Rahul Sharma",
    scheduled: "Jan 15, 4:30 PM",
    status: "completed",
    priority: "high",
    agent: "Suresh Kumar",
    outcome: "promise to pay",
  },
  {
    type: "Sms",
    icon: "MessageSquare",
    borrower: "Priya Patel",
    scheduled: "Jan 14, 2:30 PM",
    status: "completed",
    priority: "medium",
    agent: "Unassigned",
    outcome: "no response",
  },
  {
    type: "Visit",
    icon: "MapPin",
    borrower: "Amit Kumar",
    scheduled: "Jan 20, 3:30 PM",
    status: "scheduled",
    priority: "urgent",
    agent: "Priya Sharma",
    outcome: "-",
  },
];

export const useRecoveryActionsStore = create<RecoveryActionsState>()(
  devtools((set) => ({
    actions: initialActions,
    addAction: (action) =>
      set((state) => ({
        actions: [...state.actions, action],
      })),
    updateAction: (index, updates) =>
      set((state) => ({
        actions: state.actions.map((action, i) =>
          i === index ? { ...action, ...updates } : action
        ),
      })),
    deleteAction: (index) =>
      set((state) => ({
        actions: state.actions.filter((_, i) => i !== index),
      })),
  }), { name: "RecoveryActionsStore" })
);
