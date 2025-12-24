// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import type { Agent } from '@/types';


// const agentsData: Agent[] = [
//     {
//         id: 1,
//         name: "Suresh Kumar",
//         email: "suresh.k@example.com",
//         phone: "9876543210",
//         location: "Mumbai",
//         cases: 15,
//         status: "Active",
//         joinedDate: "2023-01-15",
//         successRate: 85,
//         totalRecovered: "₹25,00,000"
//     },
//     {
//         id: 2,
//         name: "Priya Sharma",
//         email: "priya.s@example.com",
//         phone: "9876543211",
//         location: "Delhi",
//         cases: 12,
//         status: "Busy",
//         joinedDate: "2023-03-10",
//         successRate: 92,
//         totalRecovered: "₹18,50,000"
//     },
//     {
//         id: 3,
//         name: "Mohan Raj",
//         email: "mohan.r@example.com",
//         phone: "9876543212",
//         location: "Bangalore",
//         cases: 8,
//         status: "Offline",
//         joinedDate: "2023-06-20",
//         successRate: 78,
//         totalRecovered: "₹12,00,000"
//     }
// ];

// interface AgentState {
//     agents: Agent[];
//     isAddAgentModalOpen: boolean;
//     selectedAgent: Agent | null;
//     modalMode: 'add' | 'edit' | 'delete';
//     loading: boolean;

//     fetchAgents: () => Promise<void>;
//     addAgent: (agent: Partial<Agent>) => void;
//     updateAgent: (id: number, updates: Partial<Agent>) => void;
//     deleteAgent: (id: number) => void;
//     openModal: (mode: 'add' | 'edit' | 'delete', agent?: Agent | null) => void;
//     closeModal: () => void;
// }

// export const useAgentStore = create<AgentState>()(
//     devtools(
//         (set) => ({
//             agents: agentsData,
//             isAddAgentModalOpen: false,
//             selectedAgent: null,
//             modalMode: 'add',
//             loading: false,

//             fetchAgents: async () => {
//                 // Simulating API call since we are using static data for now
//                 set({ agents: agentsData });
//             },
//             addAgent: (agentData) =>
//                 set((state) => {
//                     const nextId = state.agents.length > 0 ? Math.max(...state.agents.map(a => a.id)) + 1 : 1;
//                     const newAgent = {
//                         id: nextId,
//                         cases: 0,
//                         status: "Active",
//                         joinedDate: new Date().toISOString().split("T")[0],
//                         successRate: 0,
//                         totalRecovered: "₹0",
//                         location: "Unknown",
//                         ...agentData,
//                     } as Agent;
//                     return { agents: [...state.agents, newAgent] };
//                 }),
//             openModal: (mode, agent = null) => set({ isAddAgentModalOpen: true, modalMode: mode, selectedAgent: agent }),
//             closeModal: () => set({ isAddAgentModalOpen: false, selectedAgent: null, modalMode: 'add' }),
            
//             updateAgent: (id, updates) =>
//                 set((state) => ({
//                     agents: state.agents.map((a) =>
//                         a.id === id ? { ...a, ...updates } : a
//                     ),
//                 })),
//             deleteAgent: (id) =>
//                 set((state) => ({
//                     agents: state.agents.filter((a) => a.id !== id),
//                 })),
//         }),
//         { name: 'AgentStore' }
//     )
// );








"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { agentServices } from "@/services/agent.services";
import type { Agent } from "@/types";

interface AgentState {
    agents: Agent[];
    loading: boolean;
    error: string | null;

    isAddAgentModalOpen: boolean;
    selectedAgent: Agent | null;
    modalMode: 'add' | 'edit' | 'delete';

    fetchAgents: () => Promise<void>;
    addAgent: (data: Partial<Agent>) => Promise<void>;
    updateAgent: (id: number, data: Partial<Agent>) => Promise<void>;
    deleteAgent: (id: number) => Promise<void>;

    openModal: (mode: 'add' | 'edit' | 'delete', agent?: Agent | null) => void;
    closeModal: () => void;
}

export const useAgentStore = create<AgentState>()(
    devtools(
        (set) => ({
            agents: [],
            loading: false,
            error: null,
            isAddAgentModalOpen: false,
            selectedAgent: null,
            modalMode: 'add',

            // 🔹 FETCH ALL AGENTS
            fetchAgents: async () => {
                try {
                    set({ loading: true, error: null });
                    const data = await agentServices.getAll();
                    set({ agents: data, loading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch agents",
                        loading: false,
                    });
                }
            },

            // 🔹 ADD AGENT
            addAgent: async (data) => {
                try {
                    set({ loading: true, error: null });
                    const newAgent = await agentServices.create(data);
                    set((state) => ({
                        agents: [...state.agents, newAgent],
                        loading: false,
                    }));
                } catch (error: any) {
                    const errorMessage = error.message || "Failed to add agent";
                    set({
                        error: errorMessage,
                        loading: false,
                    });
                    throw new Error(errorMessage);
                }
            },

            // 🔹 UPDATE AGENT
            updateAgent: async (id, data) => {
                try {
                    set({ loading: true, error: null });
                    const updatedAgent = await agentServices.update(id, data);
                    set((state) => ({
                        agents: state.agents.map((agent) =>
                            agent.id === id ? updatedAgent : agent
                        ),
                        loading: false,
                    }));
                } catch (error: any) {
                    const errorMessage = error.message || "Failed to update agent";
                    set({
                        error: errorMessage,
                        loading: false,
                    });
                    throw new Error(errorMessage);
                }
            },

            // 🔹 DELETE AGENT
            deleteAgent: async (id) => {
                try {
                    set({ loading: true, error: null });
                    await agentServices.delete(id);
                    set((state) => ({
                        agents: state.agents.filter((agent) => agent.id !== id),
                        loading: false,
                    }));
                } catch (error: any) {
                    const errorMessage = error.message || "Failed to delete agent";
                    set({
                        error: errorMessage,
                        loading: false,
                    });
                    throw new Error(errorMessage);
                }
            },

            // 🔹 MODAL TOGGLE
            openModal: (mode, agent = null) => set({ isAddAgentModalOpen: true, modalMode: mode, selectedAgent: agent }),
            closeModal: () => set({ isAddAgentModalOpen: false, selectedAgent: null, modalMode: 'add' }),
        }),
        { name: "AgentStore" }
    )
);
