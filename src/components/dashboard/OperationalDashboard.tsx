"use client";

import VerificationStatusWidget from "@/components/dashboard/VerificationStatusWidget";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertItem from "@/components/dashboard/AlertItem";
import AgentItem from "@/components/dashboard/AgentItem";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authService } from "@/services/auth";
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
import { useAuthStore } from "@/store/auth.store";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    LineChart,
    ComposedChart
} from 'recharts';







export default function OperationalDashboard() {
    // Using modular Zustand stores
    const { dashboardStats, fetchStats } = useDashboardStatsStore();
    const { alerts, fetchAlerts, markAlertAsRead } = useAlertStore();
    const { agents, fetchAgents } = useAgentStore();
    const { recoveryTrend, fetchTrends } = useRecoveryTrendStore();

    // Use the auth store instead of local state
    const { user } = useAuthStore();

    useEffect(() => {
        if (user) {
            // Always fetch general stats and alerts
            fetchStats();
            fetchAlerts();
            fetchTrends();

            // Only fetch agents if user has permission
            if (user.role === "ADMIN" || user.role === "MANAGER") {
                fetchAgents();
            }
        }
    }, [fetchStats, fetchAlerts, fetchTrends, fetchAgents, user]);

    // Render a loading state if the primary data isn't available yet.
    if (!dashboardStats) {
        return <div>Loading dashboard...</div>; // Or a more sophisticated skeleton loader
    }

    const stats = [
        {
            icon: Users,
            label: "Total Borrowers",
            value: String(dashboardStats?.totalBorrowers ?? 0),
            trend: "+12% this month",
            color: "bg-blue-600",
        },
        {
            icon: CheckCircle,
            label: "Verified",
            value: String(dashboardStats?.verified ?? 0),
            trend: "+8%",
            color: "bg-green-600",
        },
        {
            icon: TrendingUp,
            label: "In Recovery",
            value: String(dashboardStats?.inRecovery ?? 0),
            trend: null,
            color: "bg-orange-500",
        },
        {
            icon: UserCheck,
            label: "Active Agents",
            value: String(dashboardStats?.activeAgents ?? 0),
            trend: null,
            color: "bg-blue-500",
        },
        {
            icon: Clock,
            label: "Pending Verifications",
            value: String(dashboardStats?.pendingVerifications ?? 0),
            trend: null,
            color: "bg-purple-600",
        },

    ]

    // Get only the first 3 alerts for display
    const displayAlerts = alerts.slice(0, 3);

    // Get only active agents for display
    const activeAgents = agents.filter(agent => agent.status === "ONLINE" || agent.status === "BUSY").slice(0, 5);

    return (
        <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Recovery Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 min-w-0">
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
                    <div className="h-64 w-full min-w-0">
                        <ResponsiveContainer width="100%" height={256} minWidth={0}>
                            <ComposedChart
                                data={recoveryTrend}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                                    }}
                                    itemStyle={{ fontSize: '14px', fontWeight: 600 }}
                                    labelStyle={{ color: '#64748b', marginBottom: '8px' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="recovered"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRecovered)"
                                    name="Recovered"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke="#f97316"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={{ stroke: '#f97316', strokeWidth: 2, r: 4, fill: '#fff' }}
                                    name="Target"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
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
                <VerificationStatusWidget />

                {/* Skip Trace Hotspots */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Skip Trace Hotspots</h3>
                        <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                            {/* View Map <ArrowRight className="h-4 w-4" /> */}
                            <Link href="/skip-trace-map" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                View Map <ArrowRight className="h-4 w-4" />
                            </Link>
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

                {/* Field Agents - Only visible to ADMIN and MANAGER */}
                {(user?.role === "ADMIN" || user?.role === "MANAGER") && (
                    <div className="bg-white p-6 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Field Agents</h3>
                            <Link href="/agents" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                                View All <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <div>
                            {activeAgents.map((agent, i) => (
                                <AgentItem key={i} {...agent} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
