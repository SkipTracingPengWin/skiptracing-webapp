import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RecoveryTrend } from '@/types';

const recoveryTrendData: RecoveryTrend[] = [
    { month: "Jan", recovered: 15, target: 20 },
    { month: "Feb", recovered: 18, target: 22 },
    { month: "Mar", recovered: 25, target: 25 },
    { month: "Apr", recovered: 22, target: 28 },
    { month: "May", recovered: 30, target: 30 },
    { month: "Jun", recovered: 28, target: 32 },
    { month: "Jul", recovered: 35, target: 35 }
];

interface RecoveryTrendState {
    recoveryTrend: RecoveryTrend[];
}

export const useRecoveryTrendStore = create<RecoveryTrendState>()(
    devtools(
        (set) => ({
            recoveryTrend: recoveryTrendData,
        }),
        { name: 'RecoveryTrendStore' }
    )
);
