import React from 'react';

// Stats Card Component
export default function StatsCard({ icon: Icon, label, value, trend, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="text-sm text-slate-600 mb-2">{label}</div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
                    {trend && (
                        <div className="text-xs text-green-600 font-medium">{trend}</div>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
}
