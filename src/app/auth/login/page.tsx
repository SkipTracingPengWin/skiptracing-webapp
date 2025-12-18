
"use client";

import Link from "next/link";
import { Shield, Check, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { authUtils } from "@/utils/auth/auth.utils";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { login } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });

            // Get the updated user from the store state to handle redirection
            const user = useAuthStore.getState().user;

            if (!user) {
                setError("Login succeeded but user data is missing");
                return;
            }

            // Redirect based on role
            const role = user.role;
            switch (role) {
                case "ADMIN":
                    router.push("/dashboard/admin");
                    break;
                case "MANAGER":
                    router.push("/dashboard/manager");
                    break;
                case "AGENT":
                    router.push("/dashboard/agent");
                    break;
                default:
                    router.push("/unauthorized");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Left Panel - Promotional */}
            <div className="md:w-1/2 bg-blue-600 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">SkipTrace</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Welcome Back
                        </h1>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Log in to access your dashboard and manage your recovery operations.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-12">
                    <div className="bg-blue-700/50 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <Shield className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-lg">Secure Access</span>
                        </div>
                        <p className="text-blue-100 leading-relaxed">
                            Your data is protected with enterprise-grade encryption and SOC 2 Type II compliance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="md:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
                        <p className="text-slate-500 mt-2">Enter your credentials to continue</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">Work Email</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                                <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account? <Link href="/auth/register" className="text-blue-600 font-medium hover:underline">Start Free Trial</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}