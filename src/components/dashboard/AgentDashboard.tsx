"use client";

import { useEffect } from "react";
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
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
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
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">My Verification Status</h3>
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