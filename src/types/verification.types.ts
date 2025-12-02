export interface Verification {
    id: number;
    borrowerId: number;
    borrowerName: string;
    type: "KYC" | "Address" | "Employment" | "Income" | "Reference";
    status: "Pending" | "Verified" | "Failed" | "In Progress";
    requestedBy: string;
    requestedAt: string;
    completedAt?: string;
    verifiedBy?: string;
    documents?: string[];
    notes?: string;
    priority: "Low" | "Medium" | "High" | "Urgent";
}

export type VerificationType = "KYC" | "Address" | "Employment" | "Income" | "Reference";
export type VerificationStatus = "Pending" | "Verified" | "Failed" | "In Progress";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
