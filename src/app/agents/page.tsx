"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
    Users,
    UserCheck,
    Clock,
    UserX,
} from "lucide-react";
import { useAgentStore } from "@/store/agents.store";
import { useAuthStore } from "@/store/auth.store";
import AddNewAgentModal from "@/components/agents/addnewagent.modal";
import AgentCard from "@/components/agents/AgentCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Agent } from "@/types";

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
