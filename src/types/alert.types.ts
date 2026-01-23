export interface Alert {
    id: string | number;
    title: string;
    message: string;
    type: "warning" | "danger" | "info" | "success";
    action?: string;
    timestamp?: string; // Backend might not send this or send createdAt
    read?: boolean;
    agentId?: string;
    borrowerId?: string;
    adminId?: string;
    createdAt?: string;
}

export type AlertType = "warning" | "danger" | "info" | "success";
