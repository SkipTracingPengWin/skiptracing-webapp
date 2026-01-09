import { AuditLog } from "@/types/audit.types";
import api from "@/lib/axios";

export interface DashboardStats {
    totalLogs: number;
    verifications: number;
    dataChanges: number;
    exports: number;
}

export class AuditService {
    static async getLogs(params?: any) {
        try {
            const response = await api.get<AuditLog[]>('/audit-logs/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            throw error;
        }
    }

    static async getStats() {
        // TODO: Replace with actual stats API endpoint when available
        // For now returning mock stats or derived stats if needed
        return {
            totalLogs: 1250,
            verifications: 450,
            dataChanges: 320,
            exports: 15
        };
    }
}