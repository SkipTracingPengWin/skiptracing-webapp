"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
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
import DeleteBorrowerModal from "@/components/borrowers/DeleteBorrowerModal";
import ActionMenu from "@/components/borrowers/Boroweractionmodal";
import ImportBorrowersModal from "@/components/borrowers/ImportBorrowersModal"; 
import { RiskBadge, StatusBadge, VerificationStatus } from "@/components/borrowers/badges";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function BorrowersPage() {
    const { borrowers, deleteBorrower, fetchBorrowers, loading } = useBorrowerStore();
    const { user } = useAuthStore();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // [NEW]
    const [editingBorrowerId, setEditingBorrowerId] = useState<string | number | undefined>(undefined);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [borrowerToDelete, setBorrowerToDelete] = useState<{ id: string | number; name: string } | null>(null);

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
            const location = borrower.address || "";
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
    // EXPORT LOGIC [NEW]
    // ----------------------
    const handleExport = () => {
        if (borrowers.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["ID", "Name", "Phone", "Email", "Loan ID", "Amount", "Status", "Risk", "Verification", "Address", "Location"];
        const csvContent = [
            headers.join(","),
            ...borrowers.map(b => [
                b.id,
                `"${b.name}"`,
                `"${b.phone}"`,
                `"${b.email || ''}"`,
                b.loanId,
                b.amount,
                b.status,
                b.risk,
                b.verified ? "Yes" : "No",
                `"${b.address || ''}"`,
                `"${b.location || ''}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `borrowers_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Borrowers exported successfully");
    };

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

    const handleDelete = async () => {
        if (selectedBorrower) {
            // Find borrower name for better UX
            const borrower = borrowers.find(b => b.id === selectedBorrower);
            setBorrowerToDelete({
                id: selectedBorrower,
                name: borrower?.name || "this borrower"
            });
            setIsDeleteModalOpen(true);
        }
        closeMenu();
    };

    const confirmDelete = async () => {
        if (!borrowerToDelete) return;

        setIsDeleting(true);
        try {
            await deleteBorrower(borrowerToDelete.id);
            toast.success("Borrower deleted successfully");
            setIsDeleteModalOpen(false);
            setBorrowerToDelete(null);
        } catch (error) {
            console.error("Failed to delete borrower:", error);
            toast.error("Failed to delete borrower");
        } finally {
            setIsDeleting(false);
        }
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
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* PAGE HEADER */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                                    Borrower Management
                                </h1>
                                <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                                    Total: <span className="font-semibold text-slate-900">{borrowers.length}</span> borrowers
                                </p>
                            </div>

                            {user?.role !== "AGENT" && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* SEPARATE IMPORT/EXPORT BUTTONS [MODIFIED] */}
                                    <button
                                        onClick={() => setIsImportModalOpen(true)}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition-all shadow-sm hover:shadow text-sm font-bold active:scale-[0.98]"
                                    >
                                        <Download className="h-4 w-4 text-blue-600" />
                                        <span>Import</span>
                                    </button>

                                    <button
                                        onClick={handleExport}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl transition-all shadow-sm hover:shadow text-sm font-bold active:scale-[0.98]"
                                    >
                                        <Upload className="h-4 w-4 text-blue-600" />
                                        <span>Export</span>
                                    </button>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-sm font-bold shadow-lg shadow-blue-500/20 ml-2"
                                    >
                                        <Plus className="h-5 w-5" />
                                        <span>Add Borrower</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FILTER BAR */}
                    <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by name, loan ID or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-sm sm:text-base outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Risk Dropdown */}
                                <div className="relative flex-1 sm:w-48">
                                    <select
                                        value={riskFilter}
                                        onChange={(e) => setRiskFilter(e.target.value)}
                                        className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer text-sm font-bold text-slate-700 outline-none"
                                    >
                                        <option value="all">Risk: All Levels</option>
                                        <option value="MEDIUM">Medium Risk</option>
                                        <option value="HIGH">High Risk</option>
                                        <option value="CRITICAL">Critical Risk</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>

                                {/* Status Dropdown */}
                                <div className="relative flex-1 sm:w-48">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer text-sm font-bold text-slate-700 outline-none"
                                    >
                                        <option value="all">Status: All</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="skipped">Skipped</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Clear Button - Desktop */}
                            {(searchQuery || riskFilter !== "all" || statusFilter !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-bold group"
                                >
                                    <X className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Clear Button - Mobile */}
                        {(searchQuery || riskFilter !== "all" || statusFilter !== "all") && (
                            <button
                                onClick={clearFilters}
                                className="lg:hidden w-full py-2.5 text-sm text-blue-600 bg-blue-50 rounded-xl font-bold active:scale-95 transition-all text-center"
                            >
                                Clear All Filters
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

                    {/* [NEW] IMPORT MODAL */}
                     <ImportBorrowersModal
                        isOpen={isImportModalOpen}
                        onClose={() => setIsImportModalOpen(false)}
                    /> 
                    <DeleteBorrowerModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setBorrowerToDelete(null);
                        }}
                        onConfirm={confirmDelete}
                        borrowerName={borrowerToDelete?.name}
                        isDeleting={isDeleting}
                    />

                    {/* CONTENT AREA */}
                    {loading ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex items-center justify-center min-h-[400px]">
                            <LoadingSpinner text="Loading borrowers database..." />
                        </div>
                    ) : filteredBorrowers.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <Search className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No borrowers found</h3>
                            <p className="text-slate-500 max-w-sm mt-1">
                                We couldn't find any borrowers matching your current filters. Try adjusting your search or filters.
                            </p>
                            {(searchQuery || riskFilter !== "all" || statusFilter !== "all") && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-6 text-sm font-bold text-blue-600 hover:underline"
                                >
                                    Reset all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View (Visible on small screens) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                                {filteredBorrowers.map((borrower) => (
                                    <div
                                        key={borrower.id}
                                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all"
                                        onClick={() => handleView(String(borrower.id))}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex justify-center items-center text-white font-bold text-lg shadow-inner">
                                                    {borrower.name
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .slice(0, 2)
                                                        .join("")}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 leading-tight">{borrower.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{borrower.phone}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openMenu(e, borrower.id);
                                                }}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Loan ID</p>
                                                <p className="text-sm font-semibold text-slate-900">{borrower.loanId}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Amount</p>
                                                <p className="text-sm font-bold text-slate-900">₹{borrower.amount?.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                                            <StatusBadge status={borrower.status} />
                                            <RiskBadge risk={borrower.risk} />
                                            <VerificationStatus verified={borrower.verified} />
                                        </div>

                                        <div className="mt-4 flex items-center gap-1.5 text-slate-500 text-xs bg-slate-50 p-2 rounded-lg">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="truncate">{borrower.address}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View (Visible on large screens) */}
                            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 border-b border-slate-200">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Borrower</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Loan Details</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Outstanding</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Status</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Risk</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Verification</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900">Address</TableHead>
                                            <TableHead className="px-6 py-4 font-bold text-slate-900 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredBorrowers.map((borrower) => (
                                            <TableRow
                                                key={borrower.id}
                                                className="group hover:bg-slate-50/80 cursor-pointer transition-all duration-200"
                                                onClick={() => handleView(String(borrower.id))}
                                            >
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border border-blue-200 rounded-xl flex justify-center items-center font-bold text-sm group-hover:scale-110 transition-transform">
                                                            {borrower.name
                                                                .split(" ")
                                                                .map((n: string) => n[0])
                                                                .slice(0, 2)
                                                                .join("")}
                                                        </div>

                                                        <div>
                                                            <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{borrower.name}</div>
                                                            <div className="text-xs text-slate-500 font-medium">
                                                                {borrower.phone}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4">
                                                    <div className="space-y-0.5">
                                                        <div className="font-bold text-slate-900">{borrower.loanId}</div>
                                                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{borrower.loanType}</div>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4">
                                                    <div className="font-bold text-slate-900">₹{borrower.amount?.toLocaleString('en-IN')}</div>
                                                    <div className="text-[11px] text-red-600 font-bold uppercase tracking-tight">{borrower.overdue} overdue</div>
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
                                                    <div className="flex items-center gap-1.5 text-slate-600 text-sm max-w-[180px]">
                                                        <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                                        <span className="truncate font-medium">{borrower.address}</span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openMenu(e, borrower.id);
                                                        }}
                                                        className="p-2 hover:bg-white hover:border-slate-200 border border-transparent rounded-xl transition-all text-slate-400 hover:text-slate-900 hover:shadow-sm"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}

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