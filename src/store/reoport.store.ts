// store.ts
import { create } from "zustand";

// --- Type Definitions (Refined) ---

type MonthRecovery = {
  month: string;
  recovered: number;
  target: number;
};

type AgentPerformance = {
  name: string;
  completed: number;
  success: number;
  rate: number; // Success rate percentage
};

type ReportType = {
  id: string;
  name: string;
  icon: string; // Storing the icon name as a string
  desc: string;
};

type DashboardStore = {
  period: string;
  months: MonthRecovery[];
  agentPerformance: AgentPerformance[];
  reportTypes: ReportType[]; // List for the report tabs
  totalRecovered: string;
  totalVerifications: number;
  casesClosed: number;
  avgSuccessRate: number;
  setPeriod: (p: string) => void;
};

// --- Store Implementation ---

export const useDashboardStore = create<DashboardStore>((set) => ({
  period: "This Month",
  months: [
    { month: "Jan", recovered: 12, target: 14 },
    { month: "Feb", recovered: 18, target: 18 },
    { month: "Mar", recovered: 22, target: 20 },
    { month: "Apr", recovered: 21, target: 23 },
    { month: "May", recovered: 28, target: 25 },
    { month: "Jun", recovered: 31, target: 27 },
  ],
  // Data for the Agent Performance Card
  agentPerformance: [
    { name: 'Suresh K.', completed: 45, success: 38, rate: 84 },
    { name: 'Priya S.', completed: 52, success: 41, rate: 79 },
    { name: 'Mohan R.', completed: 38, success: 35, rate: 92 },
    { name: 'Anita P.', completed: 41, success: 32, rate: 78 },
    { name: 'Vikram S.', completed: 36, success: 30, rate: 83 },
  ],
  // Data for the Tabs/Report Types
  reportTypes: [
    { id: 'recovery', name: 'Recovery Summary', icon: 'TrendingUp', desc: 'Monthly recovery statistics' },
    { id: 'verification', name: 'Verification Report', icon: 'FileText', desc: 'KYC completion rates' },
    { id: 'agent', name: 'Agent Performance', icon: 'Users', desc: 'Field agent metrics' },
    { id: 'compliance', name: 'Compliance Report', icon: 'BarChart2', desc: 'Audit trail summary' },
  ],
  // Summary Stats (used in new cards)
  totalRecovered: "₹1.2Cr",
  totalVerifications: 1259,
  casesClosed: 351,
  avgSuccessRate: 82,

  setPeriod: (p) => set({ period: p }),
}));