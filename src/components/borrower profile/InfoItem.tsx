import React from 'react';

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined | null;
    extra?: string;
}

export const InfoItem = ({ icon, label, value, extra }: InfoItemProps) => (
    <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="font-semibold text-slate-900 truncate">{value || "N/A"}</p>
            {extra && <p className="text-sm text-slate-500 mt-1">{extra}</p>}
        </div>
    </div>
);
