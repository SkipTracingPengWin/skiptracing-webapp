import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Borrower } from '@/types';
import { borrowerService } from '@/services/borrowers.services';

interface BorrowerState {
    borrowers: Borrower[];
    loading: boolean;
    error: string | null;
    fetchBorrowers: () => Promise<void>;
    addBorrower: (borrower: Partial<Borrower>) => Promise<void>;
    updateBorrower: (id: number, updates: Partial<Borrower>) => Promise<void>;
    deleteBorrower: (id: number) => Promise<void>;
}

export const useBorrowerStore = create<BorrowerState>()(
    devtools(
        (set, get) => ({
            borrowers: [],
            loading: false,
            error: null,

            fetchBorrowers: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await borrowerService.getAll();
                    set({ borrowers: data, loading: false });
                } catch (error: any) {
                    console.warn('Backend API not available, using empty dataset');
                    set({
                        borrowers: [],
                        error: 'Backend API not available. Please start the backend server or add borrowers manually.',
                        loading: false
                    });
                }
            },

            addBorrower: async (borrower) => {
                set({ loading: true, error: null });
                try {
                    const newBorrower = await borrowerService.create(borrower);
                    set((state) => ({
                        borrowers: [...state.borrowers, newBorrower],
                        loading: false
                    }));
                } catch (error: any) {
                    console.error('Failed to add borrower:', error);
                    // Re-throw so the component knows it failed
                    throw error;
                }
            },

            updateBorrower: async (id, updates) => {
                set({ loading: true, error: null });
                try {
                    const updatedBorrower = await borrowerService.update(id, updates);
                    set((state) => ({
                        borrowers: state.borrowers.map((b) =>
                            b.id === id ? updatedBorrower : b
                        ),
                        loading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to update borrower', loading: false });
                }
            },

            deleteBorrower: async (id) => {
                set({ loading: true, error: null });
                try {
                    await borrowerService.delete(id);
                    set((state) => ({
                        borrowers: state.borrowers.filter((b) => b.id !== id),
                        loading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to delete borrower', loading: false });
                }
            },
        }),
        { name: 'BorrowerStore' }
    )
);
