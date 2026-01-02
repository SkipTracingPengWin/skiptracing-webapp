export interface Borrower {
    id: number | string;
    name: string;
    phone: string;
    email?: string;
    loanId: string;
    loanType: "Personal Loan" | "Vehicle Loan" | "Home Loan" | "Gold Loan" | "Business Loan";
    amount: number;
    amountNumeric: number;
    overdue: string;
    overdueDays: number;
    status: BorrowerStatus;
    risk: "Low" | "Medium" | "High" | "Critical";
    verified: boolean;
    location: string;
    address?: string;
    assignedAgent?: string;
    lastContact?: string;
    notes?: string;
    relatedLinks?: {
        platform: string;
        url: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export type LoanType = "Personal Loan" | "Vehicle Loan" | "Home Loan" | "Gold Loan" | "Business Loan";
export type BorrowerStatus = "ACTIVE" | "INACTIVE" | "SKIPPED" | "CLOSED";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
