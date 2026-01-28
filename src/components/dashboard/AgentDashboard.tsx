"use client";

import { useEffect } from "react";
import VerificationStatusWidget from "@/components/dashboard/VerificationStatusWidget";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertItem from "@/components/dashboard/AlertItem";

import {
    Users,
    CheckCircle,
    TrendingUp,
    Clock,
    MapPin
} from "lucide-react";
import { useDashboardStatsStore } from "@/store/dashboardStats.store";
import { useAlertStore } from "@/store/alerts.store";
import { useRecoveryTrendStore } from "@/store/recoveryTrend.store";
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





export default function AgentDashboard() {
    const { dashboardStats, fetchStats } = useDashboardStatsStore();
    const { alerts, fetchAlerts } = useAlertStore();
    const { recoveryTrend, fetchTrends } = useRecoveryTrendStore();

    useEffect(() => {
        fetchStats();
        fetchAlerts();
        fetchTrends();
    }, [fetchStats, fetchAlerts, fetchTrends]);

    // Add loading check
    if (!dashboardStats) {
        return <div>Loading dashboard...</div>;
    }

    // Agent-specific stats (removed: Active Agents, SLA Alerts)
    const stats = [
        { icon: Users, label: "Total Borrowers", value: (dashboardStats.totalBorrowers || 0).toString(), trend: "+12% this month", color: "bg-blue-600" },
        { icon: CheckCircle, label: "Verified", value: (dashboardStats.verified || 0).toString(), trend: "+8%", color: "bg-green-600" },
        { icon: TrendingUp, label: "In Recovery", value: (dashboardStats.inRecovery || 0).toString(), trend: null, color: "bg-orange-500" },
        { icon: Clock, label: "Pending Verifications", value: (dashboardStats.pendingVerifications || 0).toString(), trend: null, color: "bg-purple-600" },
    ];

    const displayAlerts = alerts.slice(0, 3);
    return (
        <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                        <h3 className="text-lg font-bold text-slate-900">My Alerts</h3>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">{displayAlerts.length} Alerts</span>
                    </div>
                    <div>
                        {displayAlerts.map((alert, i) => (
                            <AlertItem key={i} {...alert} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Verification Status */}
                <VerificationStatusWidget title="Verification Status"/>

                {/* My Assignments */}
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">My Assignments</h3>
                    <div className="space-y-3">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-slate-900">Active Cases</span>
                                <span className="text-2xl font-bold text-blue-600">12</span>
                            </div>
                            <p className="text-xs text-slate-600">Currently assigned to you</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-slate-900">Completed Today</span>
                                <span className="text-2xl font-bold text-green-600">3</span>
                            </div>
                            <p className="text-xs text-slate-600">Cases resolved today</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-slate-900">Pending Review</span>
                                <span className="text-2xl font-bold text-orange-600">5</span>
                            </div>
                            <p className="text-xs text-slate-600">Awaiting manager approval</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}