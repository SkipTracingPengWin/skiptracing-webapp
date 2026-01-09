import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuditLog } from '@/types/audit.types';
import { AuditService, DashboardStats } from '@/services/audit.services';

interface AuditLogState {
    auditLogs: AuditLog[];
    stats: DashboardStats;
    loading: boolean;
    error: string | null;

    fetchLogs: (params?: any) => Promise<void>;
    fetchStats: () => Promise<void>;
    addAuditLog: (log: AuditLog) => void;
}

const initialStats: DashboardStats = {
    totalLogs: 0,
    verifications: 0,
    dataChanges: 0,
    exports: 0
};

export const useAuditLogStore = create<AuditLogState>()(
    devtools(
        (set, get) => ({
            auditLogs: [],
            stats: initialStats,
            loading: false,
            error: null,

            fetchLogs: async (params) => {
                set({ loading: true, error: null });
                try {
                    const response = await AuditService.getLogs(params);
                    // Handle case where API might return { data: [...] } or just [...]
                    const logs = Array.isArray(response) ? response : (response as any).data || [];
                    set({ auditLogs: logs, loading: false });
                } catch (error: any) {
                    set({
                        error: error.message || "Failed to fetch audit logs",
                        loading: false
                    });
                    console.error("Fetch logs error:", error);
                }
            },

            fetchStats: async () => {
                try {
                    const stats = await AuditService.getStats();
                    set({ stats });
                } catch (error) {
                    console.error("Fetch stats error:", error);
                    // Keep initial stats on error to avoid breaking UI
                }
            },

            addAuditLog: (log) =>
                set((state) => ({
                    auditLogs: [log, ...state.auditLogs],
                })),
        }),
        { name: 'AuditLogStore' }
    )
);