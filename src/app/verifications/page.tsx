"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
    CreditCard,
    Smartphone,
    Building2,
    Video,
    Briefcase,
    Shield,
    FileText,
    DollarSign,
    Car,
    Phone,
    CheckCircle,
    Clock,
    XCircle,
    ChevronRight
} from "lucide-react";

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <div className="text-2xl font-bold text-slate-900">{value}</div>
                    <div className="text-sm text-slate-600">{label}</div>
                </div>
            </div>
        </div>
    );
}

// Service Card Component
function ServiceCard({ icon: Icon, title, description, color }: any) {
    return (
        <button className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-left group">
            <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
        </button>
    );
}

export default function VerificationsPage() {
    const stats = [
        { icon: FileText, label: "Total", value: "8", color: "bg-blue-500" },
        { icon: CheckCircle, label: "Verified", value: "6", color: "bg-green-500" },
        { icon: Clock, label: "Pending", value: "1", color: "bg-orange-500" },
        { icon: XCircle, label: "Failed", value: "1", color: "bg-red-500" },
    ];

    const services = [
        { icon: CreditCard, title: "Aadhaar Verification", description: "KYC-level Aadhaar validation", color: "bg-blue-500" },
        { icon: CreditCard, title: "PAN Verification", description: "Verify PAN card details", color: "bg-blue-600" },
        { icon: Smartphone, title: "Mobile Verification", description: "Verify mobile number ownership", color: "bg-blue-500" },
        { icon: Building2, title: "Bank Account Verification", description: "Verify bank account details", color: "bg-blue-600" },
        { icon: Video, title: "Video KYC", description: "Live video-based KYC validation", color: "bg-blue-500" },
        { icon: Briefcase, title: "Employment Check", description: "Verify employment details", color: "bg-blue-600" },
        { icon: Shield, title: "AML Screening", description: "AML/KYC screening check", color: "bg-blue-500" },
        { icon: FileText, title: "Credit Bureau Data", description: "CIBIL/Credit bureau report", color: "bg-blue-600" },
        { icon: Shield, title: "Forgery Check", description: "Document forgery detection", color: "bg-blue-500" },
        { icon: Phone, title: "Phone Non-Consent", description: "Check phone consent status", color: "bg-blue-600" },
        { icon: Car, title: "RC/DL Verification", description: "Verify RC/DL driving license", color: "bg-blue-500" },
    ];

    const recentVerifications = [
        { name: "Amit Kumar", type: "mobile", date: "12/26/2025", confidence: "94%", status: "verified" },
        { name: "Priya Sharma", type: "aadhaar", date: "12/25/2025", confidence: "98%", status: "verified" },
        { name: "Rahul Patel", type: "pan", date: "12/24/2025", confidence: "92%", status: "verified" },
        { name: "Sunita Devi", type: "bank", date: "12/23/2025", confidence: "88%", status: "pending" },
        { name: "Vikram Singh", type: "employment", date: "12/22/2025", confidence: "45%", status: "failed" },
    ];

    const tabs = ["All", "Verified", "Pending", "Failed", "Manual Review"];

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Smart Verification</h1>
                        <p className="text-sm text-slate-600 mt-1">Signzy-powered KYC & verification workflows</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <StatsCard key={i} {...stat} />
                        ))}
                    </div>

                    {/* Verification Services */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Verification Services</h2>
                        <p className="text-sm text-slate-600 mb-4">Select a verification type to run</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {services.map((service, i) => (
                                <ServiceCard key={i} {...service} />
                            ))}
                        </div>
                    </div>

                    {/* Recent Verifications */}
                    <div className="bg-white rounded-xl border border-slate-200">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900">Recent Verifications</h2>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {tabs.map((tab, i) => (
                                    <button
                                        key={i}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Confidence</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {recentVerifications.map((verification, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Smartphone className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-sm text-slate-900">{verification.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600 capitalize">{verification.type}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-slate-600">{verification.date}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                                        <div
                                                            className={`h-full ${verification.status === "verified"
                                                                    ? "bg-green-500"
                                                                    : verification.status === "pending"
                                                                        ? "bg-orange-500"
                                                                        : "bg-red-500"
                                                                }`}
                                                            style={{ width: verification.confidence }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-semibold text-blue-600">{verification.confidence}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {verification.status === "verified" && (
                                                    <div className="flex items-center gap-1 text-green-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span className="text-xs font-medium">Verified</span>
                                                    </div>
                                                )}
                                                {verification.status === "pending" && (
                                                    <div className="flex items-center gap-1 text-orange-600">
                                                        <Clock className="h-4 w-4" />
                                                        <span className="text-xs font-medium">Pending</span>
                                                    </div>
                                                )}
                                                {verification.status === "failed" && (
                                                    <div className="flex items-center gap-1 text-red-600">
                                                        <XCircle className="h-4 w-4" />
                                                        <span className="text-xs font-medium">Failed</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-blue-600 text-sm font-medium hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
