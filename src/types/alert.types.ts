export interface Alert {
    id: number;
    title: string;
    description: string;
    type: "warning" | "danger" | "info" | "success";
    action: string;
    timestamp: string;
    read: boolean;
}

export type AlertType = "warning" | "danger" | "info" | "success";
