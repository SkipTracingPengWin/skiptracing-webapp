
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
