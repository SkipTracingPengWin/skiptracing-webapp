import api from "@/lib/axios";
import { DashboardStats } from "@/types/dashboard.types";

export const dashboardService = {
    getStats: async () => {
        const response = await api.get("/dashboard");
        return response.data;
    },

    updateStats: async (data: Partial<DashboardStats>) => {
        const response = await api.put("/dashboard/", data);
        return response.data;
    }
};