"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
    Download,
    Upload,
    Plus,
    MoreVertical,
    MapPin,
    Search,
    ChevronDown,
    X
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

    // ----------------------
    // FILTER STATE
    // ----------------------
    const [searchQuery, setSearchQuery] = useState("");
    const [riskFilter, setRiskFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchBorrowers();
    }, [fetchBorrowers]);

    // ----------------------
    // FILTERING LOGIC
    // ----------------------
    const filteredBorrowers = useMemo(() => {
        return (borrowers || []).filter((borrower) => {
            const name = borrower.name || "";
            const loanId = borrower.loanId || "";
            const location = borrower.location || "";
            const risk = (borrower.risk || "").toUpperCase();
            const status = (borrower.status || "").toLowerCase();

            const matchesSearch =
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRisk = riskFilter === "all" || risk === riskFilter.toUpperCase();
            const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();

            return matchesSearch && matchesRisk && matchesStatus;
        });
    }, [borrowers, searchQuery, riskFilter, statusFilter]);

    // ----------------------
    // ACTION MENU STATE
    // ----------------------
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedBorrower, setSelectedBorrower] = useState<string | number | null>(null);

    const openMenu = (event: React.MouseEvent, borrowerId: string | number) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

        setMenuPosition({
            top: rect.top,
            left: rect.left - 170,
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

    const handleView = (id?: string) => {
        const viewId = id ?? (selectedBorrower ? String(selectedBorrower) : undefined);
        if (viewId) {
            router.push(`/borrowerprofile?id=${viewId}`);
        }
        closeMenu();
    };

    const handleEdit = () => {
        if (selectedBorrower) {
            setEditingBorrowerId(selectedBorrower);
            setIsModalOpen(true);
        }
        closeMenu();
    };

    const clearFilters = () => {
        setSearchQuery("");
        setRiskFilter("all");
        setStatusFilter("all");
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {/* PAGE HEADER */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Borrower Management
                                </h1>
                                <p className="text-sm text-slate-600 mt-1">
                                    Total: {borrowers.length} borrowers
                                </p>
                            </div>

                            {user?.role !== "AGENT" && (
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm">
                                        <Download className="h-4 w-4" />
                                        <span className="hidden sm:inline">Import</span>
                                    </button>

                                    <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg hover:bg-slate-50 text-sm">
                                        <Upload className="h-4 w-4" />
                                        <span className="hidden sm:inline">Export</span>
                                    </button>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:inline">Add Borrower</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FILTER BAR */}
                    <div className="mb-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, loan ID or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Risk Dropdown */}
                        <div className="relative">
                            <select
                                value={riskFilter}
                                onChange={(e) => setRiskFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-sm font-medium text-slate-700"
                            >
                                <option value="all">Risk: All Levels</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-sm font-medium text-slate-700"
                            >
                                <option value="all">Status: All</option>
                                <option value="inactive">Inactive</option>
                                <option value="skipped">Skipped</option>
                                <option value="closed">Closed</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Clear Button */}
                        {(searchQuery || riskFilter !== "all" || statusFilter !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-2"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    <AddBorrowerModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingBorrowerId(undefined);
                        }}
                        borrowerId={editingBorrowerId}
                    />

                    {/* TABLE - Horizontally scrollable on mobile */}
                    <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
                        <Table className="min-w-[900px]">
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
                                {filteredBorrowers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="px-6 py-12 text-center text-slate-500 italic">
                                            No borrowers match your current search and filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBorrowers.map((borrower) => (
                                        <TableRow key={borrower.id} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-blue-600 rounded-full flex justify-center items-center text-white font-bold text-sm">
                                                        {borrower.name
                                                            .split(" ")
                                                            .map((n: string) => n[0])
                                                            .join("")}
                                                    </div>

                                                    <div>
                                                        <div className="font-semibold text-slate-900">{borrower.name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {borrower.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4">
                                                <div>
                                                    <div className="font-semibold text-slate-900">{borrower.loanId}</div>
                                                    <div className="text-xs text-slate-500">{borrower.loanType}</div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4">
                                                <div className="font-semibold text-slate-900">₹{borrower.amount?.toLocaleString('en-IN') || borrower.amount}</div>
                                                <div className="text-xs text-red-600 font-medium">{borrower.overdue} overdue</div>
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
                                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                                    <MapPin className="h-4 w-4 text-slate-400" />
                                                    <span className="truncate max-w-[150px]">{borrower.location}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => openMenu(e, borrower.id)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ACTION MENU */}
                    <ActionMenu
                        isOpen={menuOpen}
                        onClose={closeMenu}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        position={menuPosition}
                        showDelete={user?.role === "ADMIN"}
                        isAgent={user?.role === "AGENT"}
                    />
                </main>
            </div>
        </div>
    );
}
