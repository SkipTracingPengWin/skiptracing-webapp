"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Users, UserCheck, Clock, UserX, Phone, Mail, MapPin, Star, MoreVertical } from "lucide-react";

// Agent Card Component
function AgentCard({ name, agentId, phone, email, location, status, rating, casesAssigned, casesCompleted, successRate }: any) {
    const statusColors: Record<string, string> = {
        online: "bg-green-500",
        busy: "bg-orange-500",
        offline: "bg-slate-400",
    };

    const statusLabels: Record<string, string> = {
        online: "online",
        busy: "busy",
        offline: "offline",
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                            {name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{name}</h3>
                        <p className="text-sm text-slate-500">{agentId}</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5 text-slate-400" />
                </button>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{location}</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${statusColors[status]}`}></div>
                    <span className="text-sm font-medium text-slate-700 capitalize">{statusLabels[status]}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-slate-900">{rating}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                    <div className="text-xs text-slate-500 mb-1">Cases Assigned</div>
                    <div className="text-lg font-bold text-slate-900">{casesAssigned}</div>
                </div>
                <div>
                    <div className="text-xs text-slate-500 mb-1">Completed</div>
                    <div className="text-lg font-bold text-green-600">{casesCompleted}</div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Success Rate</span>
                    <span className="font-semibold text-blue-600">{successRate}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: successRate }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default function AgentsPage() {
    const stats = [
        { icon: Users, label: "Total Agents", value: "5", color: "bg-blue-500" },
        { icon: UserCheck, label: "Online", value: "3", color: "bg-green-500" },
        { icon: Clock, label: "Busy", value: "1", color: "bg-orange-500" },
        { icon: UserX, label: "Offline", value: "1", color: "bg-slate-400" },
    ];

    const agents = [
        {
            name: "Suresh Kumar",
            agentId: "AGT-001",
            phone: "9876001001",
            email: "suresh.kumar@company.com",
            location: "Mumbai, Thane",
            status: "online",
            rating: "4.5",
            casesAssigned: 8,
            casesCompleted: 45,
            successRate: "84%",
        },
        {
            name: "Priya Sharma",
            agentId: "AGT-002",
            phone: "9876001002",
            email: "priya.sharma@company.com",
            location: "Delhi, Gurgaon",
            status: "online",
            rating: "4.2",
            casesAssigned: 6,
            casesCompleted: 52,
            successRate: "79%",
        },
        {
            name: "Mohan Raj",
            agentId: "AGT-003",
            phone: "9876001003",
            email: "mohan.raj@company.com",
            location: "Bangalore",
            status: "busy",
            rating: "4.8",
            casesAssigned: 10,
            casesCompleted: 38,
            successRate: "92%",
        },
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
                                <h1 className="text-2xl font-bold text-slate-900">Field Agents</h1>
                                <p className="text-sm text-slate-600 mt-1">Manage and track field collection agents</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-medium">Add Agent</span>
                            </button>
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

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                            <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                <option>All Status</option>
                                <option>Online</option>
                                <option>Busy</option>
                                <option>Offline</option>
                            </select>
                        </div>
                    </div>

                    {/* Agent Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map((agent, i) => (
                            <AgentCard key={i} {...agent} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
