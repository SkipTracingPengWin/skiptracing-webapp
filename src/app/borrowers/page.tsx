"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Download, Upload, Plus, MoreVertical, MapPin, CheckCircle, XCircle } from "lucide-react";
import { useBorrowerStore } from "@/store/borrowers.store";

import AddBorrowerModal from "@/components/borrowers/AddBorrowerModal";
import { useState } from "react";

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        "in recovery": "bg-orange-100 text-orange-700",
        "active": "bg-green-100 text-green-700",
        "legal": "bg-red-100 text-red-700",
        "settled": "bg-blue-100 text-blue-700",
        "written off": "bg-gray-100 text-gray-700",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-slate-100 text-slate-700"}`}>
            {status}
        </span>
    );
}

// Risk Badge Component
function RiskBadge({ risk }: { risk: string }) {
    const colors: Record<string, string> = {
        "high": "bg-red-100 text-red-700",
        "medium": "bg-orange-100 text-orange-700",
        "low": "bg-green-100 text-green-700",
        "critical": "bg-red-600 text-white",
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk] || "bg-slate-100 text-slate-700"}`}>
            {risk}
        </span>
    );
}

// Verification Status Component
function VerificationStatus({ verified }: { verified: boolean }) {
    return verified ? (
        <div className="flex items-center gap-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Verified</span>
        </div>
    ) : (
        <div className="flex items-center gap-1 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Failed</span>
        </div>
    );
}

export default function BorrowersPage() {
    // Using modular Zustand store
    const { borrowers, updateBorrower, deleteBorrower } = useBorrowerStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusChange = (id: number, newStatus: string) => {
        updateBorrower(id, {
            status: newStatus as any,
            updatedAt: new Date().toISOString().split('T')[0]
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this borrower?')) {
            deleteBorrower(id);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Borrower Management</h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Manage and track all borrower cases • Total: {borrowers.length}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm font-medium">Import</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm font-medium">Export</span>
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm font-medium">Add Borrower</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <AddBorrowerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 w-full">
                                <input
                                    type="text"
                                    placeholder="Search by name, phone, or loan ID..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                            <select className="w-full md:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                <option>All Status</option>
                                <option>In Recovery</option>
                                <option>Active</option>
                                <option>Legal</option>
                            </select>
                            <select className="w-full md:w-auto px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                <option>All Risk Levels</option>
                                <option>Critical</option>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Borrower</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Loan Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Outstanding</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Verification</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {borrowers.map((borrower) => (
                                        <tr key={borrower.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {borrower.name.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm text-slate-900">{borrower.name}</div>
                                                        <div className="text-xs text-slate-500">{borrower.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-sm text-slate-900">{borrower.loanId}</div>
                                                    <div className="text-xs text-slate-500">{borrower.loanType}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-sm text-slate-900">{borrower.amount}</div>
                                                    <div className="text-xs text-red-600">{borrower.overdue}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={borrower.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <RiskBadge risk={borrower.risk} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <VerificationStatus verified={borrower.verified} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-slate-600">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">{borrower.location}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                    <MoreVertical className="h-4 w-4 text-slate-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
