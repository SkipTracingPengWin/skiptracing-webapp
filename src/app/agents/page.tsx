"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
    Users,
    UserCheck,
    Clock,
    UserX,
    Phone,
    Mail,
    MapPin,
    Star,
    MoreVertical,
    Edit,
    Trash,
} from "lucide-react";
import { useAgentStore } from "@/store/agents.store";
import { useAuthStore } from "@/store/auth.store";
import AddNewAgentModal from "@/components/agents/addnewagent.modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Agent, AgentStatus } from "@/types";

// Agent Card Component
interface AgentCardProps {
    agent: Agent;
}

function AgentCard({ agent }: AgentCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openModal, updateAgent } = useAgentStore();
    const { user } = useAuthStore();
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const isAgent = user?.role === 'AGENT';
    // Show actions if admin/manager OR if it's the agent themselves (which page.tsx filters for)
    const showActions = isAdminOrManager || isAgent;

    const statusStyles: Record<string, { bg: string; text: string; dot: string; hover: string }> = {
        ONLINE: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", hover: "hover:bg-green-100" },
        OFFLINE: { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400", hover: "hover:bg-slate-100" },
        BUSY: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", hover: "hover:bg-orange-100" },
        LEAVE: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", hover: "hover:bg-red-100" },
    };

    const currentStatus = (agent.status || "OFFLINE").toUpperCase();
    const style = statusStyles[currentStatus] || statusStyles.OFFLINE;

    const getInitials = (name: string) => {
        if (!name) return "AG";
        return name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                            {getInitials(agent.name || "Agent")}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{agent.name || "Unnamed Agent"}</h3>
                        <p className="text-sm text-slate-500">AGT-{agent.id ? String(agent.id).slice(-4) : "0000"}</p>
                    </div>
                </div>
                <div className="relative">
                    {showActions && (
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                        </button>
                    )}

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 z-50 py-1">
                            {showActions && (
                                <button
                                    onClick={() => {
                                        console.log("✏️ Editing agent:", agent.id);
                                        openModal("edit", agent);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Edit className="h-4 w-4" /> {isAgent ? "Update" : "Edit Agent"}
                                </button>
                            )}
                            {isAdminOrManager && (
                                <button
                                    onClick={() => {
                                        openModal("delete", agent);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash className="h-4 w-4" /> Delete Agent
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{agent.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate max-w-[180px]">{agent.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{agent.location || "Unknown"}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            if (!showActions) return;

                            const statuses: AgentStatus[] = ["ONLINE", "OFFLINE", "BUSY", "LEAVE"];
                            const currentIndex = statuses.indexOf(currentStatus as AgentStatus);
                            // If currentStatus is not in the list (e.g. invalid), default to index 0 (ONLINE)
                            const validIndex = currentIndex === -1 ? 0 : currentIndex;
                            const nextStatus = statuses[(validIndex + 1) % statuses.length];

                            updateAgent(agent.id, { status: nextStatus });
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 ${style.bg} ${style.hover} ${style.text} rounded-full transition-all duration-300 group/status shadow-sm border border-transparent hover:border-slate-200 active:scale-95 ${!showActions ? 'opacity-70 cursor-not-allowed pointer-events-none' : ''}`}
                        title={showActions ? `Current status: ${currentStatus.replace("_", " ")}. Click to change.` : "Status is managed by admin"}
                        disabled={!showActions}
                    >
                        <div className="relative flex items-center justify-center">
                            {currentStatus === "ONLINE" && (
                                <div className="absolute h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75"></div>
                            )}
                            <div
                                className={`h-2 w-2 rounded-full ${style.dot} transition-transform duration-300 group-hover/status:scale-110 shadow-sm`}
                            ></div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {String(agent.status || "offline").replace("_", " ")}
                        </span>
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-slate-900">4.5</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <div className="text-xs text-slate-500 mb-1">Cases Assigned</div>
                    <div className="text-lg font-bold text-slate-900">{agent.cases || 0}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 mb-1">Success Rate</div>
                    <div className="text-lg font-bold text-blue-600">{Number(agent.successRate || 0).toFixed(2)}%</div>
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${agent.successRate || 0}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default function AgentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Zustand Store
    const { agents, fetchAgents, openModal, loading } = useAgentStore();

    const { user } = useAuthStore();
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    useEffect(() => {
        if (user?.role === "ADMIN" || user?.role === "MANAGER" || user?.role === "AGENT") {
            fetchAgents();
        }
    }, [fetchAgents, user?.role]);

    // Combined Filter Logic
    const filteredAgents = agents.filter((agent: Agent) => {
        const name = agent.name || "";
        const email = agent.email || "";
        const phone = agent.phone || "";
        const status = agent.status || "Offline";
        const location = agent.location || "";

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm);

        const matchesStatus =
            statusFilter === "All" ||
            status.toLowerCase() === statusFilter.toLowerCase();

        // Return only the logged-in agent's card if doing restricted view
        if (user?.role === "AGENT") {
            return matchesSearch && matchesStatus && agent.userId === user.id;
        }

        return matchesSearch && matchesStatus;
    });

    const stats = [
        {
            icon: Users,
            label: "Total Agents",
            value: agents.length,
            color: "bg-blue-500",
        },
        {
            icon: UserCheck,
            label: "Active",
            value: agents.filter((a: Agent) => (a.status || "").toLowerCase() === "active").length,
            color: "bg-green-500",
        },
        {
            icon: Clock,
            label: "Busy",
            value: agents.filter((a: Agent) => (a.status || "").toLowerCase() === "busy").length,
            color: "bg-orange-500",
        },
        {
            icon: UserX,
            label: "Offline",
            value: agents.filter((a: Agent) => (a.status || "").toLowerCase() === "offline").length,
            color: "bg-slate-400",
        },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {/* Page Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Field Agents</h1>
                            <p className="text-sm text-slate-600 mt-1">Manage and track field collection agents</p>
                        </div>
                        {isAdminOrManager && (
                            <button
                                onClick={() => openModal("add")}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                            >
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-medium">Add Agent</span>
                            </button>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color} text-white`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-sm text-slate-600">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, email, location or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50/50"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50/50 min-w-[140px]"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Busy">Busy</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>

                    {/* Agent Cards Grid */}
                    {loading ? (
                        <LoadingSpinner text="Loading agents..." />
                    ) : filteredAgents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                            {filteredAgents.map((agent: Agent, index: number) => (
                                <AgentCard key={agent.id || `agent-${index}`} agent={agent} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <div className="mx-auto h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No agents found</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-1">
                                We couldn't find any agents matching your current search or filters.
                            </p>
                        </div>
                    )}
                </main>
            </div>
            <AddNewAgentModal />
        </div>
    );
}
