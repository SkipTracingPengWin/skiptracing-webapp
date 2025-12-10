import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DashboardStats } from '@/types';

const dashboardStatsData: DashboardStats = {
    totalBorrowers: 1250,
    verified: 980,
    inRecovery: 450,
    activeAgents: 24,
    pendingVerifications: 15,
    slaAlerts: 3,
    totalRecovered: "₹1.2 Cr",
    recoveryRate: 85
};

interface DashboardStatsState {
    dashboardStats: DashboardStats;
    updateDashboardStats: (updates: Partial<DashboardStats>) => void;
}

export const useDashboardStatsStore = create<DashboardStatsState>()(
    devtools(
        (set) => ({
            dashboardStats: dashboardStatsData,
            updateDashboardStats: (updates) =>
                set((state) => ({
                    dashboardStats: { ...state.dashboardStats, ...updates },
                })),
        }),
        { name: 'DashboardStatsStore' }
    )
);
