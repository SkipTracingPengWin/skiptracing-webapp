"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import VerificationModal from "@/components/verifications/VerificationModal";
import VerificationResultModal from "@/components/verifications/verificationresult.modal";
import { Verification, VerificationType } from "@/types/verification.types";
import { useVerificationStore } from "@/store/verifications.store";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
    CreditCard,
    Smartphone,
    Building2,
    Briefcase,
    FileText,
    Car,
    Phone,
    CheckCircle,
    Clock,
    XCircle,
    ChevronRight,
    Loader2,
    RefreshCcw,
    Search
} from "lucide-react";
import { format } from "date-fns";

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color, loading }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-inner", color)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                    {loading ? (
                        <div className="h-8 w-16 bg-slate-100 rounded animate-pulse mb-1" />
                    ) : (
                        <div className="text-2xl font-bold text-slate-900">{value}</div>
                    )}
                    <div className="text-sm font-medium text-slate-500">{label}</div>
                </div>
            </div>
        </div>
    );
}

// Service Card Component
function ServiceCard({ icon: Icon, title, description, color, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="group bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all text-left relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0">
                <ChevronRight className="h-5 w-5 text-blue-500" />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300", color)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
        </button>
    );
}

export default function VerificationsPage() {
    const [selectedService, setSelectedService] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);

    // Use Store
    const { verifications, loading: isLoading, fetchVerifications, addVerification } = useVerificationStore();

    const services = [
        { icon: CreditCard, title: "Aadhaar Verification", type: VerificationType.AADHAAR, description: "KYC-level Aadhaar validation via UIDAI", color: "bg-blue-500" },
        { icon: CreditCard, title: "PAN Verification", type: VerificationType.PAN, description: "Verify PAN card details via NSDL", color: "bg-indigo-500" },
        { icon: Smartphone, title: "Mobile Verification", type: VerificationType.PHONE, description: "Verify mobile number ownership & status", color: "bg-violet-500" },
        { icon: Building2, title: "Bank Account", type: VerificationType.BANK, description: "Verify bank account holder name & status", color: "bg-emerald-500" },
        // { icon: Video, title: "Video KYC", type: "VIDEO_KYC", description: "Live video-based KYC validation", color: "bg-orange-500" }, // Not in enum yet
        { icon: Briefcase, title: "Employment Check", type: VerificationType.EMPLOYMENT, description: "Verify employment details & income", color: "bg-amber-500" },
        { icon: Car, title: "RC Verification", type: VerificationType.RC, description: "Verify Vehicle Registration Certificate", color: "bg-cyan-500" },
        { icon: Car, title: "Driving License", type: VerificationType.DL, description: "Verify Driving License validity", color: "bg-teal-500" },
        { icon: CheckCircle, title: "Voter ID", type: VerificationType.VOTER, description: "Verify Voter ID EPIC number", color: "bg-rose-500" },
        { icon: FileText, title: "Passport", type: VerificationType.PASSPORT, description: "Verify Passport details", color: "bg-sky-600" },
        { icon: Phone, title: "Phone Contact", type: VerificationType.PHONE, description: "Check phone reachability", color: "bg-purple-500" },
    ];

    useEffect(() => {
        fetchVerifications();
    }, [fetchVerifications]);

    const handleVerificationSubmit = async (data: any) => {
        await addVerification(data);
    };

    // Calculate stats
    const stats = [
        { icon: FileText, label: "Total Requests", value: verifications.length, color: "bg-blue-500" },
        { icon: CheckCircle, label: "Verified", value: verifications.filter(v => v.status === "VERIFIED").length, color: "bg-green-500" },
        { icon: Clock, label: "In Progress", value: verifications.filter(v => v.status === "PENDING" || v.status === "IN_PROGRESS").length, color: "bg-orange-500" },
        { icon: XCircle, label: "Failed", value: verifications.filter(v => v.status === "FAILED").length, color: "bg-red-500" },
    ];

    const filteredVerifications = verifications.filter((v: Verification) => {
        const matchesStatus = filterStatus === "All" ||
            (filterStatus === "Verified" && (v.status === "VERIFIED")) ||
            (filterStatus === "Pending" && (v.status === "PENDING" || v.status === "IN_PROGRESS")) || // Group generated pending
            (filterStatus === "Failed" && v.status === "FAILED");

        const matchesSearch =
            v.borrower?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(v.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.borrowerId.toString().toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const tabs = ["All", "Verified", "Pending", "Failed"];

    // Helper to get status color/badge
    const getStatusBadge = (status: string) => {
        const s = status?.toUpperCase();
        if (s === "VERIFIED") {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold">Verified</span>
                </div>
            );
        } else if (s === "PENDING" || s === "IN_PROGRESS") {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="text-xs font-bold">Processing</span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-100">
                    <XCircle className="h-3.5 w-3.5" />
                    <span className="text-xs font-bold">Failed</span>
                </div>
            );
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">One-Click Verification</h1>
                            <p className="text-sm text-slate-500 mt-1">Instant KYC & fraud detection powered by advanced APIs</p>
                        </div>
                        <button
                            onClick={() => fetchVerifications()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                        >
                            <RefreshCcw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                            Refresh Data
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, i) => (
                            <StatsCard key={i} {...stat} loading={isLoading} />
                        ))}
                    </div>

                    {/* Services Grid */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Start New Verification</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {services.map((service, i) => (
                                <ServiceCard
                                    key={i}
                                    {...service}
                                    onClick={() => setSelectedService(service)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent Verifications Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-white">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                                <h2 className="text-lg font-bold text-slate-900 w-full md:w-auto">Recent Requests</h2>
                                <div className="relative w-full md:w-auto min-w-[300px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, ID or type..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilterStatus(tab)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                            filterStatus === tab
                                                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                                                : "text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Borrower</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Requested At</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading && verifications.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12">
                                                <LoadingSpinner size={32} text="Loading verifications..." />
                                            </td>
                                        </tr>
                                    ) : filteredVerifications.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                No verification records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredVerifications.map((verification) => (
                                            <tr key={verification.id} className="group hover:bg-slate-50/80 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 text-xs font-bold bg-blue-100 text-blue-700 rounded-full flex items-center justify-center shrink-0 uppercase">
                                                            {verification.borrower?.name?.substring(0, 2) || "NA"}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-sm text-slate-900">{verification.borrower?.name || "Unknown"}</div>
                                                            <div className="text-xs text-slate-500 font-mono mt-0.5">{verification.borrower?.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-slate-900 capitalize">{String(verification.type)?.toLowerCase()}</span>
                                                        <span className="text-xs text-slate-500 font-mono">ID: {String(verification.id).substring(0, 8)}...</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600 font-medium whitespace-nowrap">
                                                        {verification.createdAt ? format(new Date(verification.createdAt), "MMM d, yyyy HH:mm") : "-"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(verification.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVerification(verification);
                                                            setShowResultModal(true);
                                                        }}
                                                        className="text-blue-600 text-xs font-bold hover:underline px-3 py-1.5 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-100"
                                                    >
                                                        VIEW REPORT
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <VerificationModal
                    isOpen={!!selectedService}
                    onClose={() => setSelectedService(null)}
                    service={selectedService}
                    onSubmit={handleVerificationSubmit}
                />

                <VerificationResultModal
                    isOpen={showResultModal}
                    onClose={() => {
                        setShowResultModal(false);
                        setSelectedVerification(null);
                    }}
                    verification={selectedVerification}
                />
            </div>
        </div>
    );
}
