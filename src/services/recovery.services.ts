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
    }
};


