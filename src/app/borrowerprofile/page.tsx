"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useBorrowerStore } from "@/store/borrowers.store";

import {
  ArrowLeft, Phone, Mail, MapPin, CreditCard, FileText,
  Briefcase, Landmark, Edit, MessageSquare, PhoneCall,
  ChevronRight, Download
} from "lucide-react";

// UI Primitives
type UIProps = { children?: React.ReactNode; className?: string };

const Button: React.FC<UIProps & { 
  variant?: 'ghost'|'outline'|'default'; 
  size?: 'icon'|'sm'|'md' 
}> = ({ 
  children, 
  className = '', 
  variant = 'default',
  size = 'md'
}) => (
  <button 
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
      ${variant === 'ghost' ? 'bg-transparent hover:bg-slate-100' :
       variant === 'outline' ? 'border border-slate-300 hover:bg-slate-50' :
       'bg-blue-600 hover:bg-blue-700 text-white'}
      ${size === 'icon' ? 'p-2' : size === 'sm' ? 'px-2 py-1 text-sm' : ''}
      ${className}`}
  >
    {children}
  </button>
);

const Card: React.FC<UIProps> = ({ children, className = '' }) => (
  <div className={`rounded-xl bg-white border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<UIProps> = ({ children, className = '' }) => (
  <div className={`p-6 border-b border-slate-100 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<UIProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-slate-900 ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<UIProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Badge: React.FC<UIProps> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const Progress: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => (
  <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${className}`}>
    <div 
      className="h-2 rounded-full bg-linear-to-r from-blue-500 to-sky-600 transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);

// Main Component
export default function BorrowerProfile() {
  const params = useSearchParams();
  const borrowerId = params.get("id") ?? "";
  const router = useRouter();

  const { borrowers } = useBorrowerStore();

  // Find borrower by ID from store
  const borrower = useMemo(() => {
    if (!borrowerId) return null;
    return borrowers.find(b => b.id === Number(borrowerId));
  }, [borrowerId, borrowers]);

  if (!borrower) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <MapPin className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Borrower Not Found
          </h2>
          <p className="text-slate-500 mb-8">
            The borrower profile could not be loaded or does not exist.
          </p>
          <Link href="/borrowers">
            <Button className="px-6 py-2">Back to Borrowers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const verificationScore = 75;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Link href="/borrowers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-slate-900 truncate">{borrower.name}</h1>
            <p className="text-lg text-slate-500 mt-1">Loan ID: {borrower.loanId}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 gap-2 text-white">
              <PhoneCall className="w-4 h-4" />
              Call Now
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <BasicInfoCard borrower={borrower} />
            <LoanDetailsCard borrower={borrower} />
          </div>

          {/* RIGHT COLUMN - Quick Info */}
          <div className="space-y-6">
            <ScoreCard score={verificationScore} />
            <SkipTraceCard borrower={borrower} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, extra }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="font-semibold text-slate-900 truncate">{value || "N/A"}</p>
      {extra && <p className="text-sm text-slate-500 mt-1">{extra}</p>}
    </div>
  </div>
);

const BasicInfoCard: React.FC<{ borrower: any }> = ({ borrower }) => (
  <Card className="shadow-lg border-0 bg-linear-to-br from-slate-50 to-white">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl">Basic Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoItem
          icon={<Phone className="w-6 h-6 text-blue-600" />}
          label="Primary Phone"
          value={borrower.phone}
        />
        <InfoItem
          icon={<Mail className="w-6 h-6 text-blue-600" />}
          label="Email"
          value={borrower.email}
        />
        <InfoItem
          icon={<MapPin className="w-6 h-6 text-blue-600" />}
          label="Location"
          value={borrower.location}
        />
        <InfoItem
          icon={<CreditCard className="w-6 h-6 text-blue-600" />}
          label="Loan ID"
          value={borrower.loanId}
        />
        <InfoItem
          icon={<Briefcase className="w-6 h-6 text-blue-600" />}
          label="Assigned Agent"
          value={borrower.assignedAgent}
        />
        <InfoItem
          icon={<Landmark className="w-6 h-6 text-blue-600" />}
          label="Last Contact"
          value={borrower.lastContact}
        />
      </div>
    </CardContent>
  </Card>
);

interface LoanItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const LoanItem: React.FC<LoanItemProps> = ({ label, value, highlight = false }) => (
  <div>
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className={`font-bold text-lg ${highlight ? "text-orange-600" : "text-slate-900"}`}>
      {value}
    </p>
  </div>
);

const LoanStatus: React.FC<{ borrower: any }> = ({ borrower }) => (
  <div>
    <p className="text-sm text-slate-500 mb-2">Status</p>
    <Badge className={`${borrower.status === 'in recovery' ? 'bg-orange-100 text-orange-800' : borrower.status === 'legal' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} border`}>
      {borrower.status.replace("_", " ").toUpperCase()}
    </Badge>
  </div>
);

const LoanDetailsCard: React.FC<{ borrower: any }> = ({ borrower }) => (
  <Card className="shadow-lg border-0">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl">Loan Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <LoanItem label="Loan Type" value={borrower.loanType} />
        <LoanItem label="Loan Amount" value={borrower.amount} />
        <LoanItem 
          label="Overdue" 
          value={borrower.overdue} 
          highlight 
        />
        <LoanStatus borrower={borrower} />
      </div>
    </CardContent>
  </Card>
);

const ActionItem: React.FC<{ action: any }> = ({ action }) => (
  <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
      ${action.action_type === "call" ? "bg-blue-100" :
        action.action_type === "sms" ? "bg-green-100" :
        "bg-orange-100"}`}>
      {action.action_type === "call" ? 
        <PhoneCall className="w-6 h-6 text-blue-600" /> :
        action.action_type === "sms" ? 
        <MessageSquare className="w-6 h-6 text-green-600" /> :
        <MapPin className="w-6 h-6 text-orange-600" />
      }
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-slate-900 capitalize truncate">{action.action_type}</p>
        <Badge className={`${
          action.status === 'completed' ? 'bg-green-100 text-green-800' :
          action.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {action.status}
        </Badge>
      </div>
      <p className="text-sm text-slate-600">{action.notes}</p>
    </div>
  </div>
);

const ActionsTimeline: React.FC<{ actions: any[] }> = ({ actions }) => (
  <Card className="shadow-lg border-0">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl">Actions Timeline</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {actions.length > 0 ? (
          actions.map((action, i) => <ActionItem key={i} action={action} />)
        ) : (
          <div className="text-center py-12 text-slate-500">
            No actions recorded yet
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const ScoreCard: React.FC<{ score: number }> = ({ score }) => {
  const getColor = (score: number) => 
    score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
  <Card className="shadow-xl border-0 bg-linear-to-br from-indigo-50 to-blue-50">
    <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          Verification Score
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="12" fill="none" />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={getColor(score)}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 439.6} 439.6`}
              fill="none"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl lg:text-4xl font-bold text-slate-900">{score}</span>
            <span className="text-sm text-slate-500 mt-1">/ 100</span>
          </div>
        </div>
        <Badge className={`text-sm px-4 py-2 font-semibold ${
          score >= 75 ? "bg-green-100 text-green-800" :
          score >= 50 ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {score >= 75 ? "Verified" : score >= 50 ? "Partial" : "Low Confidence"}
        </Badge>
      </CardContent>
    </Card>
  );
};

const SkipTraceCard: React.FC<{ borrower: any }> = ({ borrower }) => (
  <Card className="shadow-lg border-0 border-l-4 border-orange-500 bg-linear-to-r from-orange-50/50 to-white">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl flex items-center gap-2 text-orange-800">
        <MapPin className="w-6 h-6" />
        Borrower Details
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Risk Level</p>
          <Badge className={`${borrower.risk === 'high' ? 'bg-red-100 text-red-800' : borrower.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {borrower.risk.toUpperCase()}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Verification Status</p>
          <Badge className={borrower.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {borrower.verified ? 'VERIFIED' : 'NOT VERIFIED'}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Address</p>
          <p className="text-sm text-slate-600">{borrower.address || borrower.location}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-700 mb-1">Notes</p>
          <p className="text-sm text-slate-600">{borrower.notes || 'No notes available'}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActions: React.FC = () => (
  <Card className="shadow-lg border-0">
    <CardHeader className="pb-4">
      <CardTitle className="text-2xl">Quick Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {[
        { icon: PhoneCall, label: "Call Borrower", className: "bg-blue-600 hover:bg-blue-700" },
        { icon: MessageSquare, label: "Send SMS", className: "border-slate-200 hover:bg-slate-50" },
        { icon: MapPin, label: "Schedule Visit", className: "border-slate-200 hover:bg-slate-50" },
        { icon: FileText, label: "Generate Legal Notice", className: "border-slate-200 hover:bg-slate-50" },
        { icon: Download, label: "Download Report", className: "text-blue-600 border-blue-200 hover:bg-blue-50" },
      ].map(({ icon: Icon, label, className }, i) => (
        <Button key={i} variant="outline" className={`w-full justify-start ${className}`}>
          <Icon className="w-4 h-4" />
          {label}
        </Button>
      ))}
    </CardContent>
  </Card>
);
