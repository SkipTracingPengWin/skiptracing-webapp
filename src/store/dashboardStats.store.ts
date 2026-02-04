import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DashboardStats } from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.services';

const initialDashboardStats: DashboardStats = {
    totalBorrowers: 0,
    verified: 0,
    inRecovery: 0,
    activeAgents: 0,
    pendingVerifications: 0,
    slaAlerts: 0,
    totalRecovered: "0",
    recoveryRate: 0
};

interface DashboardStatsState {
    dashboardStats: DashboardStats;
    loading: boolean;
    fetchStats: () => Promise<void>;
    updateDashboardStats: (updates: Partial<DashboardStats>) => void;
}

export const useDashboardStatsStore = create<DashboardStatsState>()(
    devtools(
        (set) => ({
            dashboardStats: initialDashboardStats,
            loading: false,

            fetchStats: async () => {
                set({ loading: true });
                try {
                    const data = await dashboardService.getStats();
                    set({ dashboardStats: data, loading: false });
                } catch (error) {
                    console.error('Failed to fetch dashboard stats:', error);
                    set({ loading: false });
                }
            },
            updateDashboardStats: async (updates) => {
                set({ loading: true });
                try {
                    const updatedData = await dashboardService.updateStats(updates);
                    set({ dashboardStats: updatedData, loading: false });
                } catch (error) {
                    console.error('Failed to update dashboard stats:', error);
                    set({ loading: false });
                }
            },
        }),
        { name: 'DashboardStatsStore' }
    )
);
