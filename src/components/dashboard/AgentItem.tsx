import React from 'react';
import { MapPin } from "lucide-react";

// Agent Item Component
export default function AgentItem({ name, location, cases, status }: any) {
    return (
        <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{name.split(' ').map((n: string) => n[0]).join('')}</span>
                </div>
                <div>
                    <div className="font-semibold text-sm text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{cases} cases</div>
                <div className={`text-xs ${status === 'ONLINE' ? 'text-green-600' : 'text-orange-600'}`}>
                    <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1 ${status === 'ONLINE' ? 'bg-green-600' : 'bg-orange-600'}`}></span>
                    {status}
                </div>
            </div>
        </div>
    );
}
