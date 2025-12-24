// "use client";

// import { useState, useEffect } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";
// import { UserCircle, MapPin, Loader2, Search, ChevronDown, Check, MoreVertical, Edit2, Trash2, ExternalLink } from "lucide-react";
// import { useBorrowerStore } from "@/store/borrowers.store";
// import { useAgentStore } from "@/store/agents.store";
// import { useAssignmentStore } from "@/store/assignments.store";
// import { useRouter } from "next/navigation";
// import AssignCaseModal from "@/components/assignments/assigncaseform.modal";
// import type { Assignment } from "@/types";

// // Agent Workload Component
// function AgentWorkload({ name, location, cases }: any) {
//   const maxCases = 10;
//   const percentage = Math.min((cases / maxCases) * 100, 100);

//   return (
//     <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
//       <div className="flex items-center gap-3">
//         <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
//           <span className="text-white font-semibold text-sm">
//             {name.split(" ").map((n: string) => n[0]).join("")}
//           </span>
//         </div>
//         <div>
//           <div className="font-semibold text-sm text-slate-900">{name}</div>
//           <div className="text-xs text-slate-500">{location}</div>
//         </div>
//       </div>
//       <div className="text-right">
//         <div className="text-sm font-semibold text-slate-900">{cases} cases</div>
//         <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
//           <div
//             className="h-full bg-blue-600 rounded-full"
//             style={{ width: `${percentage}%` }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Case Item Component
// function CaseItem({ assignment, onEdit, onDelete }: { assignment: any, onEdit: (a: any) => void, onDelete: (id: string | number) => void }) {
//   const [showActions, setShowActions] = useState(false);
//   const router = useRouter();

//   const riskColors: Record<string, string> = {
//     high: "bg-red-100 text-red-700",
//     medium: "bg-orange-100 text-orange-700",
//     low: "bg-green-100 text-green-700",
//     critical: "bg-red-600 text-white",
//   };

//   const priority = assignment.priority?.toLowerCase() || "medium";

//   return (
//     <div className="bg-white p-5 rounded-xl border border-slate-200 hover:shadow-lg transition-all relative group">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-1">
//             <h3 className="font-bold text-slate-900 text-lg">{assignment.borrowerName}</h3>
//             <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${riskColors[priority] || 'bg-gray-100 text-gray-700'}`}>
//               {assignment.priority || 'Medium'}
//             </span>
//           </div>

//           <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
//             <span>Loan: {assignment.loanId}</span>
//             <span className="text-slate-900 font-semibold">₹{new Number(assignment.amount).toLocaleString()}</span>
//             <div className="flex items-center gap-1">
//               <MapPin className="h-3.5 w-3.5 text-slate-400" />
//               <span>{assignment.location || "Location not specified"}</span>
//             </div>
//           </div>
//         </div>

//         <div className="relative">
//           <button
//             onClick={() => setShowActions(!showActions)}
//             className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
//           >
//             <MoreVertical className="h-5 w-5 text-slate-400" />
//           </button>

//           {showActions && (
//             <>
//               <div
//                 className="fixed inset-0 z-10"
//                 onClick={() => setShowActions(false)}
//               ></div>
//               <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 py-1 overflow-hidden">
//                 <button
//                   onClick={() => { router.push(`/borrowerprofile?id=${assignment.borrowerId}`); setShowActions(false); }}
//                   className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
//                 >
//                   <ExternalLink className="h-4 w-4 text-slate-500" />
//                   View Profile
//                 </button>
//                 <div className="h-px bg-slate-100 my-1 mx-2"></div>
//                 <button
//                   onClick={() => { onEdit(assignment); setShowActions(false); }}
//                   className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
//                 >
//                   <Edit2 className="h-4 w-4 text-blue-500" />
//                   Edit Case
//                 </button>
//                 <div className="h-px bg-slate-100 my-1 mx-2"></div>
//                 <button
//                   onClick={() => { onDelete(assignment.id); setShowActions(false); }}
//                   className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Delete Case
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
//         <div className="flex items-center gap-3">
//           {assignment.agentName ? (
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
//                 <UserCircle className="h-5 w-5 text-blue-600" />
//               </div>
//               <div>
//                 <span className="text-sm text-slate-900 font-semibold block">{assignment.agentName}</span>
//                 <span className="text-[10px] text-slate-400 font-medium">Assigned on {new Date(assignment.assignedAt).toLocaleDateString()}</span>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
//                 <UserCircle className="h-5 w-5 text-slate-300" />
//               </div>
//               <span className="text-sm font-medium text-slate-400">No agent assigned</span>
//             </div>
//           )}
//         </div>

//         <div className="flex items-center gap-3">
//           {!assignment.agentName ? (
//             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100">
//               <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
//               UNASSIGNED
//             </div>
//           ) : (
//             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold border border-green-100">
//               <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
//               ASSIGNED
//             </div>
//           )}

//           <button
//             onClick={() => onEdit(assignment)}
//             className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
//           >
//             {assignment.agentName ? "Reassign" : "Assign"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AssignmentsPage() {
//   const [openModal, setOpenModal] = useState(false);
//   const [editingAssignment, setEditingAssignment] = useState<any>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("All Cases");
//   const [showFilterDropdown, setShowFilterDropdown] = useState(false);
//   const [agentSearchQuery, setAgentSearchQuery] = useState("");

//   const { assignments, loading: loadingAssignments, error, fetchAssignments, deleteAssignment } = useAssignmentStore();
//   const { borrowers, fetchBorrowers, loading: loadingBorrowers } = useBorrowerStore();
//   const { agents, fetchAgents, loading: loadingAgents } = useAgentStore();

//   useEffect(() => {
//     fetchAssignments();
//     fetchBorrowers();
//     fetchAgents();
//   }, [fetchAssignments, fetchBorrowers, fetchAgents]);

//   const loading = loadingAssignments || loadingBorrowers || loadingAgents;

//   const handleEdit = (assignment: any) => {
//     setEditingAssignment(assignment);
//     setOpenModal(true);
//   };

//   const handleDelete = async (id: string | number) => {
//     if (confirm("Are you sure you want to delete this assignment?")) {
//       try {
//         await deleteAssignment(id);
//       } catch (err) {
//         console.error("Delete failed:", err);
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setEditingAssignment(null);
//   };

//   // Enrich assignments with borrower and agent names/locations
//   const enrichedAssignments = assignments.map(a => {
//     const borrower = borrowers.find(b => String(b.id) === String(a.borrowerId));
//     const agent = agents.find(ag => String(ag.id) === String(a.agentId));

//     return {
//       ...a,
//       borrowerName: borrower?.name || a.borrowerName || "Unknown Borrower",
//       agentName: agent?.name || a.agentName,
//       location: borrower?.location || a.location || "Location not specified",
//       loanId: borrower?.loanId || a.loanId || "N/A"
//     };
//   });

//   // Filtering logic
//   const filteredAssignments = enrichedAssignments.filter(a => {
//     const matchesSearch =
//       a.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (a.agentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
//       a.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       a.location.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesStatus =
//       filterStatus === "All Cases" ||
//       (filterStatus === "Assigned" && a.agentId) ||
//       (filterStatus === "Unassigned" && !a.agentId);

//     return matchesSearch && matchesStatus;
//   });

//   // Extract unique agents for workload section
//   const agentMap: Record<string, { name: string; location: string; cases: number }> = {};
//   enrichedAssignments.forEach((a) => {
//     if (a.agentName) {
//       if (!agentMap[a.agentName]) {
//         agentMap[a.agentName] = {
//           name: a.agentName,
//           location: a.location || "Various Locations",
//           cases: 0
//         };
//       }
//       agentMap[a.agentName].cases += 1;
//     }
//   });
//   const agentsWorkload = Object.values(agentMap).filter(agent =>
//     agent.name.toLowerCase().includes(agentSearchQuery.toLowerCase())
//   );

//   // Stats calculation
//   const totalCases = enrichedAssignments.length;
//   const assigned = enrichedAssignments.filter((a) => a.agentId).length;
//   const unassigned = totalCases - assigned;
//   const activeAgents = agentsWorkload.length;

//   const filterOptions = ["All Cases", "Assigned", "Unassigned"];

//   return (
//     <div className="flex h-screen bg-slate-50">
//       <Sidebar />

//       <div className="flex-1 ml-64 flex flex-col overflow-hidden">
//         <Header />

//         <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
//           {/* Header */}
//           <div className="mb-6 flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">Agent Assignments</h1>
//               <p className="text-sm text-slate-600 mt-1">Manage and track borrower-agent assignments</p>
//             </div>

//             <button
//               onClick={() => { setEditingAssignment(null); setOpenModal(true); }}
//               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
//             >
//               <UserCircle className="h-4 w-4" />
//               <span className="text-sm font-medium">Assign New Case</span>
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
//               <span className="font-bold">Error:</span> {error}
//               <button
//                 onClick={() => fetchAssignments()}
//                 className="ml-auto underline font-medium"
//               >
//                 Retry
//               </button>
//             </div>
//           )}

//           {/* Stats Bar */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <StatCard label="Total Cases" value={totalCases} />
//             <StatCard label="Assigned" value={assigned} color="text-green-600" />
//             <StatCard label="Unassigned" value={unassigned} color="text-orange-600" />
//             <StatCard label="Active Agents" value={activeAgents} color="text-blue-600" />
//           </div>

//           {/* Search and Filters */}
//           <div className="flex items-center gap-4 mb-6">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search borrowers, agents, or locations..."
//                 className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             <div className="relative">
//               <button
//                 onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                 className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
//               >
//                 {filterStatus}
//                 <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
//               </button>

//               {showFilterDropdown && (
//                 <>
//                   <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)}></div>
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1 overflow-hidden">
//                     {filterOptions.map(option => (
//                       <button
//                         key={option}
//                         onClick={() => { setFilterStatus(option); setShowFilterDropdown(false); }}
//                         className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
//                       >
//                         <span className={filterStatus === option ? 'text-blue-600 font-semibold' : 'text-slate-600'}>
//                           {option}
//                         </span>
//                         {filterStatus === option && <Check className="h-4 w-4 text-blue-600" />}
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Assignments List (Left side) */}
//             <div className="lg:col-span-2 order-2 lg:order-1">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-bold text-slate-800">Cases</h2>
//                 <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full font-medium">
//                   {filteredAssignments.length} Assignments Found
//                 </div>
//               </div>

//               <div className="space-y-4 pb-8">
//                 {loading && assignments.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
//                     <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
//                     <span className="text-sm text-slate-500">Loading assignments...</span>
//                   </div>
//                 ) : filteredAssignments.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed transition-all hover:bg-slate-50/50">
//                     <div className="p-3 bg-slate-50 rounded-full mb-4">
//                       <Search className="h-8 w-8 text-slate-300" />
//                     </div>
//                     <p className="text-slate-500 font-medium">No assignments match your criteria</p>
//                     <button
//                       onClick={() => { setSearchQuery(""); setFilterStatus("All Cases"); }}
//                       className="text-blue-600 text-sm font-semibold hover:underline mt-2"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 ) : (
//                   filteredAssignments.map((assign) => (
//                     <CaseItem
//                       key={assign.id}
//                       assignment={assign}
//                       onEdit={handleEdit}
//                       onDelete={handleDelete}
//                     />
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Agent Workload Panel (Right side) */}
//             <div className="bg-white p-6 rounded-xl border border-slate-200 h-fit sticky top-6 order-1 lg:order-2">
//               <div className="flex flex-col gap-4 mb-4">
//                 <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
//                   Agent Workload
//                 </h2>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                   <input
//                     type="text"
//                     placeholder="Filter agents..."
//                     className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                     value={agentSearchQuery}
//                     onChange={(e) => setAgentSearchQuery(e.target.value)}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
//                 {loading && assignments.length === 0 ? (
//                   <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
//                 ) : agentsWorkload.length === 0 ? (
//                   <div className="text-center py-8 text-slate-500 text-sm italic bg-slate-50 rounded-lg">No matching agents</div>
//                 ) : (
//                   agentsWorkload.map((agent: any, idx) => (
//                     <AgentWorkload key={idx} {...agent} />
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       <AssignCaseModal
//         open={openModal}
//         initialData={editingAssignment}
//         onClose={handleCloseModal}
//       />
//     </div>
//   );
// }

// function StatCard({ label, value, color = "text-slate-900" }: { label: string; value: number | string, color?: string }) {
//   return (
//     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
//       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</div>
//       <div className={`text-3xl font-bold ${color}`}>{value}</div>
//     </div>
//   );
// }
// //                   </div>
// //                 ) : (
// //                   agentsWorkload.map((agent: any, idx) => (
// //                     <AgentWorkload key={idx} {...agent} />
// //                   ))
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </main>
// //       </div>

// //       <AssignCaseModal
// //         open={openModal}
// //         initialData={editingAssignment}
// //         onClose={handleCloseModal}
// //       />
// //     </div>
// //   );
// // }

// // function StatCard({ label, value, color = "text-slate-900" }: { label: string; value: number | string, color?: string }) {
// //   return (
// //     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
// //       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</div>
// //       <div className={`text-3xl font-bold ${color}`}>{value}</div>
// //     </div>
// //   );
// // }


"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { 
  UserCircle, MapPin, Loader2, Search, ChevronDown, Check, 
  MoreVertical, Edit2, Trash2, ExternalLink, Banknote, FileText, ArrowRightLeft 
} from "lucide-react";
import { useBorrowerStore } from "@/store/borrowers.store";
import { useAgentStore } from "@/store/agents.store";
import { useAssignmentStore } from "@/store/assignments.store";
import { useRouter } from "next/navigation";
import AssignCaseModal from "@/components/assignments/assigncaseform.modal";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

// --- Components ---

// 1. Agent Workload Component
function AgentWorkload({ name, location, cases }: any) {
  const maxCases = 10;
  const percentage = Math.min((cases / maxCases) * 100, 100);

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white font-semibold text-sm">
            {name.split(" ").map((n: string) => n[0]).join("")}
          </span>
        </div>
        <div>
          <div className="font-semibold text-sm text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{location}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-slate-900">{cases} cases</div>
        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// 2. Case Item Component (Compact & Attractive)
function CaseItem({ assignment, onEdit, onDelete }: { assignment: any, onEdit: (a: any) => void, onDelete: (id: string | number) => void }) {
  const [showActions, setShowActions] = useState(false);
  const router = useRouter();

  const riskColors: Record<string, string> = {
    high: "bg-red-50 text-red-700 border-red-100",
    medium: "bg-orange-50 text-orange-700 border-orange-100",
    low: "bg-green-50 text-green-700 border-green-100",
    critical: "bg-red-600 text-white border-red-600",
  };

  const priority = assignment.priority?.toLowerCase() || "medium";
  const isAssigned = !!assignment.agentName;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-slate-200 bg-white overflow-hidden flex flex-col">
      {/* HEADER: Name, Priority, Menu - REDUCED PADDING */}
      <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[200px]" title={assignment.borrowerName}>
            {assignment.borrowerName}
          </h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${riskColors[priority]}`}>
            {assignment.priority || 'Medium'}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showActions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)}></div>
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                  onClick={() => { router.push(`/borrowerprofile?id=${assignment.borrowerId}`); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ExternalLink className="h-3 w-3" /> View Profile
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => { onEdit(assignment); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Edit2 className="h-3 w-3 text-blue-500" /> Edit Case
                </button>
                <button
                  onClick={() => { onDelete(assignment.id); setShowActions(false); }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-3 w-3" /> Delete Case
                </button>
              </div>
            </>
          )}
        </div>
      </CardHeader>

      {/* BODY: Metrics Grid - COMPACT ROW LAYOUT */}
      <CardContent className="p-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Loan ID */}
          <div className="flex flex-col justify-center px-2 py-1.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
               <FileText className="h-3 w-3" /> Loan ID
            </span>
            <span className="text-xs font-semibold text-slate-700 truncate">{assignment.loanId}</span>
          </div>

          {/* Amount */}
          <div className="flex flex-col justify-center px-2 py-1.5 rounded bg-emerald-50/40 border border-emerald-100/50">
             <span className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider flex items-center gap-1">
               <Banknote className="h-3 w-3" /> Amount
            </span>
            <span className="text-sm font-bold text-emerald-700 truncate">
              ₹{new Number(assignment.amount).toLocaleString()}
            </span>
          </div>

          {/* Location */}
          <div className="flex flex-col justify-center px-2 py-1.5 rounded bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Location
            </span>
            <span className="text-xs font-semibold text-slate-700 truncate" title={assignment.location}>
              {assignment.location || "N/A"}
            </span>
          </div>
        </div>
      </CardContent>

      {/* FOOTER: Agent & Actions - COMPACT HEIGHT */}
      <CardFooter className="mt-auto p-2.5 px-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        {/* Agent Info Area */}
        <div className="flex-1 min-w-0 pr-2">
          {isAssigned ? (
            <div className="flex items-center gap-2 group/agent cursor-default">
              <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm group-hover/agent:border-blue-200 transition-colors">
                <UserCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-slate-400 font-medium">Assigned to</span>
                <span className="text-xs text-slate-900 font-bold truncate max-w-[120px]">{assignment.agentName}</span>
              </div>
            </div>
          ) : (
             <div className="flex items-center gap-2 opacity-60">
              <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <UserCircle className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-xs text-slate-500 font-semibold italic">Unassigned</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div>
          {isAssigned ? (
             <button
              onClick={() => onEdit(assignment)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-[11px] font-bold rounded hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all active:scale-95 group/btn"
            >
              <ArrowRightLeft className="h-3 w-3 text-slate-400 group-hover/btn:text-blue-500 transition-colors" />
              Reassign
            </button>
          ) : (
            <button
              onClick={() => onEdit(assignment)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded hover:bg-blue-700 shadow-sm hover:shadow-blue-200 transition-all active:scale-95"
            >
              Assign
              <ArrowRightLeft className="h-3 w-3 opacity-70" />
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// 3. Stat Card Component
function StatCard({ label, value, color = "text-slate-900" }: { label: string; value: number | string, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

// --- Main Page Component ---

export default function AssignmentsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Cases");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [agentSearchQuery, setAgentSearchQuery] = useState("");

  const { assignments, loading: loadingAssignments, error, fetchAssignments, deleteAssignment } = useAssignmentStore();
  const { borrowers, fetchBorrowers, loading: loadingBorrowers } = useBorrowerStore();
  const { agents, fetchAgents, loading: loadingAgents } = useAgentStore();

  useEffect(() => {
    fetchAssignments();
    fetchBorrowers();
    fetchAgents();
  }, [fetchAssignments, fetchBorrowers, fetchAgents]);

  const loading = loadingAssignments || loadingBorrowers || loadingAgents;

  const handleEdit = (assignment: any) => {
    setEditingAssignment(assignment);
    setOpenModal(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await deleteAssignment(id);
      } catch (err) {
        console.error("Delete failed:", err);
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
      (filterStatus === "Unassigned" && !a.agentId);

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

  const filterOptions = ["All Cases", "Assigned", "Unassigned"];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Page Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Agent Assignments</h1>
              <p className="text-sm text-slate-600 mt-1">Manage and track borrower-agent assignments</p>
            </div>

            <button
              onClick={() => { setEditingAssignment(null); setOpenModal(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              <UserCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Assign New Case</span>
            </button>
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
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                    <span className="text-sm text-slate-500">Loading assignments...</span>
                  </div>
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
                  <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
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