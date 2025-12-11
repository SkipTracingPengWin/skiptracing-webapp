"use client";

import { useState } from "react";
import { X, UserPlus } from "lucide-react";

interface AssignCaseModalProps {
  open: boolean;
  onClose: () => void;
  borrowers: { id: string; name: string }[];
  agents: { id: string; name: string }[];
  onSubmit: (data: { borrowerId: string; agentId: string }) => void;
}

export default function AssignCaseModal({
  open,
  onClose,
  borrowers,
  agents,
  onSubmit,
}: AssignCaseModalProps) {
  const [borrowerId, setBorrowerId] = useState("");
  const [agentId, setAgentId] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!borrowerId || !agentId) return;
    onSubmit({ borrowerId, agentId });
    setBorrowerId("");
    setAgentId("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Assign Case to Agent
          </h2>

          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Borrower Dropdown */}
        <div className="mb-4">
          <label className="text-sm font-medium text-slate-700">
            Select Borrower
          </label>

          <select
            className="w-full mt-2 p-2 border border-slate-300 rounded-lg text-sm"
            value={borrowerId}
            onChange={(e) => setBorrowerId(e.target.value)}
          >
            <option value="">Select a borrower</option>
            {borrowers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Dropdown */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Assign to Agent
          </label>

          <select
            className="w-full mt-2 p-2 border border-slate-300 rounded-lg text-sm"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          >
            <option value="">Select an agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            disabled={!borrowerId || !agentId}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 text-white
              ${!borrowerId || !agentId ? "bg-slate-300" : "bg-blue-600 hover:bg-blue-700"}
            `}
          >
            <UserPlus className="h-4 w-4" />
            Assign Agent
          </button>
        </div>
      </div>
    </div>
  );
}
