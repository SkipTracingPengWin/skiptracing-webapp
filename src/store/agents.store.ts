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
    fetchCurrentAgent: (id: string | number) => Promise<void>;
    addAgent: (data: Partial<Agent>) => Promise<void>;
    updateAgent: (id: string | number, data: Partial<Agent>) => Promise<void>;
    deleteAgent: (id: string | number) => Promise<void>;

    openModal: (mode: 'add' | 'edit' | 'delete', agent?: Agent | null) => void;
    closeModal: () => void;
}

// const normalizeAgent = (a: any): Agent => ({
//     ...a,
//     id: a.id !== undefined ? a._id : a.id
// });

const normalizeAgent = (a: any): Agent => ({
    ...a,
    id: a._id ?? a.id,
});


const unwrapData = (data: any, fieldName: string): any => {
    if (!data) return null;
    console.log(`📦 Unwrapping ${fieldName} from:`, data);
    if (data[fieldName]) return data[fieldName];
    if (data.data && data.data[fieldName]) return data.data[fieldName];
    if (data.data) return data.data;
    // Handle cases where the object might be nested under 'user' or 'data' or is the object itself
    if (data.user) return data.user;
    return data;
};

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
                    const agentsList = unwrapData(data, 'agents');
                    const normalizedData = (Array.isArray(agentsList) ? agentsList : []).map(normalizeAgent);
                    set({ agents: normalizedData, loading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch agents",
                        loading: false,
                    });
                }
            },

            // 🔹 FETCH INDIVIDUAL AGENT
            fetchCurrentAgent: async (id: string | number) => {
                try {
                    set({ loading: true, error: null });
                    const data = await agentServices.getById(id);
                    const agentData = unwrapData(data, 'agent');
                    const normalizedAgent = normalizeAgent(agentData);

                    set((state) => {
                        const exists = state.agents.some(a => String(a.id) === String(id));
                        if (exists) {
                            return {
                                agents: state.agents.map(a => String(a.id) === String(id) ? normalizedAgent : a),
                                loading: false
                            };
                        } else {
                            return {
                                agents: [...state.agents, normalizedAgent],
                                loading: false
                            };
                        }
                    });
                    return normalizedAgent;
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch agent profile",
                        loading: false,
                    });
                }
            },

            // 🔹 ADD AGENT
            addAgent: async (data) => {
                try {
                    set({ loading: true, error: null });
                    const result = await agentServices.create(data);
                    const agentData = unwrapData(result, 'agent');
                    const newAgent = normalizeAgent(agentData);
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
                    console.log(`📡 Store: Updating Agent ${id}`, data);
                    set({ loading: true, error: null });
                    const result = await agentServices.update(id, data);
                    console.log("✅ Store: Update result:", result);
                    const updatedData = unwrapData(result, 'agent');

                    set((state) => {
                        // Find by internal id OR userId used for update
                        const existing = state.agents.find(a =>
                            String(a.id) === String(id) ||
                            (a.userId && String(a.userId) === String(id))
                        );

                        if (!existing) {
                            console.warn(`⚠️ Store: Failed to update local agent state. ID ${id} not found in list.`);
                            return { ...state, loading: false };
                        }

                        const normalized = normalizeAgent({
                            ...existing,
                            ...updatedData
                        });

                        return {
                            agents: state.agents.map((agent) =>
                                (String(agent.id) === String(existing.id)) ? normalized : agent
                            ),
                            loading: false,
                        };
                    });
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
                    console.log(`📡 Store: Deleting Agent ${id}`);
                    set({ loading: true, error: null });
                    const result = await agentServices.delete(id);
                    console.log("✅ Store: Delete result:", result);
                    set((state) => ({
                        agents: state.agents.filter((agent) => String(agent.id) !== String(id)),
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
