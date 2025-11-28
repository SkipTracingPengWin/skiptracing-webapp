"use client";
import Link from "next/link";

import { Shield, Check, Eye, EyeOff, Building2, User, Mail, Lock, Briefcase } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedOption, setSelectedOption] = useState("option2");
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
                            Start Your Free Trial
                        </h1>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Get started with powered skip tracing and transform your loan recovery operations.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mt-12">
                    <div className="bg-blue-700/50 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-bold text-lg">14-Day Free Trial</span>
                        </div>
                        <ul className="space-y-3 text-blue-100">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                                Full platform access
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                                100 free verifications
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                                Dedicated support
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                                No credit card required
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="md:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Start your 14-day free trial today</p>
                    </div>

                    <form className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="email">Work Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="company">Company Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Building2 className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="company"
                                    type="text"
                                    placeholder="Your Company"
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="role">Your Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-slate-400" />
                                </div>
                                <select
                                    id="role"
                                    defaultValue=""
                                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-600 bg-white appearance-none"
                                >
                                    <option value="" disabled>Select your role</option>
                                    <option value="admin">Administrator</option>
                                    <option value="manager">Collection Manager</option>
                                    <option value="agent">Field Agent</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
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
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <p className="text-xs text-slate-500">
                            By signing up, you agree to our <Link href="#" className="text-blue-600 hover:underline">Terms</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </p>
                        <p className="text-sm text-slate-600">
                            Already have an account? <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
