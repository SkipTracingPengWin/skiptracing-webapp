"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { MapPin, Download, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function SkipTraceMapPage() {
    const stats = [
        { icon: Users, label: "Top Cities", value: "4", color: "bg-blue-500" },
        { icon: TrendingUp, label: "High Priority", value: "2", color: "bg-green-500" },
        { icon: AlertCircle, label: "Crime Risk", value: "1", color: "bg-red-500" },
        { icon: MapPin, label: "Avg Traced by", value: "83%", color: "bg-orange-500" },
    ];

    const hotspots = [
        { city: "Mumbai", count: 124, percentage: 30 },
        { city: "Delhi", count: 101, percentage: 25 },
        { city: "Bangalore", count: 86, percentage: 21 },
        { city: "Chennai", count: 56, percentage: 14 },
        { city: "Hyderabad", count: 42, percentage: 10 },
    ];

    const candidates = [
        { name: "Rahul Sharma", loanId: "LN-2024-001", amount: "₹125,000", probability: "92%", location: "Lokre" },
        { name: "Priya Patel", loanId: "LN-2024-002", amount: "₹78,000", probability: "78%", location: "Lokre" },
        { name: "Amit Kumar", loanId: "LN-2024-003", amount: "₹320,000", probability: "85%", location: "Lokre" },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Skip Trace Map</h1>
                                <p className="text-sm text-slate-600 mt-1">Visualize skip-trace probability heatmap</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                    <span className="text-sm font-medium">Learn</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    <Download className="h-4 w-4" />
                                    <span className="text-sm font-medium">Generate Report</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                            <Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                            <div className="text-sm text-slate-600">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Filters Sidebar */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Filters</h2>

                            <div className="space-y-4">
                                {/* Search */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Search</label>
                                    <input
                                        type="text"
                                        placeholder="LN-2024-001 (Rahul)..."
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>

                                {/* Risk Level */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Risk Level</label>
                                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                        <option>All Levels</option>
                                        <option>Critical</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>

                                {/* Map Probability */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Map Probability</label>
                                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                                        <span>0%</span>
                                        <span className="text-orange-600 font-semibold">30%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        defaultValue="30"
                                        className="w-full"
                                    />
                                </div>

                                {/* Hotspots */}
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Hotspots</label>
                                    <div className="space-y-2">
                                        {hotspots.map((hotspot, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-orange-500" />
                                                    <span className="text-sm text-slate-700">{hotspot.city}</span>
                                                </div>
                                                <span className="text-xs font-semibold text-orange-600">{hotspot.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map and Candidates */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Map */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="h-96 bg-slate-100 rounded-lg relative overflow-hidden mb-4">
                                    {/* Placeholder for map */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <MapPin className="h-16 w-16 text-orange-500 mx-auto mb-2" />
                                            <p className="text-slate-600 font-medium">Interactive Map View</p>
                                            <p className="text-sm text-slate-500">Skip trace locations and hotspots</p>
                                        </div>
                                    </div>

                                    {/* Map markers simulation */}
                                    <div className="absolute top-1/4 left-1/3">
                                        <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 right-1/3">
                                        <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-1/3 left-1/2">
                                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                            <MapPin className="h-5 w-5 text-white" />
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                                        <div className="text-xs font-semibold text-slate-700 mb-2">Legend</div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                                <span className="text-xs text-slate-600">Untraced</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                <span className="text-xs text-slate-600">Borrowed</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                                <span className="text-xs text-slate-600">Reject</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Candidate Addresses */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Candidate Addresses</h2>
                                <div className="space-y-3">
                                    {candidates.map((candidate, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">{i + 1}</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{candidate.name}</div>
                                                    <div className="text-sm text-slate-600">{candidate.loanId} • {candidate.amount}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold text-orange-600">{candidate.probability}</div>
                                                <div className="text-xs text-slate-500">probability</div>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-600">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">{candidate.location}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
