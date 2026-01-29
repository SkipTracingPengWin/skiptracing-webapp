"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
    MoreVertical,
    ExternalLink,
    Edit2,
    Trash2,
    FileText,
    Banknote,
    MapPin,
    UserCircle,
    ArrowRightLeft
} from "lucide-react";

interface CaseItemProps {
    assignment: any;
    onEdit: (a: any) => void;
    onDelete: (id: string | number) => void;
}

export default function CaseItem({ assignment, onEdit, onDelete }: CaseItemProps) {
    const [showActions, setShowActions] = useState(false);
    const router = useRouter();
    const { user } = useAuthStore();

    const riskColors: Record<string, string> = {
        high: "bg-red-50 text-red-700 border-red-100",
        medium: "bg-orange-50 text-orange-700 border-orange-100",
        low: "bg-green-50 text-green-700 border-green-100",
        critical: "bg-red-600 text-white border-red-600",
    };

    const statusColors: Record<string, string> = {
        OPEN: "bg-blue-50 text-blue-700 border-blue-100",
        IN_PROGRESS: "bg-purple-50 text-purple-700 border-purple-100",
        CLOSED: "bg-slate-100 text-slate-700 border-slate-200",
        PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    };

    const priority = assignment.priority?.toLowerCase() || "medium";
    const isAssigned = !!assignment.agentName;

    return (
        <Card className="group hover:shadow-lg transition-all duration-200 border-slate-200 bg-white overflow-hidden flex flex-col">
            {/* HEADER: Name, Priority, Menu - REDUCED PADDING */}
            <CardHeader className="flex flex-row items-center justify-between p-3 pb-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate max-w-[200px]" title={assignment.borrowerName}>
                        {assignment.borrowerName}
                    </h3>
                    <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${riskColors[priority]}`}>
                            {assignment.priority || 'Medium'}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${statusColors[assignment.status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                            {(assignment.status || 'OPEN').replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-1 hover:bg-slate-100 rounded-md transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </button>

                    {showActions && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowActions(false)}></div>
                            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button
                                    onClick={() => { router.push(`/borrowerprofile?id=${assignment.borrowerId}`); setShowActions(false); }}
                                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <ExternalLink className="h-3 w-3" /> View Profile
                                </button>
                                {user?.role?.toLowerCase() !== "agent" && (
                                    <>
                                        <div className="h-px bg-slate-100 my-1 mx-2"></div>
                                        <button
                                            onClick={() => { onEdit(assignment); setShowActions(false); }}
                                            className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                            <Edit2 className="h-3 w-3 text-blue-500" /> Edit Case
                                        </button>
                                        <button
                                            onClick={() => { onDelete(assignment.id); setShowActions(false); }}
                                            className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 className="h-3 w-3" /> Delete Case
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </CardHeader>

            {/* BODY: Metrics Grid - COMPACT ROW LAYOUT */}
            <CardContent className="p-3">
                <div className="grid grid-cols-3 gap-2">
                    {/* Loan ID */}
                    <div className="flex flex-col justify-center px-2 py-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Loan ID
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate">{assignment.loanId}</span>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col justify-center px-2 py-1.5 rounded bg-emerald-50/40 border border-emerald-100/50">
                        <span className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider flex items-center gap-1">
                            <Banknote className="h-3 w-3" /> Amount
                        </span>
                        <span className="text-sm font-bold text-emerald-700 truncate">
                            ₹{new Number(assignment.amount).toLocaleString()}
                        </span>
                    </div>

                    {/* Address */}
                    <div className="flex flex-col justify-center px-2 py-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Address
                        </span>
                        <span className="text-xs font-semibold text-slate-700 truncate" title={assignment.address}>
                            {assignment.address || "N/A"}
                        </span>
                    </div>
                </div>
            </CardContent>

            {/* FOOTER: Agent & Actions - COMPACT HEIGHT */}
            <CardFooter className="mt-auto p-2.5 px-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                {/* Agent Info Area */}
                <div className="flex-1 min-w-0 pr-2">
                    {isAssigned ? (
                        <div className="flex items-center gap-2 group/agent cursor-default">
                            <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm group-hover/agent:border-blue-200 transition-colors">
                                <UserCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] text-slate-400 font-medium">Assigned to</span>
                                <span className="text-xs text-slate-900 font-bold truncate max-w-[120px]">{assignment.agentName}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 opacity-60">
                            <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                                <UserCircle className="h-4 w-4 text-slate-400" />
                            </div>
                            <span className="text-xs text-slate-500 font-semibold italic">Unassigned</span>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div>
                    {isAssigned ? (
                        <button
                            onClick={() => onEdit(assignment)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-[11px] font-bold rounded hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all active:scale-95 group/btn"
                        >
                            <ArrowRightLeft className="h-3 w-3 text-slate-400 group-hover/btn:text-blue-500 transition-colors" />
                            Reassign
                        </button>
                    ) : (
                        <button
                            onClick={() => onEdit(assignment)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded hover:bg-blue-700 shadow-sm hover:shadow-blue-200 transition-all active:scale-95"
                        >
                            Assign
                            <ArrowRightLeft className="h-3 w-3 opacity-70" />
                        </button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
