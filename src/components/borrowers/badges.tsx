"use client";

import { CheckCircle, XCircle } from "lucide-react";

// ----------------------
// Small Badge Components
// ----------------------

export function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        "ACTIVE": "bg-green-100 text-green-700",
        "INACTIVE": "bg-slate-100 text-slate-700",
        "SKIPPED": "bg-purple-100 text-purple-700",
        "CLOSED": "bg-rose-100 text-rose-700",
        // Fallbacks for legacy/lowercase if needed temporarily
        "active": "bg-green-100 text-green-700",
        "inactive": "bg-slate-100 text-slate-700",
        "skipped": "bg-purple-100 text-purple-700",
        "closed": "bg-rose-100 text-rose-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-slate-100 text-slate-700"
                }`}
        >
            {status}
        </span>
    );
}

export function RiskBadge({ risk }: { risk: string }) {
    const colors: Record<string, string> = {
        // Capitalized (backend format)
        High: "bg-red-100 text-red-700",
        Medium: "bg-orange-100 text-orange-700",
        Low: "bg-green-100 text-green-700",
        Critical: "bg-red-600 text-white",
        // Lowercase (fallback)
        high: "bg-red-100 text-red-700",
        medium: "bg-orange-100 text-orange-700",
        low: "bg-green-100 text-green-700",
        critical: "bg-red-600 text-white",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${colors[risk] || "bg-slate-100 text-slate-700"
                }`}
        >
            {risk}
        </span>
    );
}

export function VerificationStatus({ verified }: { verified: boolean }) {
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