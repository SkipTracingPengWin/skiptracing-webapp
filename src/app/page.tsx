"use client";

import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useDashboardStatsStore } from "@/store/dashboardStats.store";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Activity
} from "lucide-react";

export default function DashboardPage() {
  const { dashboardStats, fetchStats } = useDashboardStatsStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    { label: "Total Borrowers", value: dashboardStats?.totalBorrowers || 0, icon: Users, color: "bg-blue-500" },
    { label: "Verified", value: dashboardStats?.verified || 0, icon: CheckCircle, color: "bg-green-500" },
    { label: "In Recovery", value: dashboardStats?.inRecovery || 0, icon: Activity, color: "bg-purple-500" },
    { label: "Pending Verification", value: dashboardStats?.pendingVerifications || 0, icon: Clock, color: "bg-orange-500" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Overview of collection performance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">SLA Alerts</p>
                        <p className="text-2xl font-bold text-slate-900">{dashboardStats?.slaAlerts || 0}</p>
                    </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                        <DollarSign className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Recovered</p>
                        <p className="text-2xl font-bold text-slate-900">{dashboardStats?.totalRecovered || "₹0"}</p>
                    </div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Recovery Rate</p>
                        <p className="text-2xl font-bold text-slate-900">{dashboardStats?.recoveryRate || 0}%</p>
                    </div>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
}