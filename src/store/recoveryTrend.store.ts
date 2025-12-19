// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import type { RecoveryTrend } from '@/types';

// const recoveryTrendData: RecoveryTrend[] = [
//     { month: "Jan", recovered: 15, target: 20 },
//     { month: "Feb", recovered: 18, target: 22 },
//     { month: "Mar", recovered: 25, target: 25 },
//     { month: "Apr", recovered: 22, target: 28 },
//     { month: "May", recovered: 30, target: 30 },
//     { month: "Jun", recovered: 28, target: 32 },
//     { month: "Jul", recovered: 35, target: 35 }
// ];

// interface RecoveryTrendState {
//     recoveryTrend: RecoveryTrend[];
// }

// export const useRecoveryTrendStore = create<RecoveryTrendState>()(
//     devtools(
//         (set) => ({
//             recoveryTrend: recoveryTrendData,
//         }),
//         { name: 'RecoveryTrendStore' }
//     )
// );



"use client";

import { create } from "zustand";
import { recoveryService } from "@/services/recovery.services";
import { RecoveryTrend, RecoveryTrendPayload } from "@/types/recovery.types";

interface RecoveryStore {
    recoveryTrend: RecoveryTrend[];
    loading: boolean;
    error: string | null;

    fetchTrends: () => Promise<void>;
    addTrend: (data: RecoveryTrendPayload) => Promise<void>;
}

export const useRecoveryTrendStore = create<RecoveryStore>((set) => ({
    recoveryTrend: [],
    loading: false,
    error: null,

    fetchTrends: async () => {
        set({ loading: true });

        try {
            const data = await recoveryService.getAll();
            set({ recoveryTrend: data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    addTrend: async (data: RecoveryTrendPayload) => {
        set({ loading: true });

        try {
            const trend = await recoveryService.create(data);

            set((state) => ({
                recoveryTrend: [...state.recoveryTrend, trend],
                loading: false
            }));
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    }
}));



