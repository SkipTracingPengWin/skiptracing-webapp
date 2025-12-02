"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Shield,
    MapPin,
    UserCircle,
    Activity,
    FileText,
    BarChart3,
    Settings,
    LogOut
} from "lucide-react";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "Borrowers", href: "/borrowers" },
    { icon: Shield, label: "Verifications", href: "/verifications" },
    { icon: Activity, label: "Assignments", href: "/assignments" },
    { icon: MapPin, label: "Skip Trace Map", href: "/skip-trace-map" },
    { icon: UserCircle, label: "Agents", href: "/agents" },
    { icon: Activity, label: "Recovery Actions", href: "/recovery-actions" },
    { icon: FileText, label: "Compliance Logs", href: "/audit-logs" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0">
            {/* Logo */}
            <div className="p-4 border-b border-slate-200">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">SkipTrace<span className="text-blue-600">AI</span></span>
                </Link>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-200">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
