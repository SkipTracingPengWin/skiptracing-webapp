import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
    color?: string;
}

export default function StatCard({ label, value, color = "text-slate-900" }: StatCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-200 hover:shadow-md group">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-500 transition-colors">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
        </div>
    );
}
