import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Assignment } from '@/types';

const assignmentsData: Assignment[] = [
    {
        id: 1,
        borrowerId: 1,
        borrowerName: "Rahul Sharma",
        agentId: 1,
        agentName: "Suresh Kumar",
        loanId: "LN-2024-001",
        amount: "₹125,000",
        assignedAt: "2025-11-01",
        dueDate: "2025-11-30",
        status: "In Progress",
        priority: "High",
        progress: 60
    },
    {
        id: 2,
        borrowerId: 2,
        borrowerName: "Priya Patel",
        agentId: 2,
        agentName: "Priya Sharma",
        loanId: "LN-2024-002",
        amount: "₹78,000",
        assignedAt: "2025-11-05",
        dueDate: "2025-12-05",
        status: "Pending",
        priority: "Medium",
        progress: 0
    }
];

interface AssignmentState {
    assignments: Assignment[];
    addAssignment: (assignment: Assignment) => void;
    updateAssignment: (id: number, updates: Partial<Assignment>) => void;
    deleteAssignment: (id: number) => void;
}

export const useAssignmentStore = create<AssignmentState>()(
    devtools(
        (set) => ({
            assignments: assignmentsData,
            addAssignment: (assignment) =>
                set((state) => ({
                    assignments: [...state.assignments, assignment],
                })),
            updateAssignment: (id, updates) =>
                set((state) => ({
                    assignments: state.assignments.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                })),
            deleteAssignment: (id) =>
                set((state) => ({
                    assignments: state.assignments.filter((a) => a.id !== id),
                })),
        }),
        { name: 'AssignmentStore' }
    )
);
