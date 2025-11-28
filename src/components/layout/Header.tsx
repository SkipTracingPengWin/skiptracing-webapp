"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

interface HeaderProps {
    title?: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            {/* Title or Search */}
            <div className="flex-1">
                {title ? (
                    <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                ) : (
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search borrowers, agents..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                        />
                    </div>
                )}
            </div>

            {/* Right Side - Notifications & User */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <Bell className="h-5 w-5 text-slate-600" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">VR</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-semibold text-slate-900">Venkat Bezawada</div>
                        <div className="text-xs text-slate-500">Admin</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
            </div>
        </header>
    );
}
