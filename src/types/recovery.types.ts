// types/recoveryTrend.types.ts

export interface RecoveryTrend {
    id: string;
    month: string;
    recovered: number;
    target: number;
    year: number;
}

export interface RecoveryTrendPayload {
    month: string;
    recovered: number;
    target: number;
    year?: number;
}