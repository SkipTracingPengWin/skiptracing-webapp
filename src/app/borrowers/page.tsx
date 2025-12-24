"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useAuthStore } from "@/store/auth.store";
import AddBorrowerModal from "@/components/borrowers/AddBorrowerModal";
import ActionMenu from "@/components/borrowers/Boroweractionmodal";
import { RiskBadge, StatusBadge, VerificationStatus } from "@/components/borrowers/badges";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function BorrowersPage() {
    const { borrowers, deleteBorrower, fetchBorrowers } = useBorrowerStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBorrowerId, setEditingBorrowerId] = useState<string | number | undefined>(undefined);

    useEffect(() => {
        fetchBorrowers();
    }, [fetchBorrowers]);

    // ----------------------
    // ACTION MENU STATE
    // ----------------------
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedBorrower, setSelectedBorrower] = useState<string | number | null>(null);

    const openMenu = (event: React.MouseEvent, borrowerId: string | number) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

        setMenuPosition({
            top: rect.top, // Align with top for better visibility if "under" felt wrong
            left: rect.left - 170, // Shift left more to avoid overlap with icon
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
        // Prefer explicit id if provided by caller, otherwise use currently selectedBorrower
        const viewId = id ?? (selectedBorrower ? String(selectedBorrower) : undefined);
        if (viewId) {
            router.push(`/borrowerprofile?id=${viewId}`);
        }
        closeMenu();
    };

    // Handle Edit action
    const handleEdit = () => {
        if (selectedBorrower) {
            setEditingBorrowerId(selectedBorrower);
            setIsModalOpen(true);
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
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingBorrowerId(undefined);
                        }}
                        borrowerId={editingBorrowerId}
                    />

                    {/* TABLE */}
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50 border-b">
                                <TableRow>
                                    <TableHead className="px-6 py-3">Borrower</TableHead>
                                    <TableHead className="px-6 py-3">Loan Details</TableHead>
                                    <TableHead className="px-6 py-3">Outstanding</TableHead>
                                    <TableHead className="px-6 py-3">Status</TableHead>
                                    <TableHead className="px-6 py-3">Risk</TableHead>
                                    <TableHead className="px-6 py-3">Verification</TableHead>
                                    <TableHead className="px-6 py-3">Location</TableHead>
                                    <TableHead className="px-6 py-3 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {borrowers.map((borrower) => (
                                    <TableRow key={borrower.id} className="hover:bg-slate-50">
                                        <TableCell className="px-6 py-4">
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
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold">{borrower.loanId}</div>
                                                <div className="text-xs text-slate-500">{borrower.loanType}</div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <div className="font-semibold">₹{borrower.amount}</div>
                                            <div className="text-xs text-red-600">{borrower.overdue}</div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <StatusBadge status={borrower.status} />
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <RiskBadge risk={borrower.risk} />
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <VerificationStatus verified={borrower.verified} />
                                        </TableCell>

                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <MapPin className="h-4 w-4" />
                                                {borrower.location}
                                            </div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4 text-right">
                                            <button
                                                onClick={(e) => openMenu(e, borrower.id)}
                                                className="p-2 hover:bg-slate-100 rounded-lg"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ACTION MENU - NO HARDCODED profileId */}
                    <ActionMenu
                        isOpen={menuOpen}
                        onClose={closeMenu}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        position={menuPosition}
                        showDelete={user?.role === "ADMIN"}
                    />
                </main>
            </div>
        </div>
    );
}


