import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuditLog } from '@/types';

const auditLogsData: AuditLog[] = [
    {
        id: 1,
        timestamp: "2025-11-28 10:30:00",
        user: "Admin",
        action: "Updated Borrower Status",
        module: "Borrowers",
        details: "Changed status of Rahul Sharma to In Recovery",
        status: "Success"
    },
    {
        id: 2,
        timestamp: "2025-11-28 11:15:00",
        user: "System",
        action: "Generated Report",
        module: "Reports",
        details: "Monthly Recovery Report generated",
        status: "Success"
    }
];

interface AuditLogState {
    auditLogs: AuditLog[];
    addAuditLog: (log: AuditLog) => void;
}

export const useAuditLogStore = create<AuditLogState>()(
    devtools(
        (set) => ({
            auditLogs: auditLogsData,
            addAuditLog: (log) =>
                set((state) => ({
                    auditLogs: [...state.auditLogs, log],
                })),
        }),
        { name: 'AuditLogStore' }
    )
);
