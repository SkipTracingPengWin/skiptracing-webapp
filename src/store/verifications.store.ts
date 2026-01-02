import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Verification } from '@/types/verification.types';
import api from '@/lib/axios';

interface VerificationState {
    verifications: Verification[];
    loading: boolean;
    error: string | null;

    fetchVerifications: () => Promise<void>;
    addVerification: (data: any) => Promise<void>;
    // Future actions
    // updateVerification: (id: string, updates: Partial<Verification>) => Promise<void>;
    // deleteVerification: (id: string) => Promise<void>;
}

export const useVerificationStore = create<VerificationState>()(
    devtools(
        (set, get) => ({
            verifications: [],
            loading: false,
            error: null,

            fetchVerifications: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await api.get('/verifications/');
                    set({ verifications: response.data, loading: false });
                } catch (error: any) {
                    console.error("Failed to fetch verifications:", error);
                    set({
                        error: error.response?.data?.message || error.message || "Failed to fetch verifications",
                        loading: false
                    });
                }
            },

            addVerification: async (data: any) => {
                set({ loading: true, error: null });
                try {
                    const response = await api.post('/verifications/', data);
                    // Optimistically update or re-fetch? Re-fetching is safer for now to get full object including ID/dates
                    await get().fetchVerifications();
                } catch (error: any) {
                    console.error("Failed to create verification:", error);
                    set({
                        error: error.response?.data?.message || error.message || "Failed to create verification",
                        loading: false
                    });
                    throw error; // Re-throw so modal can handle it (close/show error)
                }
            },
        }),
        { name: 'VerificationStore' }
    )
);
