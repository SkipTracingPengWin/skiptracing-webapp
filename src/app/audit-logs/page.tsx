"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { FileText, CheckCircle, Database, Download, FileDown, Search, Filter } from "lucide-react";
import { useAuditLogStore } from "@/store/auditLogs.store";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AuditModule, AuditLog } from "@/types/audit.types";
import LogDetailsModal from "@/components/auditlogs/LogDetailsModal";
import { Eye } from "lucide-react";

export default function AuditLogsPage() {
    const { auditLogs, stats, loading, fetchLogs, fetchStats } = useAuditLogStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModule, setSelectedModule] = useState<string>("");
    const [selectedTimeRange, setSelectedTimeRange] = useState<string>("");
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (log: AuditLog) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchLogs();
        fetchStats();
    }, [fetchLogs, fetchStats]);

    // Handle filters (client-side filtering for now)
    const filteredLogs = auditLogs.filter(log => {
        const userName = (typeof log.user === 'object' && log.user) ? log.user.name : (log.user || "");
        const matchSearch =
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchModule = selectedModule ? log.module === selectedModule : true;

        // Simple client-side time filtering could be added here if needed
        // const matchTime = ...

        return matchSearch && matchModule;
    });

    const getModuleColor = (module: string) => {
        switch (module) {
            case 'Borrowers': return 'bg-blue-100 text-blue-800';
            case 'Agents': return 'bg-green-100 text-green-800';
            case 'Assignments': return 'bg-indigo-100 text-indigo-800';
            case 'Verifications': return 'bg-purple-100 text-purple-800';
            case 'SocialMedia': return 'bg-pink-100 text-pink-800';
            case 'RecoveryActions': return 'bg-red-100 text-red-800';
            case 'System': return 'bg-gray-100 text-gray-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const statCards = [
        { icon: FileText, label: "Total Logs", value: stats.totalLogs, color: "bg-slate-500" },
        { icon: CheckCircle, label: "Verifications", value: stats.verifications, color: "bg-green-500" },
        { icon: Database, label: "Data Changes", value: stats.dataChanges, color: "bg-orange-500" },
        { icon: Download, label: "Exports", value: stats.exports, color: "bg-blue-500" },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Compliance & Audit Logs</h1>
                                <p className="text-sm text-slate-600 mt-1">Real-time immutable audit trail for all system activities</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white">
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm font-medium">Export CSV</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white">
                                    <FileDown className="h-4 w-4" />
                                    <span className="text-sm font-medium">Export PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {statCards.map((stat, i) => {
                            const Icon = stat.icon;
                            // Extract color class logic
                            const textColor = stat.color.replace('bg-', 'text-').replace('500', '600');

                            return (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                            <Icon className={`h-6 w-6 ${textColor}`} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                            <div className={`text-2xl font-bold ${textColor}`}>
                                                {stat.value}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filters and Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        {/* Filters */}
                        <div className="p-6 border-b border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search action, details or user..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                    />
                                </div>

                                <select
                                    value={selectedModule}
                                    onChange={(e) => setSelectedModule(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
                                >
                                    <option value="">All Modules</option>
                                    <option value="Borrowers">Borrowers</option>
                                    <option value="Agents">Agents</option>
                                    <option value="Assignments">Assignments</option>
                                    <option value="Verifications">Verifications</option>
                                    <option value="SocialMedia">Social Media</option>
                                    <option value="RecoveryActions">Recovery Actions</option>
                                    <option value="System">System</option>
                                    <option value="Reports">Reports</option>
                                </select>

                                <select
                                    value={selectedTimeRange}
                                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-white"
                                >
                                    <option value="">All Time</option>
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Module</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                </div>
                                                <p className="mt-2 text-slate-500">Loading audit logs...</p>
                                            </td>
                                        </tr>
                                    ) : filteredLogs.length > 0 ? (
                                        filteredLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {format(new Date(log.timestamp), 'PPpp')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                    {log.action}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getModuleColor(log.module)}`}>
                                                        {log.module}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                    {(typeof log.user === 'object' && log.user) ? log.user.name : (log.user || "Unknown")}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={log.details}>
                                                    {log.details}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`flex items-center gap-1.5 text-xs font-medium
                                                        ${log.status === 'Success' ? 'text-green-600' :
                                                            log.status === 'Warning' ? 'text-amber-600' :
                                                                'text-red-600'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'Success' ? 'bg-green-600' :
                                                            log.status === 'Warning' ? 'bg-amber-600' :
                                                                'bg-red-600'
                                                            }`}></span>
                                                        {log.status}
                                                    </span>

                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleViewDetails(log)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="h-16 w-16 text-slate-300 mb-4" />
                                                    <p className="text-slate-600 font-medium mb-1">No logs found</p>
                                                    <p className="text-sm text-slate-500">
                                                        {searchTerm || selectedModule ? "Try adjusting your filters" : "Audit logs will appear here once actions are performed"}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <LogDetailsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                log={selectedLog}
            />
        </div >
    );
}
