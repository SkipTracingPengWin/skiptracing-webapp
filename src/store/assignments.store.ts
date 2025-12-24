import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Assignment } from '@/types';
import { assignmentService } from '@/services/assignment.services';

interface AssignmentState {
    assignments: Assignment[];
    loading: boolean;
    error: string | null;
    fetchAssignments: () => Promise<void>;
    addAssignment: (assignment: Partial<Assignment>) => Promise<void>;
    updateAssignment: (id: string | number, updates: Partial<Assignment>) => Promise<void>;
    deleteAssignment: (id: string | number) => Promise<void>;
}

const normalizeAssignment = (a: any): Assignment => ({
    ...a,
    id: a.id || a._id || String(Math.random()),
    borrowerId: a.borrowerId || a.borrower?._id || a.borrower?.id,
    agentId: a.agentId || a.agent?._id || a.agent?.id,
});

export const useAssignmentStore = create<AssignmentState>()(
    devtools(
        (set) => ({
            assignments: [],
            loading: false,
            error: null,

            fetchAssignments: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await assignmentService.getAll();
                    const normalized = Array.isArray(data) ? data.map(normalizeAssignment) : [];
                    set({ assignments: normalized, loading: false });
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch assignments', loading: false });
                }
            },

            addAssignment: async (assignment) => {
                set({ loading: true, error: null });
                try {
                    const responseData = await assignmentService.create(assignment);
                    const newAssignment = normalizeAssignment(responseData);
                    set((state) => ({
                        assignments: [...state.assignments, newAssignment],
                        loading: false,
                    }));
                } catch (error: any) {
                    const errorMsg = error.response?.data?.message || error.message || 'Failed to add assignment';
                    set({ error: errorMsg, loading: false });
                    throw error;
                }
            },

            updateAssignment: async (id, updates) => {
                set({ loading: true, error: null });
                try {
                    const updatedAssignment = await assignmentService.update(id, updates);
                    set((state) => ({
                        assignments: state.assignments.map((a) =>
                            String(a.id) === String(id) ? { ...a, ...updatedAssignment } : a
                        ),
                        loading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to update assignment', loading: false });
                    throw error;
                }
            },

            deleteAssignment: async (id) => {
                set({ loading: true, error: null });
                try {
                    await assignmentService.delete(id);
                    set((state) => ({
                        assignments: state.assignments.filter((a) => String(a.id) !== String(id)),
                        loading: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message || 'Failed to delete assignment', loading: false });
                    throw error;
                }
            },
        }),
        { name: 'AssignmentStore' }
    )
);
