"use client";

import { useEffect, useMemo } from "react";
import { useVerificationStore } from "@/store/verifications.store";
import { useAuthStore } from "@/store/auth.store";
import { VerificationStatus } from "@/types/verification.types";

interface VerificationStatusWidgetProps {
    title?: string;
    filterByCurrentUser?: boolean;
}

export default function VerificationStatusWidget({
    title = "Verification Status",
    filterByCurrentUser = false
}: VerificationStatusWidgetProps) {
    const { verifications, fetchVerifications, loading } = useVerificationStore();
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchVerifications();
        }
    }, [fetchVerifications, user]);

    const stats = useMemo(() => {
        let relevantVerifications = verifications;

        if (filterByCurrentUser && user) {
            relevantVerifications = verifications.filter(
                (v) => v.requestedBy === user.id || v.verifiedBy === user.id
            );
        }

        const total = relevantVerifications.length;
        const verified = relevantVerifications.filter((v) => v.status === "VERIFIED").length;
        // Group PENDING and IN_PROGRESS as Pending
        const pending = relevantVerifications.filter(
            (v) => v.status === "PENDING" || v.status === "IN_PROGRESS"
        ).length;
        const failed = relevantVerifications.filter((v) => v.status === "FAILED").length;

        return { total, verified, pending, failed };
    }, [verifications, filterByCurrentUser, user]);

    // SVG Circle calculations
    const radius = 40;
    const circumference = 2 * Math.PI * radius; // ~251.327

    // Avoid division by zero
    const totalForCalc = stats.total || 1;

    const verifiedLength = (stats.verified / totalForCalc) * circumference;
    const pendingLength = (stats.pending / totalForCalc) * circumference;
    const failedLength = (stats.failed / totalForCalc) * circumference;

    const verifiedOffset = 0;
    const pendingOffset = -verifiedLength;
    const failedOffset = -(verifiedLength + pendingLength);

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>

            <div className="flex items-center justify-center mb-6">
                <div className="relative h-40 w-40">
                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="12"
                        />

                        {/* Verified Segment (Green) */}
                        {stats.verified > 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="12"
                                strokeDasharray={`${verifiedLength} ${circumference}`}
                                strokeDashoffset={verifiedOffset}
                                strokeLinecap="round"
                            />
                        )}

                        {/* Pending Segment (Blue) */}
                        {stats.pending > 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="12"
                                strokeDasharray={`${pendingLength} ${circumference}`}
                                strokeDashoffset={pendingOffset}
                                strokeLinecap="round"
                            />
                        )}

                        {/* Failed Segment (Orange) */}
                        {stats.failed > 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke="#f59e0b"
                                strokeWidth="12"
                                strokeDasharray={`${failedLength} ${circumference}`}
                                strokeDashoffset={failedOffset}
                                strokeLinecap="round"
                            />
                        )}
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">
                                {loading ? "..." : stats.total}
                            </div>
                            <div className="text-xs text-slate-500">Total</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-slate-600">Verified</span>
                    </div>
                    <span className="font-semibold text-slate-900">{stats.verified}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-600">Pending</span>
                    </div>
                    <span className="font-semibold text-slate-900">{stats.pending}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                        <span className="text-slate-600">Failed</span>
                    </div>
                    <span className="font-semibold text-slate-900">{stats.failed}</span>
                </div>
            </div>
        </div>
    );
}
