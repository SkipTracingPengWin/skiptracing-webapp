"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
  UserCircle, Search, ChevronDown, Check,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import toast from "react-hot-toast";
import { useBorrowerStore } from "@/store/borrowers.store";
import { useAgentStore } from "@/store/agents.store";
import { useAssignmentStore } from "@/store/assignments.store";
import { useAuthStore } from "@/store/auth.store";
import AssignCaseModal from "@/components/assignments/assigncaseform.modal";
import CaseItem from "@/components/assignments/CaseItem";
import AgentWorkload from "@/components/assignments/AgentWorkload";
import StatCard from "@/components/assignments/StatCard";

export default function AssignmentsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Cases");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState("");

  const { assignments, loading: loadingAssignments, error, fetchAssignments, fetchAgentAssignments, deleteAssignment } = useAssignmentStore();
  const { borrowers, fetchBorrowers, loading: loadingBorrowers } = useBorrowerStore();
  const { agents, fetchAgents, loading: loadingAgents } = useAgentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const loadData = async () => {
      // Always fetch borrowers as they are needed for display
      fetchBorrowers();

      if (user?.role === "AGENT" && user?.id) {
        // If Agent, we need to find the Agent ID associated with this User ID.
        // We fetch agents to find the match. 
        // Note: Ideally the backend should provide an endpoint to get the agent profile by user ID.
        try {
          // We use the store's fetchAgents. 
          // If the user (Agent) is not allowed to fetch all agents, this might fail, 
          // but currently we assume it's possible or we have to rely on it.
          // However, fetchAgents updates the store state.
          await fetchAgents();

          // We need to access the agents from the store state after fetch.
          // Since useEffect closures capture variables, we might not see the updated 'agents' immediately 
          // if we just use the variable from the hook. 
          // But since we are inside an async function, we can rely on the store's state if we accessed it directly,
          // or we can wait for the next render.
          // BETTER APPROACH: fetchAgents returns void.
          // Let's depend on 'agents' changes in another effect or use a workaround.
        } catch (e) {
          console.error("Failed to load agents for lookup", e);
        }
      } else {
        // Admin/Manager/etc -> fetch all
        fetchAssignments();
        if (user?.role === "ADMIN" || user?.role === "MANAGER") {
          fetchAgents();
        }
      }
    };

    loadData();
  }, [fetchAssignments, fetchBorrowers, fetchAgents, user?.role, user?.id]);

  // Separate effect to react when agents are loaded and we are an agent
  useEffect(() => {
    if (user?.role === "AGENT" && user?.id && agents.length > 0) {
      const myAgent = agents.find((a: any) => a.userId === user.id);
      if (myAgent) {
        fetchAgentAssignments(myAgent.id);
      }
    }
  }, [agents, user?.role, user?.id, fetchAgentAssignments]);

  const loading = loadingAssignments || loadingBorrowers || loadingAgents;

  const handleEdit = (assignment: any) => {
    setEditingAssignment(assignment);
    setOpenModal(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id);
        toast.success("Assignment deleted successfully");
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAssignment(null);
  };

  // Enrich assignments with borrower and agent names/locations
  const enrichedAssignments = assignments.map((a: any) => {
    const borrower = borrowers.find((b: any) => String(b.id) === String(a.borrowerId));
    const agent = agents.find((ag: any) => String(ag.id) === String(a.agentId));

    return {
      ...a,
      borrowerName: borrower?.name || a.borrowerName || "Unknown Borrower",
      agentName: agent?.name || a.agentName,
      location: borrower?.location || a.location || "Location not specified",
      loanId: borrower?.loanId || a.loanId || "N/A"
    };
  });

  // Filter assignments
  const filteredAssignments = enrichedAssignments.filter((a: any) => {
    const matchesSearch =
      searchQuery === "" ||
      a.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.agentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "All Cases" ||
      (filterStatus === "Assigned" && a.agentId) ||
      (filterStatus === "Unassigned" && !a.agentId) ||
      (filterStatus === a.status);

    return matchesSearch && matchesStatus;
  });

  // Get borrower names specifically for the workload header
  const matchingBorrowerNames = new Set(
    filteredAssignments
      .filter((a: any) => a.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()))
      .map((a: any) => a.borrowerName)
  );

  // Calculate Agent Workload based on filtered results
  const agentMap: Record<string, { name: string; location: string; cases: number }> = {};
  filteredAssignments.forEach((a: any) => {
    if (a.agentName) {
      const agentMatchesAgentSearch = agentSearchQuery === "" ||
        a.agentName.toLowerCase().includes(agentSearchQuery.toLowerCase());

      if (agentMatchesAgentSearch) {
        if (!agentMap[a.agentName]) {
          agentMap[a.agentName] = {
            name: a.agentName,
            location: a.location || "Various Locations",
            cases: 0
          };
        }
        agentMap[a.agentName].cases += 1;
      }
    }
  });

  const agentsWorkload = Object.values(agentMap);

  // Stats calculation
  const totalCases = filteredAssignments.length;
  const assigned = filteredAssignments.filter((a: any) => a.agentId).length;
  const unassigned = totalCases - assigned;
  const activeAgents = agentsWorkload.length;

  const filterOptions = ["All Cases", "Assigned", "Unassigned", "OPEN", "IN_PROGRESS", "CLOSED", "PENDING"];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {/* Page Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Agent Assignments</h1>
              <p className="text-sm text-slate-600 mt-1">Manage borrower-agent assignments</p>
            </div>

            {user?.role?.toLowerCase() !== "agent" && (
              <button
                onClick={() => { setEditingAssignment(null); setOpenModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                <UserCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Assign New Case</span>
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <span className="font-bold">Error:</span> {error}
              <button
                onClick={() => fetchAssignments()}
                className="ml-auto underline font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Cases" value={totalCases} />
            <StatCard label="Assigned" value={assigned} color="text-green-600" />
            <StatCard label="Unassigned" value={unassigned} color="text-orange-600" />
            <StatCard label="Active Agents" value={activeAgents} color="text-blue-600" />
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search borrowers, agents, or locations..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                {filterStatus}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1 overflow-hidden">
                    {filterOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => { setFilterStatus(option); setShowFilterDropdown(false); }}
                        className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <span className={filterStatus === option ? 'text-blue-600 font-semibold' : 'text-slate-600'}>
                          {option}
                        </span>
                        {filterStatus === option && <Check className="h-4 w-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignments List (Left side) */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">Cases</h2>
                <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">
                  {filteredAssignments.length} Assignments Found
                </div>
              </div>

              <div className="space-y-3 pb-8">
                {loading && assignments.length === 0 ? (
                  <LoadingSpinner text="Loading assignments..." />
                ) : filteredAssignments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed transition-all hover:bg-slate-50/50">
                    <div className="p-3 bg-slate-50 rounded-full mb-4">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No assignments match your criteria</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setFilterStatus("All Cases");
                        setAgentSearchQuery("");
                      }}
                      className="text-blue-600 text-sm font-semibold hover:underline mt-2"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  filteredAssignments.map((assign: any) => (
                    <CaseItem
                      key={assign.id}
                      assignment={assign}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Agent Workload Panel (Right side) */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit sticky top-6 order-1 lg:order-2 shadow-sm">
              <div className="flex flex-col gap-4 mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                  Agent Workload
                  {searchQuery && matchingBorrowerNames.size > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                      {matchingBorrowerNames.size} borrower{matchingBorrowerNames.size !== 1 ? 's' : ''}
                    </span>
                  )}
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter agents..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={agentSearchQuery}
                    onChange={(e) => setAgentSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {loading && assignments.length === 0 ? (
                  <LoadingSpinner size={24} text="Loading agents..." />
                ) : agentsWorkload.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm italic bg-slate-50 rounded-lg">
                    {searchQuery && matchingBorrowerNames.size === 0
                      ? `No agents for "${searchQuery}" borrowers`
                      : agentSearchQuery
                        ? `No agents matching "${agentSearchQuery}"`
                        : filteredAssignments.filter((a: any) => a.agentName).length === 0
                          ? 'No assigned agents in filtered results'
                          : 'No agents found'
                    }
                  </div>
                ) : (
                  agentsWorkload.map((agent: any, idx) => (
                    <AgentWorkload key={idx} {...agent} />
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AssignCaseModal
        open={openModal}
        initialData={editingAssignment}
        onClose={handleCloseModal}
      />
    </div>
  );
}




