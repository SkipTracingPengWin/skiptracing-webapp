"use client";


import Link from "next/link";
import toast from "react-hot-toast";
import { Shield, Check, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
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

    // Forgot Password State
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const router = useRouter();

    const { login } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            toast.success("Login successful!");

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
            const message = err.message || "Login failed. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.resetPassword({ email: resetEmail, newPassword });
            toast.success("Password reset successful! Please login with your new password.");
            setShowForgotPassword(false);
            setResetEmail("");
            setNewPassword("");
        } catch (err: any) {
            console.error("Reset password error:", err);
            const message = err.response?.data?.message || err.message || "Failed to reset password.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col md:flex-row font-sans overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-3xl animate-ping"></div>
            </div>

            {/* Left Panel - Enhanced Promotional */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12 md:p-20 flex flex-col justify-between relative z-10">
                {/* Floating Geometric Shapes */}
                <div className="absolute top-20 right-10 w-20 h-20 bg-white/10 rounded-2xl rotate-12 animate-float"></div>
                <div className="absolute bottom-32 left-12 w-24 h-24 bg-white/5 rounded-full -rotate-6 animate-float delay-500"></div>
                <div className="absolute top-1/2 right-20 w-16 h-16 bg-emerald-400/20 rounded-lg animate-bounce"></div>

                <div className="flex flex-col h-full justify-between">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/20">
                            <div className="h-12 w-12 bg-gradient-to-br from-white/20 to-transparent rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                                <Shield className="h-6 w-6 text-white drop-shadow-lg" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">SkipTrace</h1>
                                <p className="text-blue-200 text-xs font-medium tracking-wide">Enterprise Debt Recovery Platform</p>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-lg">
                            <div>
                                <h2 className="text-5xl md:text-6xl font-black leading-tight bg-gradient-to-r from-white via-blue-50 to-transparent bg-clip-text text-transparent drop-shadow-2xl">
                                    Welcome Back
                                </h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mt-4 shadow-lg"></div>
                            </div>
                            <p className="text-lg text-blue-100 leading-relaxed opacity-90">
                                Access your intelligent dashboard and streamline your recovery operations with AI-powered insights.
                            </p>
                        </div>
                    </div>

                    {/* Features Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold">AI Analytics</h4>
                            </div>
                            <p className="text-blue-100 leading-relaxed">Real-time recovery predictions with 95% accuracy</p>
                        </div>
                        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-12 w-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Lock className="h-6 w-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold">SOC 2 Secure</h4>
                            </div>
                            <p className="text-blue-100 leading-relaxed">Enterprise-grade encryption & compliance certified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Enhanced Glassmorphism Form */}
            <div className="md:w-1/2 bg-white/80 backdrop-blur-xl p-8 md:p-16 flex items-center justify-center relative z-20">
                <div className="w-full max-w-lg">
                    {/* Floating Particles */}
                    <div className="absolute top-10 right-10 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-20 left-10 w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl mb-6 backdrop-blur-sm border border-white/30">
                            <ArrowRight className="h-5 w-5" />
                            <span className="text-xl font-bold tracking-wide">Sign In to Continue</span>
                        </div>
                        <p className="text-slate-600 text-lg font-medium">Enter your credentials to access your dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 text-red-700 p-5 rounded-2xl border border-red-200/50 backdrop-blur-sm mb-8 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="h-5 w-5 bg-red-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <Check className="h-3 w-3 text-white" />
                                </div>
                                <span className="font-medium leading-relaxed">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Conditionally render Login or Forgot Password Form */}
                    {!showForgotPassword ? (
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div className="group">
                                <label className="block text-sm font-bold text-slate-900 mb-2.5 tracking-wide">Work Email Address</label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@company.com"
                                        className="w-full pl-14 pr-5 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/70 shadow-lg transition-all duration-300 group-hover:border-slate-300 hover:shadow-xl text-lg placeholder:text-slate-400"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600">
                                        <Mail className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="group">
                                <div className="flex items-center justify-between mb-2.5">
                                    <label className="text-sm font-bold text-slate-900 tracking-wide">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForgotPassword(true);
                                            setError("");
                                        }}
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group-hover:underline flex items-center gap-1"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-14 pr-14 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/70 shadow-lg transition-all duration-300 group-hover:border-slate-300 hover:shadow-xl text-lg placeholder:text-slate-400"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600">
                                        <Lock className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center gap-3 text-lg backdrop-blur-sm border border-white/20"
                            >
                                <span>{loading ? "Signing In..." : "Sign In"}</span>
                                <ArrowRight className={`h-6 w-6 transition-transform ${loading ? '' : 'group-hover:translate-x-1'}`} />
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleForgotPassword}>
                            {/* Email Field */}
                            <div className="group">
                                <label className="block text-sm font-bold text-slate-900 mb-2.5 tracking-wide">Work Email Address</label>
                                <div className="relative">
                                    <input
                                        id="resetEmail"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="john@company.com"
                                        className="w-full pl-14 pr-5 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/70 shadow-lg transition-all duration-300 group-hover:border-slate-300 hover:shadow-xl text-lg placeholder:text-slate-400"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600">
                                        <Mail className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* New Password Field */}
                            <div className="group">
                                <label className="block text-sm font-bold text-slate-900 mb-2.5 tracking-wide">New Password</label>
                                <div className="relative">
                                    <input
                                        id="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full pl-14 pr-14 py-4 bg-white/70 backdrop-blur-sm border-2 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/70 shadow-lg transition-all duration-300 group-hover:border-slate-300 hover:shadow-xl text-lg placeholder:text-slate-400"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-blue-600">
                                        <Lock className="h-6 w-6 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center gap-3 text-lg backdrop-blur-sm border border-white/20"
                            >
                                <span>{loading ? "Resetting..." : "Reset Password"}</span>
                                <ArrowRight className={`h-6 w-6 transition-transform ${loading ? '' : 'group-hover:translate-x-1'}`} />
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setError("");
                                    }}
                                    className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="text-center pt-8 border-t border-slate-200/50">
                        <p className="text-sm text-slate-600 font-medium">
                            Don't have an account?{" "}
                            <Link href="/auth/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors group-hover:underline inline-flex items-center gap-1">
                                Start 14-Day Free Trial
                                <Sparkles className="h-4 w-4 inline" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
