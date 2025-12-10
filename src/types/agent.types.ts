export interface Agent {
    id: number;
    name: string;
    email: string;
    phone: string;
    location: string;
    cases: number;
    status: "Active" | "Busy" | "Offline" | "On Leave";
    avatar?: string;
    specialization?: string[];
    successRate?: number;
    totalRecovered?: string;
    joinedDate: string;
}

export type AgentStatus = "Active" | "Busy" | "Offline" | "On Leave";
