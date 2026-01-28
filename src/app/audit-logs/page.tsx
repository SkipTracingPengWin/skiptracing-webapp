"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { FileText, CheckCircle, Database, Download, FileDown, Search } from "lucide-react";
import { useAuditLogStore } from "@/store/auditLogs.store";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { AuditModule, AuditLog } from "@/types/audit.types";
import LogDetailsModal from "@/components/auditlogs/LogDetailsModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Eye } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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

    // Optimized filtered logs
    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            // User name extraction
            const userName = String(log.actorName ||
                (typeof log.user === 'object' && log.user ? log.user.name : (log.user || "")));

            // Search filter - only apply if search term exists
            const matchSearch = !searchTerm ||
                log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                userName.toLowerCase().includes(searchTerm.toLowerCase());

            // Robust Module Mapping Logic
            const logModule = String(log.module).toUpperCase();
            let matchModule = !selectedModule;

            if (selectedModule) {
                const target = selectedModule.toLowerCase();
                // Map user-friendly dropdown values to technical log labels
                if (target === "borrowers") matchModule = logModule.includes("BORROWER");
                else if (target === "agents") matchModule = logModule.includes("AGENT");
                else if (target === "assignments") matchModule = logModule.includes("ASSIG");
                else if (target === "verifications") matchModule = logModule.includes("VERIF");
                else if (target === "socialmedia") matchModule = logModule.includes("SOCIAL");
                else if (target === "recoveryactions") matchModule = logModule.includes("RECOVERY");
                else if (target === "system") matchModule = logModule.includes("SYSTEM");
                else if (target === "reports") matchModule = logModule.includes("REPORT");
                else matchModule = logModule === selectedModule.toUpperCase();
            }

            // Time filter - robust timestamp handling
            let matchTime = true;
            if (selectedTimeRange) {
                const logDate = new Date(log.timestamp).getTime();
                const now = Date.now();
                if (isNaN(logDate)) {
                    matchTime = false;
                } else {
                    const diffMs = now - logDate;
                    switch (selectedTimeRange) {
                        case "24h":
                            matchTime = diffMs <= 24 * 60 * 60 * 1000;
                            break;
                        case "7d":
                            matchTime = diffMs <= 7 * 24 * 60 * 60 * 1000;
                            break;
                        case "30d":
                            matchTime = diffMs <= 30 * 24 * 60 * 60 * 1000;
                            break;

                        default:
                            matchTime = true;
                    }
                }
            }

            return matchSearch && matchModule && matchTime;
        });
    }, [auditLogs, searchTerm, selectedModule, selectedTimeRange]);

    const getModuleColor = (module: string) => {
        const colors: Record<string, string> = {
            'Borrowers': 'bg-blue-100 text-blue-800',
            'Agents': 'bg-green-100 text-green-800',
            'Assignments': 'bg-indigo-100 text-indigo-800',
            'Verifications': 'bg-purple-100 text-purple-800',
            'SocialMedia': 'bg-pink-100 text-pink-800',
            'RecoveryActions': 'bg-red-100 text-red-800',
            'System': 'bg-gray-100 text-gray-800',
            'Reports': 'bg-yellow-100 text-yellow-800',
        };
        return colors[module] || 'bg-slate-100 text-slate-800';
    };

    // Dynamic Stats calculated from filtered table data
    const dynamicStats = useMemo(() => {
        return {
            total: filteredLogs.length,
            verifications: filteredLogs.filter(log => String(log.module).toUpperCase().includes("VERIF")).length,
            dataChanges: filteredLogs.filter(log => ["CREATE", "UPDATE", "DELETE", "PATCH"].some(a => log.action.toUpperCase().includes(a))).length,
            exports: filteredLogs.filter(log => log.action.toLowerCase().includes("export") || log.action.toLowerCase().includes("download")).length
        };
    }, [filteredLogs]);

    const statCards = [
        { icon: FileText, label: "Total Logs", value: dynamicStats.total, color: "bg-slate-500" },
        { icon: CheckCircle, label: "Verifications", value: dynamicStats.verifications, color: "bg-green-500" },
        { icon: Database, label: "Data Changes", value: dynamicStats.dataChanges, color: "bg-orange-500" },
        { icon: Download, label: "Exports", value: dynamicStats.exports, color: "bg-blue-500" },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
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
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm font-medium">Export CSV</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
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
                            const textColor = stat.color.replace('bg-', 'text-').replace('500', '600');

                            return (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-sm transition-all">
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
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Filters */}
                        <div className="p-6 border-b border-slate-200 bg-white">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search actions, details or users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                                    />
                                </div>

                                <select
                                    value={selectedModule}
                                    onChange={(e) => setSelectedModule(e.target.value)}
                                    className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
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
                                    className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                                >
                                    <option value="">All Time</option>
                                    <option value="24h">Last 24 Hours</option>
                                    <option value="7d">Last 7 Days</option>
                                    <option value="30d">Last 30 Days</option>
                                </select>
                            </div>

                            {/* Active filters indicator */}
                            {filteredLogs.length !== auditLogs.length && (
                                <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span>Showing {filteredLogs.length} of {auditLogs.length} logs</span>
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedModule("");
                                            setSelectedTimeRange("");
                                        }}
                                        className="ml-2 text-blue-600 hover:text-blue-800 font-medium underline"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Module</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">User</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Details</TableHead>
                                        <TableHead className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-64">
                                                <LoadingSpinner text="Loading audit logs..." />
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredLogs.length > 0 ? (
                                        filteredLogs.map((log) => (
                                            <TableRow key={log.id} className="hover:bg-slate-50 transition-colors group">
                                                <TableCell className="px-6 py-4 text-sm text-slate-500">
                                                    {format(new Date(log.timestamp), 'PPpp')}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-sm font-medium text-slate-900">
                                                    {log.action}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getModuleColor(log.module)}`}>
                                                        {log.module}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-sm text-slate-600 max-w-[150px] truncate" title={log.actorName || (typeof log.user === 'object' && log.user ? log.user.name : String(log.user))}>
                                                    {log.actorName || (typeof log.user === 'object' && log.user ? log.user.name : (log.user || "Unknown"))}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-sm text-slate-600 max-w-[250px] truncate" title={log.details}>
                                                    {log.details}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${log.status === 'Success' ? 'bg-green-100 text-green-800' :
                                                        log.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full ${log.status === 'Success' ? 'bg-green-600' :
                                                            log.status === 'Warning' ? 'bg-amber-600' :
                                                                'bg-red-600'
                                                            }`}></span>
                                                        {log.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleViewDetails(log)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group-hover:bg-blue-50"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <FileText className="h-16 w-16 text-slate-400 mb-4" />
                                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No logs found</h3>
                                                    <p className="text-sm text-slate-500 max-w-md">
                                                        {searchTerm || selectedModule || selectedTimeRange
                                                            ? "Try adjusting your search term or filters to see matching logs."
                                                            : "Audit logs will appear here once system activities are performed."
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </main>
            </div>

            <LogDetailsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                log={selectedLog}
            />
        </div>
    );
}
