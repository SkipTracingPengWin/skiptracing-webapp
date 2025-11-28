// Central export file for all types
// This file re-exports all types from individual type files for convenience

// Borrower types
export type {
    Borrower,
    LoanType,
    BorrowerStatus,
    RiskLevel
} from './borrower.types';

// Agent types
export type {
    Agent,
    AgentStatus
} from './agent.types';

// Verification types
export type {
    Verification,
    VerificationType,
    VerificationStatus,
    Priority
} from './verification.types';

// Assignment types
export type {
    Assignment,
    AssignmentStatus,
    AssignmentPriority
} from './assignment.types';

// Audit types
export type {
    AuditLog,
    AuditModule,
    AuditStatus
} from './audit.types';

// Alert types
export type {
    Alert,
    AlertType
} from './alert.types';

// Dashboard types
export type {
    DashboardStats
} from './dashboard.types';

// Recovery types
export type {
    RecoveryTrend
} from './recovery.types';

// Location types
export type {
    SkipTraceLocation,
    ConfidenceLevel
} from './location.types';
