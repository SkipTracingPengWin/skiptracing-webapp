import api from "@/lib/axios";
import { Agent } from "@/types/agent.types"
import { create } from "domain";
export const agentServices = {
    getAll: async () => {
        try {
            const response = await api.get(`/agents`);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error in getAll:", error.message);
            throw error;
        }
    },
    getById: async (id: string | number) => {
        const response = await api.get(`/agents/${id}`);
        return response.data
    },
    create: async (data: Partial<Agent>) => {
        const response = await api.post(`/agents/`, data)
        return response.data
    },
    update: async (id: string | number, data: Partial<Agent>) => {
        const response = await api.put(`/agents/${id}`, data)
        return response.data
    },
    delete: async (id: string | number) => {
        const response = await api.delete(`/agents/${id}`)
        return response.data
    }
}

