export interface Borrower {
    id: number;
    name: string;
    phone: string;
    email?: string;
    loanId: string;
    loanType: "Personal" | "Vehicle" | "Home" | "Gold" | "Business";
    amount: string;
    amountNumeric: number;
    overdue: string;
    overdueDays: number;
    status: "in recovery" | "active" | "legal" | "settled" | "written off";
    risk: "low" | "medium" | "high" | "critical";
    verified: boolean;
    location: string;
    address?: string;
    assignedAgent?: string;
    lastContact?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export type LoanType = "Personal" | "Vehicle" | "Home" | "Gold" | "Business";
export type BorrowerStatus = "in recovery" | "active" | "legal" | "settled" | "written off";
export type RiskLevel = "low" | "medium" | "high" | "critical";
