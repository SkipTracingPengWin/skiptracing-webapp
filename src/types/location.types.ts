export interface SkipTraceLocation {
    id: number;
    borrowerId: number;
    borrowerName: string;
    latitude: number;
    longitude: number;
    address: string;
    lastSeen: string;
    confidence: "Low" | "Medium" | "High";
    source: string;
}

export type ConfidenceLevel = "Low" | "Medium" | "High";
