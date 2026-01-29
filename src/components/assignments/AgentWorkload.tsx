import React from 'react';

interface AgentWorkloadProps {
    name: string;
    address: string;
    cases: number;
}

export default function AgentWorkload({ name, address, cases }: AgentWorkloadProps) {
    const maxCases = 10;
    const percentage = Math.min((cases / maxCases) * 100, 100);

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                        {name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                </div>
                <div>
                    <div className="font-semibold text-sm text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500">{address}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{cases} cases</div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
