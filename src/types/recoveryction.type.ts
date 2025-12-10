export interface RecoveryAction {
  type: string;
  icon: keyof typeof import("lucide-react");
  borrower: string;
  scheduled: string;
  status: "completed" | "scheduled" | "pending" | string;
  priority: "high" | "medium" | "urgent" | "low" | string;
  agent: string;
  outcome: string;
}
