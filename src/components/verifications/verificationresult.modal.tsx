"use client";

import { X, Shield, CheckCircle, AlertCircle, Calendar, FileText } from "lucide-react";
import { Verification } from "@/types/verification.types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface VerificationResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    verification: Verification | null;
}

export default function VerificationResultModal({ isOpen, onClose, verification }: VerificationResultModalProps) {
    if (!isOpen || !verification) return null;

    const isVerified = verification.status === "VERIFIED";
    const resultData = verification.result || {};

    // Helper to render key-value pairs nicely
    const renderResultData = () => {
        if (!resultData || Object.keys(resultData).length === 0) {
            return <p className="text-slate-500 italic">No detailed result data available.</p>;
        }

        return (
            <div className="space-y-3">
                {Object.entries(resultData).map(([key, value]) => {
                    // Skip internal fields if any
                    if (key === "status" || key === "timestamp") return null;

                    return (
                        <div key={key} className="flex flex-col border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-sm font-medium text-slate-900 break-words">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between p-6 border-b sticky top-0 z-10",
                    isVerified ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                )}>
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm",
                            isVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        )}>
                            {isVerified ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {isVerified ? "Verification Successful" : "Verification Failed"}
                            </h2>
                            <p className="text-xs font-medium mt-0.5 uppercase tracking-wider opacity-80 flex items-center gap-1.5">
                                <Shield className="h-3 w-3" />
                                {verification.type} Check
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-9 w-9 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-slate-500 hover:text-slate-900 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-0 overflow-y-auto custom-scrollbar flex-1">

                    {/* Basic Info */}
                    <div className="p-6 bg-slate-50/50 border-b border-slate-100 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Borrower</p>
                            <p className="text-sm font-bold text-slate-900 mt-0.5">{verification.borrower?.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Requested At</p>
                            <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                {verification.createdAt ? format(new Date(verification.createdAt), "MMM d, yyyy HH:mm") : "-"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Status</p>
                            <div className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold mt-1",
                                isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {isVerified ? "VERIFIED" : "FAILED"}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase">Transaction ID</p>
                            <p className="text-xs font-mono text-slate-600 mt-1 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                                {verification.id.substring(0, 12)}...
                            </p>
                        </div>
                    </div>

                    {/* Detailed Result */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Verification Report</h3>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            {renderResultData()}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
}