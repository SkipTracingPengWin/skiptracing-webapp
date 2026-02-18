
"use client";

import React from 'react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
  TrendingUp,
  FileText,
  Users,
  BarChart2,
  Calendar,
  RefreshCcw,
  Download,
  ChevronDown,
} from "lucide-react";
import { useDashboardStore } from '@/store/reoport.store';
import { useRecoveryTrendStore } from '@/store/recoveryTrend.store';
import { useAgentStore } from '@/store/agents.store';
import { useVerificationStore } from '@/store/verifications.store';
import { useAssignmentStore } from '@/store/assignments.store';
import { VerificationType } from '@/types/verification.types';
import { useEffect, useMemo } from 'react';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Map the icon names from the store to the imported Lucide icons
const IconMap = {
  TrendingUp: TrendingUp,
  FileText: FileText,
  Users: Users,
  BarChart2: BarChart2,
};

// --- Updated Placeholder Components for Premium Look ---
type SlotProps = { children?: React.ReactNode; className?: string };

const Card: React.FC<SlotProps> = ({ children, className }) => (
  // Increased border radius and used a more subtle shadow for premium look
  <div className={`rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 ${className || ''}`}>{children}</div>
);

const CardHeader: React.FC<SlotProps> = ({ children }) => <div className="p-6 pb-0">{children}</div>;
const CardTitle: React.FC<SlotProps> = ({ children }) => <p className="text-lg font-semibold text-slate-800">{children}</p>;
const CardDescription: React.FC<SlotProps> = ({ children }) => <p className="text-sm text-slate-500 mt-0.5">{children}</p>;
const CardContent: React.FC<SlotProps> = ({ children, className }) => (
  <div className={`p-6 pt-4 ${className || ''}`}>{children}</div>
);

const Button: React.FC<SlotProps & { variant?: 'outline' | 'primary' }> = ({ children, className }) => (
  <button className={`flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition ${className || ''}`}>{children}</button>
);


const ReportsPage = () => {
  const { period, months, reportTypes, totalRecovered, totalVerifications, casesClosed, avgSuccessRate, loading } = useDashboardStore();
  const { recoveryTrend, fetchTrends, loading: trendLoading } = useRecoveryTrendStore();
  const { agents, fetchAgents, loading: agentsLoading } = useAgentStore();
  const { verifications, fetchVerifications } = useVerificationStore();
  const { assignments, fetchAssignments } = useAssignmentStore();

  useEffect(() => {
    fetchTrends();
    fetchAgents();
    fetchVerifications();
    fetchAssignments();
  }, [fetchTrends, fetchAgents, fetchVerifications, fetchAssignments]);

  // --- Calculate Verification Breakdown ---
  const { verificationBreakdown, totalCount, failedCount } = useMemo(() => {
    const counts = {
      [VerificationType.AADHAAR]: 0,
      [VerificationType.PAN]: 0,
      [VerificationType.BANK]: 0,
      [VerificationType.VOTER]: 0,
      [VerificationType.EMPLOYMENT]: 0,
      [VerificationType.DL]: 0,
      [VerificationType.RC]: 0,
      [VerificationType.PASSPORT]: 0,
      [VerificationType.ADDRESS]: 0,
      [VerificationType.PHONE]: 0,
      [VerificationType.EMAIL]: 0,
      [VerificationType.LIVENESS]: 0,
    };

    let failed = 0;

    verifications.forEach((v) => {
      if (counts[v.type] !== undefined) {
        counts[v.type]++;
      }
      if (v.status === 'FAILED') {
        failed++;
      }
    });

    // Define colors for the chart
    const colors: Record<string, string> = {
      [VerificationType.AADHAAR]: "#06B6D4", // Sky
      [VerificationType.PAN]: "#22C55E",    // Green
      [VerificationType.PHONE]: "#F97316",  // Orange (labeled Mobile in UI)
      [VerificationType.BANK]: "#8B5CF6",   // Purple
      [VerificationType.EMPLOYMENT]: "#EC4899", // Pink
      [VerificationType.VOTER]: "#3B82F6",  // Blue
      // Defaults for others
    };

    const breakdown = Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        name: key,
        value,
        color: colors[key] || "#94A3B8", // Default slate
      }));

    return {
      verificationBreakdown: breakdown,
      totalCount: verifications.length,
      failedCount: failed,
    };
  }, [verifications]);

  // --- Calculate Cases Closed (Dynamic) ---
  const dynamicCasesClosed = useMemo(() => {
    return assignments.filter(a => a.status === 'CLOSED').length;
  }, [assignments]);

  // --- Formatting Helper ---
  const formatAbsoluteCurrency = (val: number) => {
    // Assuming val is in Lakhs
    const absoluteValue = val
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(absoluteValue);
  };

  // --- Calculate Total Recovered (Dynamic) ---
  const formattedTotalRecovered = useMemo(() => {
    const total = recoveryTrend.reduce((sum, item) => sum + (item.recovered || 0), 0);
    return formatAbsoluteCurrency(total);
  }, [recoveryTrend]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner text="Loading reports..." />
      </div>
    );
  }

  return (
    // Changed overall background color slightly
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">

        <Header />


        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 text-slate-900">

          {/* ----------------- PAGE HEADER ----------------- */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-800">
                  Reports & Analytics
                </h1>
                <p className="text-md text-slate-500 mt-1">
                  Comprehensive performance insights across all metrics.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                {/* Date Picker Button - Premium Style */}
                <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-100 transition text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-600" />
                  {period}
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Refresh Button - Premium Style */}
                <button className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-100 transition text-slate-700">
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </button>

                {/* Primary Export Button - Premium Style */}
                <button className="flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-sky-600/50 hover:bg-sky-700 transition">
                  <Download className="h-4 w-4" />
                  Export All
                </button>
              </div>
            </div>
          </div>

          {/* ----------------- TABS (Summary Cards) ----------------- */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {reportTypes.map((tab) => {
              const IconComponent = IconMap[tab.icon as keyof typeof IconMap];
              const isActive = tab.id === 'recovery';

              return (
                <div
                  key={tab.id}
                  className={`rounded-xl border p-5 flex items-center gap-4 shadow-md transition cursor-pointer hover:shadow-lg ${isActive
                    ? "border-sky-500 bg-sky-50"
                    : "border-slate-200 bg-white hover:border-sky-300"
                    }`}
                >
                  <div className="h-11 w-11 rounded-xl bg-sky-100 flex items-center justify-center shadow-inner">
                    {IconComponent && <IconComponent className="h-6 w-6 text-sky-600" />}
                  </div>
                  {/* Content is aligned horizontally with the icon */}
                  <div>
                    <p className={`text-base font-semibold ${isActive ? 'text-sky-700' : 'text-slate-800'}`}>
                      {tab.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {tab.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ----------------- MAIN CHARTS (NOW ON TOP) ----------------- */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* --------------- BAR CHART ---------------- */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Recovery Trend</CardTitle>
                  <CardDescription>
                    Monthly recovery vs target
                  </CardDescription>
                </div>
                <Button className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Bar Chart Container */}
              <div className="mt-5 flex h-64 items-end gap-3 md:gap-7 border-t border-slate-100 pt-6">
                {(() => {
                  const data = recoveryTrend.length > 0 ? recoveryTrend : months;

                  // Calculate dynamic max value for scaling
                  const maxVal = Math.max(...data.flatMap((d: any) => [d.recovered, d.target]), 0);
                  // Round up to nearest 5, or default to 35 if maxVal is low/0
                  const max = maxVal > 0 ? Math.ceil(maxVal / 5) * 5 : 35;

                  // Generate Y-axis marks based on dynamic max
                  const yAxisMarks = [
                    Math.round(max * 0.25),
                    Math.round(max * 0.5),
                    Math.round(max * 0.75),
                    max
                  ];

                  return data.map((m: any, index: number) => {
                    const recHeight = (m.recovered / max) * 100;
                    const tgtHeight = (m.target / max) * 100;

                    // Use id if available, otherwise combine month + index to ensure uniqueness
                    const uniqueKey = m.id || `${m.month}-${index}`;


                    // Y-axis labels for Recovery Trend chart (Jan, Feb, etc.)
                    // These labels are hardcoded in the original code's store, but we add simulated y-axis marks for better visualization

                    return (
                      <div
                        key={uniqueKey}
                        className="flex flex-1 h-full flex-col items-center justify-end gap-2 text-xs group relative"
                      >
                        {/* Simulated Y-Axis Marks (Only showing the marks on the first bar container for alignment) */}
                        {m.month === 'Jan' && (
                          <div className="absolute inset-y-0 left-[-30px] w-[30px] text-[10px] text-slate-500/70">
                            {yAxisMarks.map((mark, index) => (
                              <div
                                key={index}
                                className="absolute right-0 w-full text-right"
                                style={{ bottom: `${(mark / max) * 100}%`, transform: 'translateY(50%)' }}
                              >
                                {mark}
                              </div>
                            ))}
                            {/* 0 mark */}
                            <div className="absolute right-0 w-full text-right bottom-0">0</div>
                          </div>
                        )}

                        {/* Tooltips */}
                        <div className="absolute bottom-full mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                          <span className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap mb-1">
                            Rec: {formatAbsoluteCurrency(m.recovered)}
                          </span>
                          <span className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap">
                            Tgt: {formatAbsoluteCurrency(m.target)}
                          </span>
                        </div>

                        {/* Bar and Bar Container */}
                        <div className="flex flex-1 w-full items-end justify-center gap-2 md:gap-3">
                          {/* Recovered Bar */}
                          <div
                            className="w-4 rounded-t-md bg-sky-600 shadow-md transition-all duration-300 hover:bg-sky-700"
                            style={{ height: `${recHeight}%` }}
                          ></div>
                          {/* Target Bar */}
                          <div
                            className="w-4 rounded-t-md bg-orange-500 shadow-md transition-all duration-300 hover:bg-orange-600"
                            style={{ height: `${tgtHeight}%` }}
                          ></div>
                        </div>

                        <span className="text-[11px] text-slate-600 font-medium">
                          {m.month}
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="mt-5 flex justify-center gap-8 text-sm text-slate-700 font-medium">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-sky-600"></span>
                  Recovered
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-orange-500"></span>
                  Target
                </div>
              </div>
            </Card>

            {/* ---------------- DONUT CHART ---------------- */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <CardTitle>Verification Breakdown</CardTitle>
                  <CardDescription>
                    By verification type
                  </CardDescription>
                </div>
                <Button className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Donut - Using Recharts */}
              <div className="flex flex-col items-center justify-center">
                <div className="h-64 w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={verificationBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {verificationBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-bold text-slate-800">{totalCount.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 font-medium tracking-wide">TOTAL</p>
                    {failedCount > 0 && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1">
                        {failedCount} FAILED
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium">
                  {verificationBreakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-slate-700">
                      <span className={`h-3 w-3 rounded-sm`} style={{ backgroundColor: item.color }}></span>
                      <span className="capitalize">{item.name.toLowerCase()}</span>
                      <span className="text-slate-400 font-normal">({item.value})</span>
                    </div>
                  ))}
                  {verificationBreakdown.length === 0 && (
                    <p className="text-slate-400 font-normal italic">No verification data available</p>
                  )}
                </div>
              </div>
            </Card>
          </section>

          {/* ----------------- AGENT PERFORMANCE & SUMMARY STATS ----------------- */}
          {/* This section follows the Charts (Top Row) */}
          <div className="grid grid-cols-1 gap-6 pb-8">

            {/* Agent Performance Card (Full width) */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Agent Performance</CardTitle>
                    <CardDescription>Top performing field agents</CardDescription>
                  </div>
                  <Button className="gap-1">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {(agents.length > 0 ? agents : []).slice(0, 5).map((agent, i) => {
                    const completed = agent.cases || 0;
                    const rawSuccessRate = agent.successRate || 0;
                    const successRate = Number(rawSuccessRate.toFixed(2));
                    const successCount = Math.round(completed * (successRate / 100));

                    return (
                      <div
                        key={agent.id || i}
                        className="flex items-center justify-between gap-6 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition"
                      >
                        {/* Avatar */}
                        <div className="flex items-center gap-4 min-w-[220px]">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#0D47A1] flex items-center justify-center shadow-sm">
                            <span className="text-white font-medium text-sm">
                              {agent.name.split(' ')[0][0]}
                              {agent.name.split(' ')[1]?.[0] || ''}
                            </span>
                          </div>

                          {/* Name + Stats (HORIZONTAL) */}
                          <div>
                            <p className="font-medium text-slate-900">{agent.name}</p>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                              <span>{completed} cases</span>
                              <span>{successCount} successful</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress + Percentage */}
                        <div className="flex items-center gap-6">
                          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${successRate >= 85
                                ? 'bg-[#0F9D58]'
                                : successRate >= 75
                                  ? 'bg-[#F57C00]'
                                  : 'bg-red-500'
                                }`}
                              style={{ width: `${successRate}%` }}
                            />
                          </div>

                          <div className="w-20 text-right">
                            <p
                              className={`text-lg font-bold ${successRate >= 85
                                ? 'text-[#0F9D58]'
                                : successRate >= 75
                                  ? 'text-[#F57C00]'
                                  : 'text-red-500'
                                }`}
                            >
                              {successRate.toFixed(2)}%
                            </p>
                            <p className="text-xs text-slate-500">Success Rate</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {agents.length === 0 && !agentsLoading && (
                    <div className="text-center py-6 text-slate-500">
                      No agent performance data available.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats (Below Agent Card, aligned in 4 columns) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                <CardContent className="p-6 text-center">
                  {/* Changed font size and color to match the image precisely */}
                  <p className="text-3xl font-extrabold text-slate-800">{formattedTotalRecovered}</p>
                  <p className="text-sm text-slate-500 mt-1">Total Recovered</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-extrabold text-slate-800">{totalCount.toLocaleString()}</p>
                  <p className="text-sm text-slate-500 mt-1">Verifications</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-extrabold text-slate-800">{dynamicCasesClosed}</p>
                  <p className="text-sm text-slate-500 mt-1">Cases Closed</p>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-extrabold text-slate-800">{avgSuccessRate}%</p>
                  <p className="text-sm text-slate-500 mt-1">Avg Success Rate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
// Export the main component  
export default ReportsPage;










