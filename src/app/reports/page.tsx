// "use client";

// import React, { useState } from "react";
// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";
// import { useDashboardStore } from "@/store/reoport.store";

// import {
//   TrendingUp,
//   FileText,
//   Users,
//   BarChart2,
//   Calendar,
//   RefreshCcw,
//   Download,
//   ChevronDown,
// } from "lucide-react";

// const Page = () => {
//   const { period, months } = useDashboardStore();
//   const [activeTab, setActiveTab] = useState("Recovery Summary");

//   const tabs = [
//     {
//       title: "Verification Report",
//       desc: "KYC completion rates",
//       icon: <FileText />,
//     },
//     {
//       title: "Agent Performance",
//       desc: "Field agent metrics",
//       icon: <Users />,
//     },
//     {
//       title: "Compliance Report",
//       desc: "Audit trail summary",
//       icon: <BarChart2 />,
//     },
//   ];

//   return (
//     <div className="flex min-h-screen bg-[#f5f7fa]">
//       <Sidebar />
//       <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
//         <Header />

//         <main className="flex-1 overflow-y-auto p-6 text-slate-900">
//           {/* Page Header */}
//           <div className="mb-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
//               <div>
//                 <h1 className="text-3xl font-semibold tracking-tight">
//                   Reports & Analytics
//                 </h1>
//                 <p className="text-sm text-slate-500 mt-1">
//                   Comprehensive performance insights
//                 </p>
//               </div>

//               {/* Buttons */}
//               <div className="flex flex-wrap items-center gap-3">
//                 <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 transition">
//                   <Calendar className="h-4 w-4 text-slate-600" />
//                   <span>{period}</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>

//                 <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 transition">
//                   <RefreshCcw className="h-4 w-4" />
//                   Refresh
//                 </button>

//                 <button className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-700 transition">
//                   <Download className="h-4 w-4" />
//                   Export All
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Tabs */}
//           <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//             {/* Recovery Summary Tab */}
//             <div
//               onClick={() => setActiveTab("Recovery Summary")}
//               className={`cursor-pointer rounded-2xl border px-5 py-6 flex items-center gap-4 shadow-sm transition ${
//                 activeTab === "Recovery Summary"
//                   ? "border-sky-500 bg-sky-600 text-white"
//                   : "border-slate-200 bg-white text-slate-700 hover:shadow-md"
//               }`}
//             >
//               <div
//                 className={`rounded-lg flex items-center justify-center shadow transition ${
//                   activeTab === "Recovery Summary"
//                     ? "bg-white text-sky-600"
//                     : "bg-sky-600 text-white"
//                 }`}
//                 style={{ height: 48, width: 48 }}
//               >
//                 <TrendingUp className="h-6 w-6" />
//               </div>
//               <div>
//                 <p className="text-sm font-semibold">Recovery Summary</p>
//                 <p className="text-xs">
//                   {activeTab === "Recovery Summary"
//                     ? "Monthly recovery statistics"
//                     : ""}
//                 </p>
//               </div>
//             </div>

//             {/* Other Tabs */}
//             {tabs.map((tab) => (
//               <div
//                 key={tab.title}
//                 onClick={() => setActiveTab(tab.title)}
//                 className={`cursor-pointer rounded-2xl border px-5 py-6 flex items-center gap-4 shadow-sm transition ${
//                   activeTab === tab.title
//                     ? "border-sky-500 bg-sky-600 text-white"
//                     : "border-slate-200 bg-white text-slate-700 hover:shadow-md"
//                 }`}
//               >
//                 <div
//                   className={`rounded-lg flex items-center justify-center shadow transition ${
//                     activeTab === tab.title
//                       ? "bg-white text-sky-600"
//                       : "bg-slate-100 text-slate-600"
//                   }`}
//                   style={{ height: 48, width: 48 }}
//                 >
//                   {React.cloneElement(tab.icon, { className: "h-6 w-6" })}
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold">{tab.title}</p>
//                   <p className="text-xs">
//                     {activeTab === tab.title ? tab.desc : ""}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </section>

//           {/* Charts */}
//           <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Recovery Trend */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//               <div className="mb-4 flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-semibold">Recovery Trend</p>
//                   <p className="text-xs text-slate-500">
//                     Monthly recovery vs target (₹ Lakhs)
//                   </p>
//                 </div>
//                 <button className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 transition">
//                   <Download className="h-4 w-4" />
//                   Export
//                 </button>
//               </div>

//               {/* Bar Chart */}
//               <div className="mt-4 flex h-60 items-end gap-5 border-t border-slate-100 pt-4">
//                 {months.map((m) => {
//                   const max = 35;
//                   const recHeight = (m.recovered / max) * 100;
//                   const tgtHeight = (m.target / max) * 100;

//                   return (
//                     <div
//                       key={m.month}
//                       className="flex flex-1 flex-col items-center gap-2 text-xs"
//                     >
//                       <div className="flex w-full items-end justify-center gap-2">
//                         <div
//                           className="w-4 rounded-md bg-sky-600 shadow"
//                           style={{ height: `${recHeight}%` }}
//                         />
//                         <div
//                           className="w-4 rounded-md bg-orange-500 shadow"
//                           style={{ height: `${tgtHeight}%` }}
//                         />
//                       </div>
//                       <span className="text-[11px] text-slate-500 font-medium">
//                         {m.month}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Legend */}
//               <div className="mt-4 flex justify-center gap-6 text-sm">
//                 <div className="flex items-center gap-2">
//                   <span className="h-3 w-3 rounded-sm bg-sky-600"></span>
//                   <span className="text-slate-700">Recovered</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="h-3 w-3 rounded-sm bg-orange-500"></span>
//                   <span className="text-slate-700">Target</span>
//                 </div>
//               </div>
//             </div>

//             {/* Donut Chart */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
//               <div className="mb-4 flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-semibold">Verification Breakdown</p>
//                   <p className="text-xs text-slate-500">By verification type</p>
//                 </div>
//                 <button className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 transition">
//                   <Download className="h-4 w-4" />
//                   Export
//                 </button>
//               </div>

//               <div className="flex flex-col items-center">
//                 {/* Donut Placeholder */}
//                 <div className="h-44 w-44 rounded-full border-[14px] border-transparent border-t-sky-600 border-r-green-600 border-b-orange-500 border-l-purple-500"></div>

//                 {/* Legend */}
//                 <div className="mt-6 flex flex-wrap justify-center gap-5 text-sm">
//                   {[
//                     { color: "bg-sky-600", label: "Aadhaar" },
//                     { color: "bg-green-600", label: "PAN" },
//                     { color: "bg-orange-500", label: "Mobile" },
//                     { color: "bg-purple-600", label: "Bank" },
//                     { color: "bg-pink-500", label: "Employment" },
//                   ].map((item) => (
//                     <div key={item.label} className="flex items-center gap-2">
//                       <span className={`h-3 w-3 rounded-sm ${item.color}`}></span>
//                       <span className="text-slate-700">{item.label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Page;



// ReportsPage.tsx
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
  const { period, months, agentPerformance, reportTypes, totalRecovered, totalVerifications, casesClosed, avgSuccessRate } = useDashboardStore();

  return (
    // Changed overall background color slightly
    <div className="flex min-h-screen bg-gray-50 font-sans">
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
                  className={`rounded-xl border p-5 flex items-center gap-4 shadow-md transition cursor-pointer hover:shadow-lg ${
                    isActive
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
                    Monthly recovery vs target (₹ Lakhs)
                  </CardDescription>
                </div>
                <Button className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              {/* Bar Chart Container */}
              <div className="mt-5 flex h-64 items-end gap-3 md:gap-7 border-t border-slate-100 pt-6">
                {months.map((m) => {
                  const max = 35; // Maximum value for scaling (based on max value in image, 36)
                  const recHeight = (m.recovered / max) * 100;
                  const tgtHeight = (m.target / max) * 100;

                  // Y-axis labels for Recovery Trend chart (Jan, Feb, etc.)
                  // These labels are hardcoded in the original code's store, but we add simulated y-axis marks for better visualization
                  const yAxisMarks = [9, 18, 27, 36]; 

                  return (
                    <div
                      key={m.month}
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
                          Rec: ₹{m.recovered}L
                        </span>
                        <span className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap">
                          Tgt: ₹{m.target}L
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
                })}
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

              {/* Donut - Using a simple component to render the ring */}
              <div className="flex flex-col items-center justify-center">
                {/* Visual Donut Chart using a container and an inner cutout (for a cleaner look than just borders) */}
                <div className="h-64 w-64 flex items-center justify-center">
                    {/* Placeholder for Donut Chart (Simulating the visual from the image) */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* The total circumference is 2 * pi * radius. For simplicity in SVG, we use a fixed size circle. 
                            The percentages are simulated to match the visual breakdown in the image. 
                            Aadhaar (30%), PAN (25%), Mobile (20%), Employment (15%), Bank (10%)
                        */}
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#E2E8F0" strokeWidth="30" />
                        
                        {/* Segments - Simplified simulation with actual colors from the image */}
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#06B6D4" strokeWidth="15" strokeDasharray="90 10" transform="rotate(-90 50 50)" /> {/* Blue/Sky-600 (Aadhaar 30%) */}
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#22C55E" strokeWidth="15" strokeDasharray="90 100 10" transform="rotate(-90 50 50)" /> {/* Green/Emerald-500 (PAN 25%) */}
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#F97316" strokeWidth="15" strokeDasharray="90 100 70 10" transform="rotate(-90 50 50)" /> {/* Orange/Orange-500 (Mobile 20%) */}
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#EC4899" strokeWidth="15" strokeDasharray="90 100 70 45 10" transform="rotate(-90 50 50)" /> {/* Pink/Pink-500 (Employment 15%) */}
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" strokeWidth="15" strokeDasharray="90 100 70 45 30 10" transform="rotate(-90 50 50)" /> {/* Purple/Violet-600 (Bank 10%) */}
                        
                        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold fill-slate-800">1,259</text>
                        <text x="50" y="60" textAnchor="middle" dominantBaseline="middle" className="text-xs fill-slate-500">Total</text>

                    </svg>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium">
                  {[
                    { c: "bg-sky-600", label: "Aadhaar" },
                    { c: "bg-green-600", label: "PAN" },
                    { c: "bg-orange-500", label: "Mobile" },
                    { c: "bg-purple-600", label: "Bank" },
                    { c: "bg-pink-500", label: "Employment" },
                  ].map((i) => (
                    <div key={i.label} className="flex items-center gap-2 text-slate-700">
                      <span className={`h-3 w-3 rounded-sm ${i.c}`}></span>
                      {i.label}
                    </div>
                  ))}
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
                  {agentPerformance.map((agent, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A73E8] to-[#0D47A1] flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {agent.name.split(' ')[0][0]}{agent.name.split(' ')[1]?.[0] || ''}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{agent.name}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span>{agent.completed} cases</span>
                          <span>{agent.success} successful</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-6">
                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              agent.rate >= 85 ? 'bg-[#0F9D58]' :
                              agent.rate >= 75 ? 'bg-[#F57C00]' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${agent.rate}%` }}
                          />
                        </div>
                        <div className="w-16 text-right">
                            <p className={`text-xl font-bold ${
                              agent.rate >= 85 ? 'text-[#0F9D58]' :
                              agent.rate >= 75 ? 'text-[#F57C00]' :
                              'text-red-500'
                            }`}>
                              {agent.rate}%
                            </p>
                            <p className="text-xs text-slate-500">Success Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats (Below Agent Card, aligned in 4 columns) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                  <CardContent className="p-6 text-center">
                    {/* Changed font size and color to match the image precisely */}
                    <p className="text-3xl font-extrabold text-slate-800">₹1.2Cr</p>
                    <p className="text-sm text-slate-500 mt-1">Total Recovered</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-extrabold text-slate-800">{totalVerifications.toLocaleString()}</p>
                    <p className="text-sm text-slate-500 mt-1">Verifications</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg hover:shadow-xl transition col-span-1">
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-extrabold text-slate-800">{casesClosed}</p>
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