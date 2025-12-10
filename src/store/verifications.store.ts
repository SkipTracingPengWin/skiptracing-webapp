import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Verification } from '@/types';

const verificationsData: Verification[] = [
    {
        id: 1,
        borrowerId: 1,
        borrowerName: "Rahul Sharma",
        type: "Address",
        status: "Verified",
        requestedBy: "System",
        requestedAt: "2025-11-20",
        completedAt: "2025-11-21",
        verifiedBy: "Agent Smith",
        priority: "High"
    },
    {
        id: 2,
        borrowerId: 3,
        borrowerName: "Amit Kumar",
        type: "Employment",
        status: "Pending",
        requestedBy: "Manager",
        requestedAt: "2025-11-27",
        priority: "Urgent"
    }
];

interface VerificationState {
    verifications: Verification[];
    addVerification: (verification: Verification) => void;
    updateVerification: (id: number, updates: Partial<Verification>) => void;
    deleteVerification: (id: number) => void;
}

export const useVerificationStore = create<VerificationState>()(
    devtools(
        (set) => ({
            verifications: verificationsData,
            addVerification: (verification) =>
                set((state) => ({
                    verifications: [...state.verifications, verification],
                })),
            updateVerification: (id, updates) =>
                set((state) => ({
                    verifications: state.verifications.map((v) =>
                        v.id === id ? { ...v, ...updates } : v
                    ),
                })),
            deleteVerification: (id) =>
                set((state) => ({
                    verifications: state.verifications.filter((v) => v.id !== id),
                })),
        }),
        { name: 'VerificationStore' }
    )
);
