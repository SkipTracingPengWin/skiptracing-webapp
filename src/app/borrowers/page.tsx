"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

import {
    Download,
    Upload,
    Plus,
    MoreVertical,
    MapPin
} from "lucide-react";

import { useBorrowerStore } from "@/store/borrowers.store";
import AddBorrowerModal from "@/components/borrowers/AddBorrowerModal";
import ActionMenu from "@/components/borrowers/Boroweractionmodal";
import { RiskBadge, StatusBadge, VerificationStatus } from "@/components/borrowers/badges";

export default function BorrowersPage() {
    const { borrowers, deleteBorrower } = useBorrowerStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ----------------------
    // ACTION MENU STATE
    // ----------------------
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedBorrower, setSelectedBorrower] = useState<number | null>(null);

    const openMenu = (event: React.MouseEvent, borrowerId: number) => {
        const rect = (event.target as HTMLElement).getBoundingClientRect();

        setMenuPosition({
            top: rect.bottom + 6,
            left: rect.left - 100,
        });

        setSelectedBorrower(borrowerId);
        setMenuOpen(true);
    };

    const closeMenu = () => setMenuOpen(false);

    const handleDelete = () => {
        if (selectedBorrower && confirm("Are you sure you want to delete?")) {
            deleteBorrower(selectedBorrower);
        }
        closeMenu();
    };

    // Handle View action with selected borrower ID
    const handleView = (id?: string) => {
        if (id) {
            console.log("Viewing borrower:", id);
            // Navigation handled inside ActionMenu component
        }
    };

    // Handle Edit action
    const handleEdit = () => {
        if (selectedBorrower) {
            console.log("Editing borrower:", selectedBorrower);
        }
        closeMenu();
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* PAGE HEADER */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    Borrower Management
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Manage and track all borrower cases • Total:{" "}
                                    {borrowers.length}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50">
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm">Import</span>
                                </button>

                                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm">Export</span>
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Borrower
                                </button>
                            </div>
                        </div>
                    </div>

                    <AddBorrowerModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />

                    {/* TABLE */}
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Borrower</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Loan Details</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Outstanding</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Risk</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Verification</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {borrowers.map((borrower) => (
                                    <tr key={borrower.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-600 rounded-full flex justify-center items-center text-white font-bold">
                                                    {borrower.name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("")}
                                                </div>

                                                <div>
                                                    <div className="font-semibold">{borrower.name}</div>
                                                    <div className="text-xs text-slate-500">
                                                        {borrower.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold">{borrower.loanId}</div>
                                                <div className="text-xs text-slate-500">{borrower.loanType}</div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-semibold">{borrower.amount}</div>
                                            <div className="text-xs text-red-600">{borrower.overdue}</div>
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
                                                {borrower.location}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 relative">
                                            <button
                                                onClick={(e) => openMenu(e, borrower.id)}
                                                className="p-2 hover:bg-slate-100 rounded-lg"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ACTION MENU - NO HARDCODED profileId */}
                    <ActionMenu
                        isOpen={menuOpen}
                        onClose={closeMenu}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        position={menuPosition}
                       
                    />
                </main>
            </div>
        </div>
    );
}

