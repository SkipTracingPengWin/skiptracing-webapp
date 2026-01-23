import React from 'react';

// Alert Item Component
// Alert Item Component
export default function AlertItem({ title, message, type, action }: any) {
    const colors = {
        warning: "border-l-orange-500 bg-orange-50",
        danger: "border-l-red-500 bg-red-50",
        info: "border-l-blue-500 bg-blue-50",
        success: "border-l-green-500 bg-green-50"
    };

    return (
        <div className={`border-l-4 ${colors[type as keyof typeof colors] || colors.info} p-4 rounded-r-lg mb-3`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm mb-1">{title}</div>
                    <div className="text-xs text-slate-600">{message}</div>
                </div>
                {action && <button className="text-blue-600 text-xs font-medium hover:underline">{action}</button>}
            </div>
        </div>
    );
}
