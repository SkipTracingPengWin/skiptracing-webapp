// Recovery Action Types matching the new Prisma schema

export enum RecoveryActionType {
  SMS = "SMS",
  CALL = "CALL",
  VISIT = "VISIT",
  NOTICE_LEGAL = "NOTICE_LEGAL",
  OTHER = "OTHER"
}

export enum RecoveryActionStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED"
}

export interface RecoveryAction {
  id: string;
  borrowerId: string;
  type: RecoveryActionType | string;
  priority?: string;
  status: RecoveryActionStatus | string;
  note?: string;
  executedAt?: string | Date;
  createdAt: string | Date;

  // Client-side display fields (populated from relationships)
  borrowerName?: string;
}
