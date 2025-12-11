"use client";

import { CheckCircle, XCircle } from "lucide-react";

// ----------------------
// Small Badge Components
// ----------------------

export function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        "in recovery": "bg-orange-100 text-orange-700",
        "active": "bg-green-100 text-green-700",
        "legal": "bg-red-100 text-red-700",
        "settled": "bg-blue-100 text-blue-700",
        "written off": "bg-gray-100 text-gray-700",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[status] || "bg-slate-100 text-slate-700"
            }`}
        >
            {status}
        </span>
    );
}

export function RiskBadge({ risk }: { risk: string }) {
    const colors: Record<string, string> = {
        high: "bg-red-100 text-red-700",
        medium: "bg-orange-100 text-orange-700",
        low: "bg-green-100 text-green-700",
        critical: "bg-red-600 text-white",
    };

    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[risk] || "bg-slate-100 text-slate-700"
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