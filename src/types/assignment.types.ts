export interface Assignment {
    id: string;
    borrowerId: string;
    borrowerName?: string;
    agentId: string;
    agentName?: string;
    loanId?: string | null;
    amount: string;
    assignedAt: string;
    dueDate: string;
    status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "ESCALATED";
    priority: "low" | "medium" | "high" | "critical";
    progress: number;
    lastUpdate?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    location?: string;
}

export type AssignmentStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "ESCALATED";
export type AssignmentPriority = "low" | "medium" | "high" | "critical";
