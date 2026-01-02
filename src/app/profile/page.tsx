"use client";

import { useEffect, useState } from "react";
import { Mail, Shield, MapPin, Phone, Calendar, Lock } from "lucide-react";
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
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

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

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: "", text: "" });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        try {
            setIsPasswordLoading(true);
            await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordMessage({ type: "success", text: "Password changed successfully!" });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            setPasswordMessage({ type: "error", text: error.response?.data?.message || "Failed to change password" });
        } finally {
            setIsPasswordLoading(false);
        }
    };

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

                        {/* Change Password Section - AGENT ONLY */}
                        {profile?.role === 'AGENT' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                        Change Password
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">Ensure your account stays secure by updating your password regularly.</p>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                                        {passwordMessage.text && (
                                            <div className={`p-3 rounded-lg text-sm ${passwordMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                                {passwordMessage.text}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                required
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isPasswordLoading}
                                            className="px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isPasswordLoading ? "Updating..." : "Update Password"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

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
