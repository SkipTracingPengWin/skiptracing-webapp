import api from "@/lib/axios";
import { Alert } from "@/types/alert.types";

export const alertService = {
    getAll: async () => {
        const response = await api.get("/alerts/");
        return response.data;
    },

    create: async (data: Partial<Alert>) => {
        const response = await api.post("/alerts/", data);
        return response.data;
    },

    update: async (id: number, data: Partial<Alert>) => {
        const response = await api.put(`/alerts/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/alerts/${id}`);
        return response.data;
    }
};
