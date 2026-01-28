export interface Agent {
    id: string | number;
    userId?: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    cases: number;
    status: AgentStatus;
    avatar?: string;
    specialization?: string[];
    successRate?: number;
    totalRecovered?: string;
    joinedDate: string;
    password?: string;
}
    export type AgentStatus = "ONLINE" | "BUSY" | "OFFLINE" | "LEAVE";

