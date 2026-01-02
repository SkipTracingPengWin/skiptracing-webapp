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
    updateBorrower: (id: string | number, updates: Partial<Borrower>) => Promise<void>;
    deleteBorrower: (id: string | number) => Promise<void>;
    getBorrowerById: (id: string | number) => Promise<Borrower | null>;
}

const normalizeBorrower = (b: any): Borrower => ({
    ...b,
    id: b.id !== undefined ? b.id : b._id
});

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
                    const normalizedData = (data || []).map(normalizeBorrower);
                    set({ borrowers: normalizedData, loading: false });
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
                    const normalized = normalizeBorrower(newBorrower);
                    set((state) => ({
                        borrowers: [...state.borrowers, normalized],
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

                    set((state) => {
                        const existing = state.borrowers.find(b => String(b.id) === String(id));
                        if (!existing) return state;

                        // Create the updated version, ensuring we don't lose the ID
                        // if the API returns a partial object or success message
                        const normalized = normalizeBorrower({
                            ...existing,
                            ...updatedBorrower
                        });

                        return {
                            borrowers: state.borrowers.map((b) =>
                                String(b.id) === String(id) ? normalized : b
                            ),
                            loading: false
                        };
                    });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to update borrower', loading: false });
                    throw error;
                }
            },

            deleteBorrower: async (id) => {
                if (!id) {
                    console.error("❌ Cannot delete: ID is missing in store action");
                    return;
                }

                console.log(`📦 Store: Attempting to delete borrower with ID:`, id, `(Type: ${typeof id})`);
                set({ loading: true, error: null });
                try {
                    await borrowerService.delete(id);
                    set((state) => ({
                        borrowers: state.borrowers.filter((b) => String(b.id) !== String(id)),
                        loading: false
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to delete borrower', loading: false });
                    throw error;
                }
            },

            getBorrowerById: async (id) => {
                set({ loading: true, error: null });
                try {
                    const data = await borrowerService.getById(id);
                    const normalized = normalizeBorrower(data);

                    set((state) => {
                        const exists = state.borrowers.find(b => String(b.id) === String(id));
                        if (exists) {
                            return {
                                borrowers: state.borrowers.map(b => String(b.id) === String(id) ? normalized : b),
                                loading: false
                            };
                        } else {
                            return {
                                borrowers: [...state.borrowers, normalized],
                                loading: false
                            };
                        }
                    });

                    return normalized;
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch borrower', loading: false });
                    console.error(`❌ Error fetching borrower ${id}:`, error);
                    return null;
                }
            },
        }),
        { name: 'BorrowerStore' }
    )
);
