"use client";

import VerificationStatusWidget from "@/components/dashboard/VerificationStatusWidget";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertItem from "@/components/dashboard/AlertItem";
import AgentItem from "@/components/dashboard/AgentItem";
import dynamic from "next/dynamic";
// import LocationMap from "@/components/maps/LocationMap";

const LocationMap = dynamic(
    () => import('@/components/maps/LocationMap'),
    {
        ssr: false,
        loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Map...</div>
    }
);

import { useEffect } from "react";
import Link from "next/link";
import {
    Users,
    CheckCircle,
    TrendingUp,
    UserCheck,
    Clock,
    ArrowRight,
} from "lucide-react";
import { useDashboardStatsStore } from "@/store/dashboardStats.store";
import { useAlertStore } from "@/store/alerts.store";
import { useAgentStore } from "@/store/agents.store";
import { useRecoveryTrendStore } from "@/store/recoveryTrend.store";
import { useAuthStore } from "@/store/auth.store";
import {
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Line,
    ComposedChart
} from 'recharts';

export default function OperationalDashboard() {
    // Using modular Zustand stores
    const { dashboardStats, fetchStats } = useDashboardStatsStore();
    const { alerts, fetchAlerts } = useAlertStore();
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
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading dashboard...</p>
                </div>
            </div>
        );
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
    ];

    // Get only the first 3 alerts for display
    const displayAlerts = alerts.slice(0, 3);

    // Get only active agents for display
    const activeAgents = agents.filter(agent => agent.status === "ONLINE" || agent.status === "BUSY").slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {stats.map((stat, i) => (
                    <StatsCard key={i} {...stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recovery Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 min-w-0 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
                    <div className="h-[300px] w-full min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={recoveryTrend}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
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

                {/* Field Agents - Only visible to ADMIN and MANAGER */}
                {(user?.role === "ADMIN" || user?.role === "MANAGER") ? (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col transition-shadow hover:shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-900">Field Agents</h3>
                            <Link href="/agents" className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1 group">
                                View All
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                        <div className="space-y-4 flex-1">
                            {activeAgents.length > 0 ? (
                                activeAgents.map((agent, i) => (
                                    <AgentItem key={i} {...agent} />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                                    <Users className="h-10 w-10 mb-2 opacity-20" />
                                    <p className="text-sm">No active agents</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center gap-3">
                        <div className="bg-white p-3 rounded-full shadow-sm">
                            <Clock className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold">Restricted View</p>
                            <p className="text-sm text-slate-500">Only ADMIN and MANAGER roles can see field agent activity.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Verification Status */}
                <div className="lg:col-span-1">
                    <VerificationStatusWidget />
                </div>

                {/* Skip Trace Hotspots */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 transition-shadow hover:shadow-md flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-slate-900">Skip Trace Hotspots</h3>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Live</span>
                        </div>
                        <Link href="/skip-trace-map" className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors flex items-center gap-1 group">
                            View Map
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="h-[350px] bg-slate-50 rounded-xl relative overflow-hidden mb-6 z-0 border border-slate-100">
                        <LocationMap
                            latitude={17.0448111}
                            longitude={81.8437224}
                            displayName="Diwancheruvu Hotspot"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

