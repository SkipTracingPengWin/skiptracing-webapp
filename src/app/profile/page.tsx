"use client";

import { useEffect, useState } from "react";
import { Mail, Shield, MapPin, Phone, Calendar } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { authService } from "@/services/auth";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    initials?: string;
    [key: string]: any;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = await authService.getCurrentUser();
                setProfile({
                    ...user,
                    initials: user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase(),
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
                <Header title="My Profile" />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                            <div className="px-8 pb-8">
                                <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-12 mb-6 text-center md:text-left">
                                    <div className="h-24 w-24 bg-white rounded-xl p-1 shadow-lg flex-shrink-0">
                                        <div className="h-full w-full bg-slate-100 rounded-lg flex items-center justify-center text-3xl font-bold text-slate-400">
                                            {profile?.initials}
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 md:ml-6 mb-1 flex-1">
                                        <h2 className="text-2xl font-bold text-slate-900">{profile?.name || "Loading..."}</h2>
                                        <p className="text-slate-500">{profile?.role || "User Role"}</p>
                                    </div>
                                    <button className="mt-4 md:mt-0 md:ml-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto">
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semantics font-semibold text-slate-900">Contact Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Mail className="h-5 w-5 text-slate-400" />
                                                <span>{profile?.email || "user@example.com"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Phone className="h-5 w-5 text-slate-400" />
                                                <span>+1 (555) 123-4567</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <MapPin className="h-5 w-5 text-slate-400" />
                                                <span>San Francisco, CA</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semantics font-semibold text-slate-900">Account Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Shield className="h-5 w-5 text-slate-400" />
                                                <span className="capitalize">{profile?.role || "User"} Access</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Calendar className="h-5 w-5 text-slate-400" />
                                                <span>Joined December 2024</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity or Stats Section (Optional but adds "Style") */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-sm font-medium text-slate-500 mb-1">Total Actions</div>
                                <div className="text-2xl font-bold text-slate-900">1,234</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-sm font-medium text-slate-500 mb-1">Avg. Response Time</div>
                                <div className="text-2xl font-bold text-slate-900">2h 15m</div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-sm font-medium text-slate-500 mb-1">Efficiency Score</div>
                                <div className="text-2xl font-bold text-green-600">98%</div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
