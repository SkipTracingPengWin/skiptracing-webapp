export interface AuditLog {
    id: string;
    timestamp: string;
    user: { name: string } | string;
    actorId?: string;
    actorName?: string;
    actorRole?: string;
    action: string;
    module: "Borrowers" | "Agents" | "Verifications" | "Assignments" | "System" | "Reports" | "SocialMedia" | "RecoveryActions";
    details: string;
    ipAddress?: string;
    status: "Success" | "Failed" | "Warning" | "SUCCESS" | "FAILED" | "WARNING"; // Added uppercase variants based on JSON "SUCCESS"
}

export type AuditModule = "Borrowers" | "Agents" | "Verifications" | "Assignments" | "System" | "Reports" | "SocialMedia" | "RecoveryActions";
export type AuditStatus = "Success" | "Failed" | "Warning";