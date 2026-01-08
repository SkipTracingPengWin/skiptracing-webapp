import api from "@/lib/axios";
import { RecoveryTrend, RecoveryTrendPayload } from "@/types/recovery.types";

export const recoveryService = {
    getAll: async (): Promise<RecoveryTrend[]> => {
        const response = await api.get("recovery-trends/");
        return response.data;
    },

    create: async (data: RecoveryTrendPayload): Promise<RecoveryTrend> => {
        const response = await api.post("recovery-trends/", data);
        return response.data;
    },

    // --- Actions ---
    getActions: async () => {
        const response = await api.get("/recovery-actions");
        return response.data;
    },

    createAction: async (data: any) => {
        const response = await api.post("/recovery-actions", data);
        return response.data;
    },

    updateAction: async (id: string, data: any) => {
        const response = await api.put(`/recovery-actions/${id}`, data);
        return response.data;
    },

    deleteAction: async (id: string) => {
        const response = await api.delete(`/recovery-actions/${id}`);
        return response.data;
    }
};


