import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DashboardStats } from '@/types/dashboard.types';
import { dashboardService } from '@/services/dashboard.services';

const initialDashboardStats: DashboardStats = {
    totalBorrowers: 6,
    verified: 2,
    inRecovery: 4,
    activeAgents: 5,
    pendingVerifications: 4,
    slaAlerts: 6,
    totalRecovered: "0",
    recoveryRate: 0
};

interface DashboardStatsState {
    dashboardStats: DashboardStats;
    fetchStats: () => Promise<void>;
    updateDashboardStats: (updates: Partial<DashboardStats>) => void;
}

export const useDashboardStatsStore = create<DashboardStatsState>()(
    devtools(
        (set) => ({
            dashboardStats: initialDashboardStats,

            fetchStats: async () => {
                try {
                    const data = await dashboardService.getStats();
                    set({ dashboardStats: data });
                } catch (error) {
                    console.error('Failed to fetch dashboard stats:', error);
                }
            },
            updateDashboardStats: async (updates) => {
                try {
                    const updatedData = await dashboardService.updateStats(updates);
                    set({ dashboardStats: updatedData });
                } catch (error) {
                    console.error('Failed to update dashboard stats:', error);
                }
            },
        }),
        { name: 'DashboardStatsStore' }
    )
);
