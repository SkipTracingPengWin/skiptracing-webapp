

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Phone,
  MessageSquare,
  MapPin,
  FileText,
  Video,
  MessageCircle,
} from "lucide-react";
import type { RecoveryAction } from "@/types/recoveryction.type";

// Convert icon names to actual Lucide icons
const iconMap: any = {
  Phone: Phone,
  MessageSquare: MessageSquare,
  MapPin: MapPin,
  FileText: FileText,
  Video: Video,
  MessageCircle: MessageCircle,
};

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
  
  addAction: (action: RecoveryAction) => void;
  updateAction: (index: number, updates: Partial<RecoveryAction>) => void;
  deleteAction: (index: number) => void;
  setFilterType: (type: string) => void;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  applyFilters: () => void;
}

const initialActions: RecoveryAction[] = [
  {
    type: "Call",
    icon: iconMap["Phone"],
    borrower: "Rahul Sharma",
    scheduled: "Jan 15, 4:30 PM",
    status: "completed",
    priority: "high",
    agent: "Suresh Kumar",
    outcome: "promise to pay",
  },
  {
    type: "SMS",
    icon: iconMap["MessageSquare"],
    borrower: "Priya Patel",
    scheduled: "Jan 14, 2:30 PM",
    status: "completed",
    priority: "medium",
    agent: "Unassigned",
    outcome: "no response",
  },
  {
    type: "Visit",
    icon: iconMap["MapPin"],
    borrower: "Amit Kumar",
    scheduled: "Jan 20, 3:30 PM",
    status: "scheduled",
    priority: "urgent",
    agent: "Priya Sharma",
    outcome: "-",
  },
  {
    type: "Legal Notice",
    icon: iconMap["FileText"],
    borrower: "Ramesh Verma",
    scheduled: "Jan 18, 10:00 AM",
    status: "pending",
    priority: "high",
    agent: "Agent Kumar",
    outcome: "-",
  },
  {
    type: "IVR Call",
    icon: iconMap["Video"],
    borrower: "Suresh Patel",
    scheduled: "Jan 19, 2:00 PM",
    status: "completed",
    priority: "medium",
    agent: "Agent Raju",
    outcome: "call completed",
  },
  {
    type: "WhatsApp",
    icon: iconMap["MessageCircle"],
    borrower: "Neha Singh",
    scheduled: "Jan 17, 6:30 PM",
    status: "scheduled",
    priority: "low",
    agent: "Priya Sharma",
    outcome: "-",
  },
];

const initialBorrowers: Borrower[] = [
  { id: "b1", name: "Ramesh" },
  { id: "b2", name: "Suresh" },
  { id: "b3", name: "Priya" },
  { id: "b4", name: "Amit" },
  { id: "b5", name: "Rahul Sharma" },
  { id: "b6", name: "Priya Patel" },
  { id: "b7", name: "Amit Kumar" },
  { id: "b8", name: "Ramesh Verma" },
  { id: "b9", name: "Suresh Patel" },
  { id: "b10", name: "Neha Singh" },
];

const initialAgents: Agent[] = [
  { id: "a1", name: "Agent Kumar" },
  { id: "a2", name: "Agent Raju" },
  { id: "a3", name: "Priya Sharma" },
  { id: "a4", name: "Suresh Kumar" },
];

export const useRecoveryActionsStore = create<RecoveryActionsState>()(
  devtools(
    (set, get) => ({
      actions: initialActions,
      borrowers: initialBorrowers,
      agents: initialAgents,
      filteredActions: initialActions,
      filterType: "All Types",
      filterStatus: "All Status",
      searchQuery: "",

      addAction: (action) =>
        set((state) => ({
          actions: [...state.actions, action],
          filteredActions: [...state.actions, action],
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

      setFilterType: (type) =>
        set({ filterType: type }, false, { type: "setFilterType" }),

      setFilterStatus: (status) =>
        set({ filterStatus: status }, false, { type: "setFilterStatus" }),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, { type: "setSearchQuery" }),

      applyFilters: () => {
        const state = get();
        let filtered = state.actions;

        // Filter by type
        if (state.filterType !== "All Types") {
          filtered = filtered.filter(
            (action) =>
              action.type.toLowerCase() === state.filterType.toLowerCase()
          );
        }

        // Filter by status
        if (state.filterStatus !== "All Status") {
          filtered = filtered.filter(
            (action) =>
              action.status.toLowerCase() === state.filterStatus.toLowerCase()
          );
        }

        // Filter by search query
        if (state.searchQuery.trim()) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (action) =>
              action.borrower.toLowerCase().includes(query) ||
              action.agent.toLowerCase().includes(query)
          );
        }

        set({ filteredActions: filtered }, false, { type: "applyFilters" });
      },
    }),
    { name: "RecoveryActionsStore" }
  )
);
