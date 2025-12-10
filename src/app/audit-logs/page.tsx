"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { FileText, CheckCircle, Database, Download, FileDown } from "lucide-react";

export default function AuditLogsPage() {
    const stats = [
        { icon: FileText, label: "Total Logs", value: "0", color: "bg-slate-500" },
        { icon: CheckCircle, label: "Verifications", value: "0", color: "bg-green-500" },
        { icon: Database, label: "Data Changes", value: "0", color: "bg-orange-500" },
        { icon: Download, label: "Exports", value: "0", color: "bg-blue-500" },
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
                                <p className="text-sm text-slate-600 mt-1">RBI-compliant immutable audit trail</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm font-medium">Export CSV</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <FileDown className="h-4 w-4" />
                                    <span className="text-sm font-medium">Export PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                                    <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                    <div className="text-3xl font-bold" style={{ color: stat.color.replace('bg-', '').replace('500', '600') }}>
                                        {stat.value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Filters and Table */}
                    <div className="bg-white rounded-xl border border-slate-200">
                        {/* Filters */}
                        <div className="p-6 border-b border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                                <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                    <option>All Categories</option>
                                    <option>Authentication</option>
                                    <option>Data Access</option>
                                    <option>Modifications</option>
                                    <option>Exports</option>
                                </select>
                                <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                    <option>All Entities</option>
                                    <option>Borrowers</option>
                                    <option>Agents</option>
                                    <option>Verifications</option>
                                    <option>Assignments</option>
                                </select>
                                <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                    <option>All Time</option>
                                    <option>Last 24 Hours</option>
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Custom Range</option>
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Entity</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Performed By</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">IP Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="h-16 w-16 text-slate-300 mb-4" />
                                                <p className="text-slate-600 font-medium mb-1">No logs found</p>
                                                <p className="text-sm text-slate-500">Audit logs will appear here once actions are performed</p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
