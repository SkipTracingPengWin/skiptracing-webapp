"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useRecoveryActionsStore } from "@/store/recoveryactionsStore";
import { useAuthStore } from "@/store/auth.store";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { MessageSquare, Phone, MapPin, FileText, Plus, Calendar, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import ActionModal from "@/components/recoveryactions/Recoveryforms.modal";
import { format } from "date-fns";

function ActionTypeCard({ icon: Icon, label, color, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center group"
        >
            <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${color} mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">{label}</h3>
        </button>
    );
}

export default function RecoveryActionsPage() {
    const [isModalOpen, setModalOpen] = useState(false);

    const {
        filteredActions,
        filterType,
        filterStatus,
        searchQuery,
        setFilterType,
        setFilterStatus,
        setSearchQuery,
        applyFilters,
        fetchActions,
        isLoading
    } = useRecoveryActionsStore();

    useEffect(() => {
        fetchActions();
    }, [fetchActions]);

    useEffect(() => {
        applyFilters();
    }, [filterType, filterStatus, searchQuery, applyFilters]);

    const iconMap: any = {
        "CALL": Phone,
        "SMS": MessageSquare,
        "VISIT": MapPin,
        "NOTICE_LEGAL": FileText,
        "OTHER": FileText,
    };

    const actionTypes = [
        { icon: MessageSquare, label: "Send SMS", color: "bg-blue-500" },
        { icon: Phone, label: "Make Call", color: "bg-green-500" },
        { icon: MapPin, label: "Schedule Visit", color: "bg-orange-500" },
        { icon: FileText, label: "Legal Notice", color: "bg-red-500" },
    ];

    const stats = [
        { label: "Total Actions", value: `${filteredActions.length}`, color: "text-slate-900" },
        { label: "Pending", value: `${filteredActions.filter((a: any) => a.status === "PENDING").length}`, color: "text-orange-600" },
        { label: "Completed", value: `${filteredActions.filter((a: any) => a.status === "COMPLETED").length}`, color: "text-green-600" },
        { label: "Sent", value: `${filteredActions.filter((a: any) => a.status === "SENT").length}`, color: "text-blue-600" },
    ];

    const statusColors: any = {
        "COMPLETED": "bg-green-100 text-green-700",
        "PENDING": "bg-orange-100 text-orange-700",
        "SENT": "bg-blue-100 text-blue-700",
        "FAILED": "bg-red-100 text-red-700",
    };

    const { user } = useAuthStore();
    const isAgent = user?.role === "AGENT";

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* TITLE */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Recovery Actions</h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Manage SMS, calls, visits, and legal notices
                            </p>
                        </div>
                        {!isAgent && (
                            <button
                                onClick={() => setModalOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
                            >
                                <Plus className="h-5 w-5" />
                                New Action
                            </button>
                        )}
                    </div>

                    {/* ACTION TYPES */}
                    {!isAgent && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {actionTypes.map((type, i) => (
                                <ActionTypeCard
                                    key={i}
                                    {...type}
                                    onClick={() => setModalOpen(true)}
                                />
                            ))}
                        </div>
                    )}

                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                <div className={`text-3xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEARCH & FILTERS */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by borrower name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All Types">All Types</option>
                                <option value="CALL">Call</option>
                                <option value="SMS">SMS</option>
                                <option value="VISIT">Visit</option>
                                <option value="NOTICE_LEGAL">Legal Notice</option>
                                <option value="OTHER">Other</option>
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="All Status">All Status</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="SENT">Sent</option>
                                <option value="FAILED">Failed</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        {isLoading ? (
                            <div className="px-6 py-12">
                                <LoadingSpinner text="Loading recovery actions..." />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Borrower</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Priority</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Executed At</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Created</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-200">
                                        {filteredActions.map((action: any) => {
                                            const Icon = iconMap[action.type] || FileText;
                                            return (
                                                <tr key={action.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                <Icon className="h-4 w-4 text-blue-600" />
                                                            </div>
                                                            <span className="text-sm font-medium">{action.type}</span>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm">{action.borrowerName || "Unknown"}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${action.priority === "HIGH" ? "bg-red-100 text-red-700" :
                                                                action.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" :
                                                                    "bg-blue-100 text-blue-700"
                                                            }`}>
                                                            {action.priority || "MEDIUM"}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm flex items-center gap-2">
                                                        {action.executedAt ? (
                                                            <>
                                                                <Calendar className="h-4 w-4 text-slate-400" />
                                                                {format(new Date(action.executedAt), "MMM dd, yyyy HH:mm")}
                                                            </>
                                                        ) : (
                                                            <span className="text-slate-400">Not scheduled</span>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[action.status] || "bg-slate-100 text-slate-700"}`}>
                                                            {action.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-slate-600">
                                                        {format(new Date(action.createdAt), "MMM dd, yyyy")}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                            <MoreVertical className="h-4 w-4 text-slate-600" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {filteredActions.length === 0 && !isLoading && (
                                    <div className="px-6 py-12 text-center text-slate-600">
                                        No recovery actions found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>

                {/* MODAL */}
                {!isAgent && isModalOpen && (
                    <ActionModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
