import { X, User, Calendar, Shield, Activity, Monitor, FileText, CheckCircle2, AlertTriangle, XCircle, Copy, Clock, Hash } from "lucide-react";
import { format } from "date-fns";
import type { AuditLog } from "@/types/audit.types";

interface LogDetailsModalProps {
    open: boolean;
    onClose: () => void;
    log: AuditLog | null;
}

export default function LogDetailsModal({ open, onClose, log }: LogDetailsModalProps) {
    if (!open || !log) return null;

    const getStatusConfig = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'success') return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
        if (s === 'warning') return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertTriangle };
        if (s === 'failed') return { color: 'text-rose-700 bg-rose-50 border-rose-200', icon: XCircle };
        return { color: 'text-slate-700 bg-slate-50 border-slate-200', icon: Activity };
    };

    const StatusIcon = getStatusConfig(log.status).icon;
    const statusColor = getStatusConfig(log.status).color;

    // Safe User Data Extraction
    const userName = (typeof log.user === 'object' && log.user) ? log.user.name : (log.user || "Unknown User");
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-start justify-between bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${statusColor}`}>
                            <StatusIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 leading-tight">Audit Details</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                    ID: {log.id}
                                </span>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                                    {log.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8 bg-white">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column: Actor & Meta */}
                        <div className="space-y-6">
                            {/* Actor Card */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <User className="h-3 w-3" />
                                    Actor Profile
                                </h3>
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white">
                                        {userInitial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 text-lg truncate">{userName}</div>
                                        <div className="text-sm text-slate-500 flex items-center gap-1.5">
                                            <Shield className="h-3 w-3" />
                                            System Administrator
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* System Context */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Monitor className="h-3 w-3" />
                                    System Context
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-sm text-slate-500">Module</span>
                                        <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                                            {log.module}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-sm text-slate-500">Action Type</span>
                                        <span className="font-mono text-sm text-blue-600 font-medium">
                                            {log.action}
                                        </span>
                                    </div>
                                    {log.ipAddress && (
                                        <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                            <span className="text-sm text-slate-500">IP Address</span>
                                            <span className="font-mono text-sm text-slate-600">
                                                {log.ipAddress}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right Column: Time & Details */}
                        <div className="space-y-6 flex flex-col">
                            <section>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    Timestamp
                                </h3>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="text-2xl font-bold text-slate-900">
                                        {format(new Date(log.timestamp), "HH:mm:ss")}
                                    </div>
                                    <div className="text-sm font-medium text-slate-500">
                                        {format(new Date(log.timestamp), "EEEE, MMMM d, yyyy")}
                                    </div>
                                </div>
                            </section>

                            <section className="flex-1 flex flex-col">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Hash className="h-3 w-3" />
                                    Event Data
                                </h3>
                                <div className="flex-1 bg-slate-900 rounded-xl p-4 overflow-hidden shadow-inner flex flex-col relative group">
                                    <pre className="text-slate-300 text-sm font-mono whitespace-pre-wrap break-words overflow-y-auto custom-scrollbar flex-1">
                                        {log.details}
                                    </pre>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold text-sm transition-all shadow-sm hover:shadow active:scale-95"
                    >
                        Close Details
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-semibold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}