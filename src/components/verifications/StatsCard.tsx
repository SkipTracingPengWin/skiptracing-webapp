import React from 'react';
import { cn } from "@/lib/utils";

interface StatsCardProps {
    icon: React.ElementType;
    label: string;
    value: number | string;
    color: string;
    loading: boolean;
}

export default function StatsCard({ icon: Icon, label, value, color, loading }: StatsCardProps) {
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
