"use client";

import { useState } from "react";
import {
    MoreVertical,
    Edit,
    Trash,
    Phone,
    Mail,
    MapPin,
    Star,
} from "lucide-react";
import { useAgentStore } from "@/store/agents.store";
import { useAuthStore } from "@/store/auth.store";
import { Agent, AgentStatus } from "@/types";

interface AgentCardProps {
    agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openModal, updateAgent } = useAgentStore();
    const { user } = useAuthStore();
    const isAdminOrManager = user?.role === 'ADMIN' || user?.role === 'MANAGER';
    const isAgent = user?.role === 'AGENT';
    // Show actions if admin/manager OR if it's the agent themselves
    const showActions = isAdminOrManager || isAgent;

    const statusStyles: Record<string, { bg: string; text: string; dot: string; hover: string; label: string }> = {
        ONLINE: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", hover: "hover:bg-green-100", label: "Online" },
        OFFLINE: { bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400", hover: "hover:bg-slate-100", label: "Offline" },
        BUSY: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500", hover: "hover:bg-orange-100", label: "Busy" },
        LEAVE: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", hover: "hover:bg-red-100", label: "On Leave" },
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
                            {style.label}
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
