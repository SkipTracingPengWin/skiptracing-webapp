"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { MapPin, Download, Users, TrendingUp, AlertCircle } from "lucide-react";

export default function SkipTraceMapPage() {
    const stats = [
        { icon: Users, label: "Total Borrowers", value: borrowers.length.toString(), color: "bg-blue-500" },
        { icon: TrendingUp, label: "Active Traces", value: "2", color: "bg-green-500" },
        { icon: AlertCircle, label: "High Risk", value: borrowers.filter(b => b.risk === 'high').length.toString(), color: "bg-red-500" },
        { icon: MapPin, label: "Located", value: "12", color: "bg-orange-500" },
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

            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Skip Trace Map</h1>
                                <p className="text-sm text-slate-600 mt-1">Visualize skip-trace probability and locating borrowers</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={fetchBorrowers}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    <span className="text-sm font-medium">Refresh List</span>
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
                        {/* List - Replaces Filters Sidebar for now, or we can combine */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 h-[600px] flex flex-col">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Select Borrower</h2>

                            <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                                {isLoading ? (
                                    <p className="text-center text-slate-500 py-4">Loading borrowers...</p>
                                ) : borrowers.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No borrowers found.</p>
                                ) : (
                                    borrowers.map((b) => (
                                        <div
                                            key={b.id}
                                            onClick={() => handleSelectBorrower(String(b.id), b.name)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedBorrowerId === String(b.id)
                                                ? "bg-blue-50 border-blue-500"
                                                : "border-slate-100 hover:bg-slate-50"
                                                }`}
                                        >
                                            <p className="font-semibold text-slate-900 text-sm">{b.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{b.email || b.phone || "No contact info"}</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <span className="text-xs text-slate-400 truncate">{b.location || "Unknown"}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Map Area */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 h-[600px] flex flex-col">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">
                                    {locationData ? "Location Map" : "Interactive Map"}
                                </h2>
                                <div className="flex-1 bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200">
                                    {isLocating ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                                                <p className="text-slate-600 font-medium">Fetching Coordinates...</p>
                                            </div>
                                        </div>
                                    ) : locationData ? (
                                        <>
                                            <div className="absolute top-0 left-0 right-0 p-2 bg-white/90 z-[1000] border-b text-center text-sm font-medium text-slate-700">
                                                {locationData.display_name}
                                            </div>
                                            <LocationMap
                                                latitude={locationData.lat}
                                                longitude={locationData.lon}
                                                displayName={locationData.display_name}
                                            />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                                            <div>
                                                {errorMsg ? (
                                                    <div className="text-red-500 mb-2 flex flex-col items-center">
                                                        <AlertCircle className="w-10 h-10 mb-2" />
                                                        <p className="font-semibold">{errorMsg}</p>
                                                    </div>
                                                ) : (
                                                    <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-2" />
                                                )}
                                                <p className="text-slate-500">
                                                    {errorMsg ? "Please try another borrower or check the address." : "Select a borrower from the list to view their location."}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
