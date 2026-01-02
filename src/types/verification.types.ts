export enum VerificationType {
    PAN = "PAN",
    AADHAAR = "AADHAAR",
    BANK = "BANK",
    DL = "DL",
    RC = "RC",
    VOTER = "VOTER",
    PASSPORT = "PASSPORT",
    ADDRESS = "ADDRESS",
    PHONE = "PHONE",
    EMAIL = "EMAIL",
    LIVENESS = "LIVENESS",
    EMPLOYMENT = "EMPLOYMENT"
}

export interface Verification {
    id: string; // Changed to string to match "6957583d0526ab0c013dc145"
    borrowerId: string; // Changed to string
    type: VerificationType;
    provider: string; // "MOCK"
    status: "PENDING" | "VERIFIED" | "FAILED" | "IN_PROGRESS"; // Updated status keys to match API response (uppercase?) The user example has "PENDING".
    result: any;
    requestedBy: string;
    verifiedBy?: string | null;
    priority: "High" | "Medium" | "Low";
    requestedAt: string;
    completedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    borrower?: {
        id: string;
        name: string;
        phone: string;
        email: string;
        address?: string;
        location?: string;
        loanId?: string;
        loanType?: string;
        amount?: number;
        amountNumeric?: number;
        overdue?: string;
        risk?: string;
        verified?: boolean;
        status?: string;
    };
}

export type VerificationStatus = "PENDING" | "VERIFIED" | "FAILED" | "IN_PROGRESS";
export type Priority = "High" | "Medium" | "Low";

