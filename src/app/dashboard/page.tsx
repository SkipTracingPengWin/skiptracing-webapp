"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
    Users,
    CheckCircle,
    TrendingUp,
    UserCheck,
    Clock,
    AlertTriangle,
    ArrowRight,
    MapPin
} from "lucide-react";
import { useDashboardStatsStore } from "@/store/dashboardStats.store";
import { useAlertStore } from "@/store/alerts.store";
import { useAgentStore } from "@/store/agents.store";
import { useRecoveryTrendStore } from "@/store/recoveryTrend.store";

// Stats Card Component
function StatsCard({ icon: Icon, label, value, trend, color }: any) {
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

// Alert Item Component
function AlertItem({ title, description, type, action }: any) {
    const colors = {
        warning: "border-l-orange-500 bg-orange-50",
        danger: "border-l-red-500 bg-red-50",
        info: "border-l-blue-500 bg-blue-50"
    };

    return (
        <div className={`border-l-4 ${colors[type as keyof typeof colors]} p-4 rounded-r-lg mb-3`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="font-semibold text-slate-900 text-sm mb-1">{title}</div>
                    <div className="text-xs text-slate-600">{description}</div>
                </div>
                <button className="text-blue-600 text-xs font-medium hover:underline">{action}</button>
            </div>
        </div>
    );
}

// Agent Item Component
function AgentItem({ name, location, cases, status }: any) {
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
                <div className={`text-xs ${status === 'Active' ? 'text-green-600' : 'text-orange-600'}`}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full mr-1 ${status === 'Active' ? 'bg-green-600' : 'bg-orange-600'}"></span>
                    {status}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    // Using modular Zustand stores
    const { dashboardStats } = useDashboardStatsStore();
    const { alerts, markAlertAsRead } = useAlertStore();
    const { agents } = useAgentStore();
    const { recoveryTrend } = useRecoveryTrendStore();

    const stats = [
        { icon: Users, label: "Total Borrowers", value: dashboardStats.totalBorrowers.toString(), trend: "+12% this month", color: "bg-blue-600" },
        { icon: CheckCircle, label: "Verified", value: dashboardStats.verified.toString(), trend: "+8%", color: "bg-green-600" },
        { icon: TrendingUp, label: "In Recovery", value: dashboardStats.inRecovery.toString(), trend: null, color: "bg-orange-500" },
        { icon: UserCheck, label: "Active Agents", value: dashboardStats.activeAgents.toString(), trend: null, color: "bg-blue-500" },
        { icon: Clock, label: "Pending Verifications", value: dashboardStats.pendingVerifications.toString(), trend: null, color: "bg-purple-600" },
        { icon: AlertTriangle, label: "SLA Alerts", value: dashboardStats.slaAlerts.toString(), trend: null, color: "bg-red-500" },
    ];

    // Get only the first 3 alerts for display
    const displayAlerts = alerts.slice(0, 3);

    // Get only active agents for display
    const activeAgents = agents.filter(agent => agent.status === "Active" || agent.status === "Busy").slice(0, 3);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header title="Dashboard" />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <StatsCard key={i} {...stat} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Recovery Trend Chart */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-slate-900">Recovery Trend (₹ Lakhs)</h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                        <span className="text-slate-600">Recovered</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-orange-400"></div>
                                        <span className="text-slate-600">Target</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2">
                                {recoveryTrend.map((data, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg relative" style={{ height: `${(data.recovered / 35) * 100}%` }}>
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700">{data.recovered}</div>
                                        </div>
                                        <div className="text-xs text-slate-500">{data.month}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Alerts */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Active Alerts</h3>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">3 Alerts</span>
                            </div>
                            <div>
                                {displayAlerts.map((alert, i) => (
                                    <AlertItem key={i} {...alert} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Verification Status */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Verification Status</h3>
                            <div className="flex items-center justify-center mb-6">
                                <div className="relative h-40 w-40">
                                    <svg className="transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="175 251" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="75 251" strokeDashoffset="-175" />
                                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="50 251" strokeDashoffset="-250" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-slate-900">8</div>
                                            <div className="text-xs text-slate-500">Total</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        <span className="text-slate-600">Verified</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">6</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                        <span className="text-slate-600">Pending</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">1</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                        <span className="text-slate-600">Failed</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">1</span>
                                </div>
                            </div>
                        </div>

                        {/* Skip Trace Hotspots */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Skip Trace Hotspots</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                    View Map <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="h-48 bg-slate-100 rounded-lg relative overflow-hidden mb-4">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MapPin className="h-12 w-12 text-orange-500 animate-bounce" />
                                </div>
                                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                                    <span className="text-xs font-semibold text-slate-700">Mumbai</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Total Signals</span>
                                <span className="font-semibold text-slate-900">254 cases</span>
                            </div>
                        </div>

                        {/* Field Agents */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900">Field Agents</h3>
                                <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                    View All <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div>
                                {activeAgents.map((agent, i) => (
                                    <AgentItem key={i} {...agent} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
