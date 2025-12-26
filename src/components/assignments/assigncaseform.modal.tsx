"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Loader2 } from "lucide-react";
import { useBorrowerStore } from "@/store/borrowers.store";
import { useAgentStore } from "@/store/agents.store";
import { useAssignmentStore } from "@/store/assignments.store";
import type { Assignment, AssignmentStatus, AssignmentPriority } from "@/types";

interface AssignCaseModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Assignment | null;
}

export default function AssignCaseModal({
  open,
  onClose,
  initialData,
}: AssignCaseModalProps) {
  const [borrowerId, setBorrowerId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [amount, setAmount] = useState("");
  const [assignedAt, setAssignedAt] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [status, setStatus] = useState<AssignmentStatus>("OPEN");
  const [priority, setPriority] = useState<AssignmentPriority>("high");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { borrowers, fetchBorrowers, loading: loadingBorrowers } = useBorrowerStore();
  const { agents, fetchAgents, loading: loadingAgents } = useAgentStore();
  const { addAssignment, updateAssignment } = useAssignmentStore();

  useEffect(() => {
    if (open) {
      fetchBorrowers();
      fetchAgents();
    }
  }, [open, fetchBorrowers, fetchAgents]);

  useEffect(() => {
    if (open && initialData) {
      setBorrowerId(String(initialData.borrowerId || ""));
      setAgentId(String(initialData.agentId || ""));
      setAmount(String(initialData.amount || ""));
      if (initialData.assignedAt) {
        setAssignedAt(new Date(initialData.assignedAt).toISOString().split("T")[0]);
      }
      if (initialData.dueDate) {
        setDueDate(new Date(initialData.dueDate).toISOString().split("T")[0]);
      }
      setStatus(initialData.status || "OPEN");
      setPriority(initialData.priority || "high");
      setProgress(initialData.progress || 0);
    } else if (open && !initialData) {
      // Reset form for new assignment
      setBorrowerId("");
      setAgentId("");
      setAmount("");
      setAssignedAt(new Date().toISOString().split("T")[0]);
      setDueDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
      setStatus("OPEN");
      setPriority("high");
      setProgress(0);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (borrowerId && !initialData) {
      const selected = borrowers.find(b => String(b.id) === borrowerId);
      if (selected) {
        setAmount(String(selected.amount || "0"));
      }
    }
  }, [borrowerId, borrowers, initialData]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!borrowerId || !agentId || isSubmitting) return;

    setIsSubmitting(true);

    const assignmentData = {
      borrowerId: borrowerId,
      agentId: agentId,
      amount: amount,
      assignedAt: new Date(assignedAt).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      status,
      priority,
      progress: Number(progress),
    };

    try {
      if (initialData?.id) {
        await updateAssignment(initialData.id, assignmentData);
      } else {
        await addAssignment(assignmentData);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save assignment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loadingBorrowers || loadingAgents;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {initialData ? "Update Assignment" : "Assign New Case"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Borrower Selection */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-slate-700 block mb-2">
            Select Borrower
          </label>

          <div className="relative">
            <select
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 appearance-none"
              value={borrowerId}
              onChange={(e) => setBorrowerId(e.target.value)}
              disabled={isLoading || isSubmitting}
            >
              <option value="">Choose a borrower...</option>
              {borrowers.map((b) => (
                <option key={b.id} value={String(b.id)}>
                  {b.name} ({b.loanId})
                </option>
              ))}
            </select>
            {isLoading && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Agent Selection */}
        <div className="mb-5">
          <label className="text-sm font-semibold text-slate-700 block mb-2">
            Assign to Field Agent
          </label>

          <div className="relative">
            <select
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 appearance-none"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              disabled={isLoading || isSubmitting}
            >
              <option value="">Choose an agent...</option>
              {agents.map((a) => (
                <option key={a.id} value={String(a.id)}>
                  {a.name} ({a.location})
                </option>
              ))}
            </select>
            {isLoading && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            )}
          </div>
        </div>

        {/* Case Details */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Amount
            </label>
            <input
              type="text"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Priority
            </label>
            <select
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={priority}
              onChange={(e) => setPriority(e.target.value as AssignmentPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Assigned At
            </label>
            <input
              type="date"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={assignedAt}
              onChange={(e) => setAssignedAt(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Due Date
            </label>
            <input
              type="date"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Status
            </label>
            <select
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={status}
              onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-2">
              Progress (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
            />
          </div>
        </div>


        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            disabled={!borrowerId || !agentId || isLoading || isSubmitting}
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 text-white shadow-sm transition-all
              ${!borrowerId || !agentId || isLoading || isSubmitting
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {initialData ? "Updating..." : "Assigning..."}
              </>
            ) : (
              <>
                {initialData ? <Loader2 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {initialData ? "Update Assignment" : "Confirm Assignment"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
