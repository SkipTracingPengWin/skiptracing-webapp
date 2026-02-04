
"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useBorrowerStore } from "@/store/borrowers.store";
import { useAuthStore } from "@/store/auth.store";
import { useAssignmentStore } from "@/store/assignments.store";
import { useAgentStore } from "@/store/agents.store";
import { borrowerService } from "@/services/borrowers.services";
import { Borrower } from "@/types/borrower.types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import {
  ArrowLeft,
  Edit,
  PhoneCall,
  Trash2,
  MapPin
} from "lucide-react";

import AddBorrowerModal from "@/components/borrowers/AddBorrowerModal";

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge
} from "@/components/borrower profile/cards.modal";

import BasicInfoCard from "@/components/borrower profile/BasicInfoCard";
import LoanDetailsCard from "@/components/borrower profile/LoanDetailsCard";
import ScoreCard from "@/components/borrower profile/ScoreCard";
import SkipTraceCard from "@/components/borrower profile/SkipTraceCard";




// MAIN PAGE
// WRAPPER COMPONENT WITH SUSPENSE
export default function BorrowerProfilePage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header title="Borrower Profile" />
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner text="Initializing profile..." />
          </div>
        }>
          <BorrowerProfile />
        </Suspense>
      </div>
    </div>
  );
}

function BorrowerProfile() {
  const params = useSearchParams();
  const borrowerId = params.get("id") ?? "";
  const router = useRouter();

  const { borrowers, updateBorrower, deleteBorrower } = useBorrowerStore();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const { agents, fetchAgents } = useAgentStore();
  const { user } = useAuthStore();
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Determine back navigation path based on user role
  const backPath = user?.role === "AGENT" ? "/assignments" : "/borrowers";

  // Fetch borrower data on mount or when ID changes
  useEffect(() => {
    const fetchBorrower = async () => {
      if (!borrowerId) return;
      setIsLoading(true);
      try {
        const data = await borrowerService.getById(borrowerId);
        // Normalize ID (handle _id from MongoDB)
        const normalized = { ...data, id: data.id || data._id };
        setBorrower(normalized);
      } catch (error) {
        console.error("Failed to fetch borrower:", error);
        // Fallback to store if API fails
        const found = borrowers.find((b) => String(b.id) === String(borrowerId));
        if (found) setBorrower(found);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBorrower();
    fetchAssignments();
    if (user?.role === "ADMIN" || user?.role === "MANAGER") {
      fetchAgents();
    }
  }, [borrowerId, borrowers, fetchAssignments, fetchAgents, user?.role]);

  // Handle number to string ID comparison consistently
  const numericId = useMemo(() => {
    return isNaN(Number(borrowerId)) ? String(borrowerId) : Number(borrowerId);
  }, [borrowerId]);

  // Find assigned agent name
  const assignedAgentName = useMemo(() => {
    if (!borrowerId) return "N/A";
    const assignment = assignments.find(a => String(a.borrowerId) === String(borrowerId));
    if (!assignment) return "No Agent Assigned";

    const agent = agents.find(ag => String(ag.id) === String(assignment.agentId));
    return agent?.name || assignment.agentName || "Unknown Agent";
  }, [borrowerId, assignments, agents]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      try {
        await deleteBorrower(borrowerId);
        router.push(backPath);
      } catch (err) {
        console.error("Delete failed in component:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading borrower profile...</p>
        </div>
      </div>
    );
  }

  if (!borrower) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
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
          <Link href={backPath}>
            <Button className="px-6 py-2">Back to {user?.role === "AGENT" ? "Assignments" : "Borrowers"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const verificationScore = 75;

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center gap-4">
          <Link href={backPath}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-slate-900 truncate">{borrower.name}</h1>
            <p className="text-lg text-slate-500 mt-1">Loan ID: {borrower.loanId}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            {user?.role === "ADMIN" && (
              <Button
                variant="outline"
                className="gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            )}
            <Button className="bg-orange-600 hover:bg-orange-700 gap-2 text-white">
              <PhoneCall className="w-4 h-4" />
              Call Now
            </Button>
          </div>
        </div>

        <AddBorrowerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          borrowerId={borrowerId}
        />

        {/* ---------- FINAL LAYOUT ---------- */}
        <div className="space-y-8">
          {/* 1. TOP: Basic Information (Full Width) */}
          <BasicInfoCard borrower={borrower} assignedAgentName={assignedAgentName} />

          {/* 2. Loan Details (Full Width) */}
          <LoanDetailsCard borrower={borrower} />

          {/* 3. Verification Score + Borrower Details (Side by Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreCard score={verificationScore} />
            <SkipTraceCard borrower={borrower} />
          </div>
        </div>
      </div>
    </main>
  );
}


