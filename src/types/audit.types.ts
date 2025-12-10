export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    module: "Borrowers" | "Agents" | "Verifications" | "Assignments" | "System" | "Reports";
    details: string;
    ipAddress?: string;
    status: "Success" | "Failed" | "Warning";
}

export type AuditModule = "Borrowers" | "Agents" | "Verifications" | "Assignments" | "System" | "Reports";
export type AuditStatus = "Success" | "Failed" | "Warning";
