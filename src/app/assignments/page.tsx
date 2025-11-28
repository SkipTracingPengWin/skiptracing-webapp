"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { UserCircle, MapPin } from "lucide-react";

// Agent Workload Component
function AgentWorkload({ name, location, cases }: any) {
    const maxCases = 10;
    const percentage = (cases / maxCases) * 100;

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                        {name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                </div>
                <div>
                    <div className="font-semibold text-sm text-slate-900">{name}</div>
                    <div className="text-xs text-slate-500">{location}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm font-semibold text-slate-900">{cases} cases</div>
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

// Case Item Component
function CaseItem({ borrower, loanId, amount, location, risk, assignedTo, status }: any) {
    const riskColors: Record<string, string> = {
        high: "bg-red-100 text-red-700",
        medium: "bg-orange-100 text-orange-700",
        low: "bg-green-100 text-green-700",
        critical: "bg-red-600 text-white",
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-slate-900">{borrower}</h3>
                    <div className="text-sm text-slate-600 mt-1">
                        {loanId} • {amount}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColors[risk]}`}>
                    {risk}
                </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {assignedTo ? (
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-xs text-green-600 font-medium">{assignedTo}</span>
                    </div>
                ) : (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        Unassigned
                    </span>
                )}
                <button className="text-blue-600 text-xs font-medium hover:underline">
                    {assignedTo ? "Reassign" : "Assign"}
                </button>
            </div>
        </div>
    );
}

export default function AssignmentsPage() {
    const agents = [
        { name: "Suresh Kumar", location: "Pune", cases: 8 },
        { name: "Priya Sharma", location: "Delhi", cases: 6 },
        { name: "Mohan Raj", location: "Delhi", cases: 10 },
        { name: "Anita Patel", location: "Jaipur", cases: 5 },
        { name: "Vikram Singh", location: "Gurgaon", cases: 7 },
    ];

    const cases = [
        { borrower: "Rahul Sharma", loanId: "Loan: LN-2024-001", amount: "₹125,000", location: "Mumbai", risk: "high", assignedTo: null, status: "unassigned" },
        { borrower: "Priya Patel", loanId: "Loan: LN-2024-002", amount: "₹78,000", location: "Mumbai", risk: "medium", assignedTo: "Mohan Raj", status: "assigned" },
        { borrower: "Amit Kumar", loanId: "Loan: LN-2024-003", amount: "₹320,000", location: "Delhi", risk: "critical", assignedTo: null, status: "unassigned" },
        { borrower: "Sunita Devi", loanId: "Loan: LN-2024-004", amount: "₹32,000", location: "Bangalore", risk: "low", assignedTo: null, status: "unassigned" },
        { borrower: "Vikram Singh", loanId: "Loan: LN-2024-005", amount: "₹180,000", location: "Hyderabad", risk: "high", assignedTo: null, status: "unassigned" },
    ];

    const totalCases = cases.length;
    const assigned = cases.filter(c => c.assignedTo).length;
    const unassigned = cases.filter(c => !c.assignedTo).length;
    const activeAgents = agents.length;

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
                                <h1 className="text-2xl font-bold text-slate-900">Agent Assignments</h1>
                                <p className="text-sm text-slate-600 mt-1">Assign borrowers to field agents</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <UserCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Assign Cases</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="text-sm text-slate-600 mb-1">Total Cases</div>
                            <div className="text-3xl font-bold text-slate-900">{totalCases}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="text-sm text-slate-600 mb-1">Assigned</div>
                            <div className="text-3xl font-bold text-green-600">{assigned}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="text-sm text-slate-600 mb-1">Unassigned</div>
                            <div className="text-3xl font-bold text-orange-600">{unassigned}</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <div className="text-sm text-slate-600 mb-1">Active Agents</div>
                            <div className="text-3xl font-bold text-blue-600">{activeAgents}</div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Agent Workload */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Agent Workload</h2>
                            <div className="space-y-2">
                                {agents.map((agent, i) => (
                                    <AgentWorkload key={i} {...agent} />
                                ))}
                            </div>
                        </div>

                        {/* Cases */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Cases</h2>
                                <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                    <option>All Cases</option>
                                    <option>Assigned</option>
                                    <option>Unassigned</option>
                                </select>
                            </div>
                            <div className="space-y-4">
                                {cases.map((caseItem, i) => (
                                    <CaseItem key={i} {...caseItem} />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
