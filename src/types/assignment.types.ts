export interface Assignment {
    id: number;
    borrowerId: number;
    borrowerName: string;
    agentId: number;
    agentName: string;
    loanId: string;
    amount: string;
    assignedAt: string;
    dueDate: string;
    status: "Pending" | "In Progress" | "Completed" | "Overdue" | "Escalated";
    priority: "Low" | "Medium" | "High" | "Critical";
    progress: number;
    lastUpdate?: string;
    notes?: string;
}

export type AssignmentStatus = "Pending" | "In Progress" | "Completed" | "Overdue" | "Escalated";
export type AssignmentPriority = "Low" | "Medium" | "High" | "Critical";
