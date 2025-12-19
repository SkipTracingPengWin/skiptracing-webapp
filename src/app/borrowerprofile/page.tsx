
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useBorrowerStore } from "@/store/borrowers.store";

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  Briefcase,
  Landmark,
  Edit,
  MessageSquare,
  PhoneCall,
  Download
} from "lucide-react";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge
} from "@/components/borrower profile/cards.modal";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

// MAIN PAGE
export default function BorrowerProfile() {
  const params = useSearchParams();
  const borrowerId = params.get("id") ?? "";
  const router = useRouter();

  const { borrowers, updateBorrower, deleteBorrower } = useBorrowerStore();

  const borrower = useMemo(() => {
    if (!borrowerId) return null;
    return borrowers.find((b) => b.id === Number(borrowerId));
  }, [borrowerId, borrowers]);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Initialize form data when borrower loads
  useMemo(() => {
    if (borrower) {
      setFormData(borrower);
    }
  }, [borrower]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this borrower? This action cannot be undone.")) {
      await deleteBorrower(Number(borrowerId));
      router.push("/borrowers");
    }
  };

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* ---------- HEADER ---------- */}
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

            {/* ---------- FINAL LAYOUT ---------- */}
            <div className="space-y-8">
              {/* 1. TOP: Basic Information (Full Width) */}
              <BasicInfoCard borrower={borrower} />

              {/* 2. Loan Details (Full Width) */}
              <LoanDetailsCard borrower={borrower} />

              {/* 3. Verification Score + Borrower Details (Side by Side) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ScoreCard score={verificationScore} />
                <SkipTraceCard borrower={borrower} />
              </div>

              {/* 4. Quick Actions (Horizontal Layout) */}
              <QuickActions />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   REUSABLE COMPONENTS
-------------------------------------------------------------------*/

const InfoItem = ({ icon, label, value, extra }: any) => (
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

/* ---------------- BASIC INFO ---------------- */
const BasicInfoCard = ({ borrower }: any) => (
  <Card className="shadow-lg border-0 bg- from-slate-50 to-white">
    <CardHeader className="pb-4">
      <CardTitle>Basic Information</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoItem icon={<Phone className="w-6 h-6 text-blue-600" />} label="Phone" value={borrower.phone} />
        <InfoItem icon={<Mail className="w-6 h-6 text-blue-600" />} label="Email" value={borrower.email} />
        <InfoItem icon={<MapPin className="w-6 h-6 text-blue-600" />} label="Location" value={borrower.location} />
        <InfoItem icon={<CreditCard className="w-6 h-6 text-blue-600" />} label="Loan ID" value={borrower.loanId} />
        <InfoItem icon={<Briefcase className="w-6 h-6 text-blue-600" />} label="Assigned Agent" value={borrower.assignedAgent} />
        <InfoItem icon={<Landmark className="w-6 h-6 text-blue-600" />} label="Last Contact" value={borrower.lastContact} />
      </div>
    </CardContent>
  </Card>
);

/* ---------------- LOAN DETAILS ---------------- */
const LoanItem = ({ label, value, highlight = false }: any) => (
  <div>
    <p className="text-sm text-slate-500 mb-1">{label}</p>
    <p className={`font-bold text-lg ${highlight ? "text-orange-600" : "text-slate-900"}`}>{value}</p>
  </div>
);

const LoanStatus = ({ borrower }: any) => (
  <div>
    <p className="text-sm text-slate-500 mb-2">Status</p>
    <Badge
      className={`${borrower.status === "in recovery"
        ? "bg-orange-100 text-orange-800"
        : borrower.status === "legal"
          ? "bg-red-100 text-red-800"
          : "bg-green-100 text-green-800"
        } border`}
    >
      {borrower.status.toUpperCase()}
    </Badge>
  </div>
);

const LoanDetailsCard = ({ borrower }: any) => (
  <Card className="shadow-lg border-0">
    <CardHeader>
      <CardTitle>Loan Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <LoanItem label="Loan Type" value={borrower.loanType} />
        <LoanItem label="Loan Amount" value={borrower.amount} />
        <LoanItem label="Overdue" value={borrower.overdue} highlight />
        <LoanStatus borrower={borrower} />
      </div>
    </CardContent>
  </Card>
);

/* ---------------- SCORE CARD ---------------- */
const ScoreCard = ({ score }: any) => {
  const getColor = (score: number) =>
    score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <Card className="shadow-xl border-0 bg- from-indigo-50 to-blue-50">
      <CardHeader>
        <CardTitle>Verification Score</CardTitle>
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
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{score}</span>
            <span className="text-sm text-slate-500">/ 100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ---------------- SKIP TRACE CARD ---------------- */
const SkipTraceCard = ({ borrower }: any) => (
  <Card className="shadow-lg border-0 border-l-4 border-orange-500">
    <CardHeader>
      <CardTitle>Risk Level</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm font-medium">Risk Level</p>
      <Badge className={borrower.risk === "high" ? "bg-red-100 text-red-800" : borrower.risk === "medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
        {borrower.risk.toUpperCase()}
      </Badge>
    </CardContent>
  </Card>
);

/* ---------------- QUICK ACTIONS (Horizontal) ---------------- */
const QuickActions = () => (
  <Card className="shadow-lg border-0">
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { icon: PhoneCall, label: "Call Borrower", className: "bg-blue-600 text-white hover:bg-blue-700" },
          { icon: MessageSquare, label: "Send SMS", className: "hover:bg-gray-50" },
          { icon: MapPin, label: "Schedule Visit", className: "hover:bg-gray-50" },
          { icon: FileText, label: "Legal Notice", className: "hover:bg-gray-50" },
          { icon: Download, label: "Download", className: "text-blue-600 border-blue-200 hover:bg-blue-50" }
        ].map(({ icon: Icon, label, className }, i) => (
          <Button key={i} variant="outline" className={`h-14 justify-start ${className || ""}`}>
            <Icon className="w-4 h-4 mr-2" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);


