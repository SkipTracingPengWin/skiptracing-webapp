
// "use client";
// import Link from "next/link";
// import { Shield, Check, Eye, EyeOff, Building2, User, Mail, Lock, Briefcase } from "lucide-react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { authService } from "@/services/auth";

// export default function RegisterPage() {
//     const [showPassword, setShowPassword] = useState(false);
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         company: "",
//         role: "",
//         password: ""
//     });
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const router = useRouter();

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleRegister = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         if (!formData.role) {
//             setError("Please select a role");
//             setLoading(false);
//             return;
//         }

//         try {
//             await authService.register(formData);
//             router.push("/auth/login");
//         } catch (err: any) {
//             setError(err.response?.data?.message || "Registration failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col md:flex-row font-sans">
//             {/* Left Panel - Promotional */}
//             <div className="md:w-1/2 bg-blue-600 text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden">
//                 {/* Background Decorative Elements */}
//                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
//                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>

//                 <div className="relative z-10">
//                     <div className="flex items-center gap-2 mb-12">
//                         <div className="h-10 w-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
//                             <Shield className="h-6 w-6 text-white" />
//                         </div>
//                         <span className="text-2xl font-bold">SkipTrace</span>
//                     </div>

//                     <div className="space-y-6 max-w-lg">
//                         <h1 className="text-4xl md:text-5xl font-bold leading-tight">
//                             Start Your Free Trial
//                         </h1>
//                         <p className="text-blue-100 text-lg leading-relaxed">
//                             Get started with powered skip tracing and transform your loan recovery operations.
//                         </p>
//                     </div>
//                 </div>

//                 <div className="relative z-10 mt-12">
//                     <div className="bg-blue-700/50 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
//                         <div className="flex items-center gap-3 mb-4">
//                             <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
//                                 <Check className="h-3 w-3 text-white" />
//                             </div>
//                             <span className="font-bold text-lg">14-Day Free Trial</span>
//                         </div>
//                         <ul className="space-y-3 text-blue-100">
//                             <li className="flex items-center gap-2">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
//                                 Full platform access
//                             </li>
//                             <li className="flex items-center gap-2">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
//                                 100 free verifications
//                             </li>
//                             <li className="flex items-center gap-2">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
//                                 Dedicated support
//                             </li>
//                             <li className="flex items-center gap-2">
//                                 <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
//                                 No credit card required
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             {/* Right Panel - Form */}
//             <div className="md:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
//                 <div className="w-full max-w-md space-y-8">
//                     <div className="text-center">
//                         <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
//                         <p className="text-slate-500 mt-2">Start your 14-day free trial today</p>
//                     </div>

//                     {error && (
//                         <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
//                             {error}
//                         </div>
//                     )}

//                     <form className="space-y-5" onSubmit={handleRegister}>
//                         <div className="space-y-1.5">
//                             <label className="text-sm font-medium text-slate-700" htmlFor="name">Full Name</label>
//                             <div className="relative">
//                                 <input
//                                     id="name"
//                                     type="text"
//                                     value={formData.name}
//                                     onChange={handleChange}
//                                     placeholder="John Doe"
//                                     className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
//                                     required
//                                 />
//                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                                     <User className="h-5 w-5 text-slate-400" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-sm font-medium text-slate-700" htmlFor="email">Work Email</label>
//                             <div className="relative">
//                                 <input
//                                     id="email"
//                                     type="email"
//                                     value={formData.email}
//                                     onChange={handleChange}
//                                     placeholder="name@company.com"
//                                     className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
//                                     required
//                                 />
//                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                                     <Mail className="h-5 w-5 text-slate-400" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-sm font-medium text-slate-700" htmlFor="company">Company Name</label>
//                             <div className="relative">
//                                 <input
//                                     id="company"
//                                     type="text"
//                                     value={formData.company}
//                                     onChange={handleChange}
//                                     placeholder="Your Company"
//                                     className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
//                                     required
//                                 />
//                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                                     <Building2 className="h-5 w-5 text-slate-400" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-sm font-medium text-slate-700" htmlFor="role">Your Role</label>
//                             <div className="relative">
//                                 <select
//                                     id="role"
//                                     value={formData.role}
//                                     onChange={handleChange}
//                                     className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-600 bg-white appearance-none"
//                                     required
//                                 >
//                                     <option value="" disabled>Select your role</option>
//                                     <option value="ADMIN">Administrator</option>
//                                     <option value="MANAGER">Collection Manager</option>
//                                     <option value="AGENT">Field Agent</option>
//                                 </select>
//                                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                                     <Briefcase className="h-5 w-5 text-slate-400" />
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-1.5">
//                             <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
//                             <div className="relative">
//                                 <input
//                                     id="password"
//                                     type={showPassword ? "text" : "password"}
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     placeholder="Create a strong password"
//                                     className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
//                                     required
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
//                                 >
//                                     {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
//                                 </button>
//                             </div>
//                         </div>

//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {loading ? "Creating Account..." : "Create Account"}
//                         </button>
//                     </form>

//                     <div className="text-center space-y-4">
//                         <p className="text-xs text-slate-500">
//                             By signing up, you agree to our <Link href="#" className="text-blue-600 hover:underline">Terms</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
//                         </p>
//                         <p className="text-sm text-slate-600">
//                             Already have an account? <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }







"use client";
import Link from "next/link";
import { Shield, Check, Eye, EyeOff, Building2, User, Mail, Lock, Briefcase, Sparkles, ArrowRight, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        role: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.role) {
            setError("Please select a role");
            setLoading(false);
            return;
        }

        try {
            await authService.register(formData);
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 flex flex-col lg:flex-row font-sans">
            {/* CHANGE 1: Background orbs w-48→w-40, h-48→h-40, w-40→w-32, w-36→w-32 (-2rem total) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-orange-400/30 via-amber-500/20 to-rose-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-r from-emerald-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-rose-400/15 to-orange-500/15 rounded-full blur-3xl animate-ping"></div>
            </div>

            {/* CHANGE 2: Left panel p-8 lg:p-12 → p-6 lg:p-10 (-2rem padding) */}
            <div className="lg:w-1/2 bg-gradient-to-br from-orange-500 via-amber-600 to-rose-600 text-white p-6 lg:p-10 flex flex-col justify-between relative z-10">
                {/* CHANGE 3: Floating elements smaller by 2rem total area */}
                <div className="absolute top-12 right-6 w-14 h-14 bg-white/10 rounded-xl rotate-12 animate-float"></div>
                <div className="absolute bottom-20 left-6 w-18 h-18 bg-white/5 rounded-full -rotate-6 animate-float delay-700"></div>
                <div className="absolute top-1/2 right-10 w-10 h-10 bg-gradient-to-br from-white/20 to-transparent rounded-lg animate-bounce shadow-md"></div>

                <div className="flex flex-col h-full justify-between py-3">
                    {/* CHANGE 4: space-y-6→space-y-4, logo h-12→h-10 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-2xl p-3 rounded-xl border border-white/25 shadow-lg">
                            <div className="h-10 w-10 bg-gradient-to-br from-white/25 to-transparent rounded-xl flex items-center justify-center backdrop-blur-xl shadow-lg">
                                <Shield className="h-6 w-6 text-white drop-shadow-md" />
                            </div>
                            <div>
                                {/* CHANGE 5: Logo text-2xl→text-xl */}
                                <h1 className="text-xl font-black bg-gradient-to-r from-white via-amber-50 to-transparent bg-clip-text text-transparent">
                                    SkipTrace
                                </h1>
                                <p className="text-amber-100 text-xs font-semibold tracking-wide opacity-90">AI Debt Recovery</p>
                            </div>
                        </div>

                        {/* CHANGE 6: Title text-3xl lg:text-4xl→text-2xl lg:text-3xl, text-lg→text-sm */}
                        <div className="space-y-3 max-w-sm">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-black leading-tight bg-gradient-to-r from-white via-orange-50 to-amber-100 bg-clip-text text-transparent">
                                    Join Premium
                                </h2>
                                <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mt-2 shadow-md"></div>
                            </div>
                            <p className="text-sm text-amber-100 leading-relaxed opacity-90 font-medium">
                                Enterprise trial with AI recovery insights.
                            </p>
                        </div>
                    </div>

                    {/* CHANGE 7: Feature card p-19→p-5, h4 text-xl→text-lg */}
                    <div className="grid grid-cols-1 gap-2">
                        <div className="group bg-white/15 backdrop-blur-2xl rounded-xl p-5 border border-white/25 hover:bg-white/25 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-9 w-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105">
                                    <Star className="h-4 w-4 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-white">14-Day Trial</h4>
                            </div>
                            <ul className="space-y-1.5 text-amber-100 text-xs font-medium">
                                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-all">• Unlimited access</li>
                                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-all delay-75">• 500 verifications</li>
                                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-all delay-150">• 24/7 support</li>
                                <li className="flex items-center gap-2 group-hover:translate-x-1 transition-all delay-225">• No card needed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHANGE 8: Right panel p-6 lg:p-17→p-4 lg:p-8, max-w-lg→max-w-md */}
            <div className="lg:w-1/2 bg-white/90 backdrop-blur-2xl p-4 lg:p-8 flex items-center justify-center relative z-20 border border-white/50 shadow-xl">
                {/* CHANGE 9: Particles smaller */}
                <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-14 left-6 w-1 h-1 bg-gradient-to-r from-emerald-400 to-amber-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-12 right-12 w-2 h-2 bg-gradient-to-r from-rose-400 to-orange-500 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>

                <div className="w-full max-w-md">
                    {/* CHANGE 10: Header px-6 py-3→px-4 py-2, text-xl→text-lg, text-lg→text-sm */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-600 to-rose-500 text-white px-4 py-2 rounded-xl shadow-lg mb-4 backdrop-blur-xl border border-white/30">
                            <Sparkles className="h-4 w-4 animate-spin" />
                            <span className="text-lg font-black tracking-wide">Create Account</span>
                        </div>
                        <p className="text-slate-700 text-sm font-semibold">Join recovery professionals</p>
                    </div>

                    {error && (
                        <div className="bg-gradient-to-r from-rose-500/10 to-orange-500/10 text-rose-800 p-3 rounded-xl border border-rose-200/50 backdrop-blur-xl mb-4 shadow-md">
                            <div className="flex items-start gap-2">
                                <div className="h-4 w-4 bg-rose-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                                    <Check className="h-3 w-3 text-white" />
                                </div>
                                <span className="font-medium text-sm">{error}</span>
                            </div>
                        </div>
                    )}

                    {/* CHANGE 11: space-y-5→space-y-4, inputs py-4→py-3, text-base→text-sm */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-900 mb-1.5">Full Name</label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-xl border-2 border-slate-200/70 rounded-xl focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 shadow-md transition-all duration-200 group-hover:border-amber-300 text-sm placeholder:text-slate-400"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-amber-600">
                                    <User className="h-5 w-5 text-slate-400 group-focus-within:text-amber-600" />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-bold text-slate-900 mb-1.5">Work Email</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@company.com"
                                    className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-xl border-2 border-slate-200/70 rounded-xl focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 shadow-md transition-all duration-200 group-hover:border-amber-300 text-sm placeholder:text-slate-400"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-amber-600">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-amber-600" />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-bold text-slate-900 mb-1.5">Company</label>
                            <div className="relative">
                                <input
                                    id="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Your Company"
                                    className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-xl border-2 border-slate-200/70 rounded-xl focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 shadow-md transition-all duration-200 group-hover:border-amber-300 text-sm placeholder:text-slate-400"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-amber-600">
                                    <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-amber-600" />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-bold text-slate-900 mb-1.5">Role</label>
                            <div className="relative">
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-10 py-3 bg-white/90 backdrop-blur-xl border-2 border-slate-200/70 rounded-xl focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 shadow-md transition-all duration-200 group-hover:border-amber-300 text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>Select role</option>
                                    <option value="ADMIN">👑 Administrator</option>
                                    <option value="MANAGER">📊 Manager</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-amber-600">
                                    <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-amber-600" />
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-sm font-bold text-slate-900 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Strong password"
                                    className="w-full pl-12 pr-12 py-3 bg-white/90 backdrop-blur-xl border-2 border-slate-200/70 rounded-xl focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 shadow-md transition-all duration-200 group-hover:border-amber-300 text-sm placeholder:text-slate-400"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-amber-600">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-amber-600" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-amber-600 transition-all"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* CHANGE 12: Button py-4→py-3, text-lg→text-sm */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full bg-gradient-to-r from-orange-500 via-amber-600 to-rose-600 hover:from-orange-600 hover:via-amber-700 hover:to-rose-700 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-center gap-1.5 text-sm border border-white/30"
                        >
                            <span>{loading ? "Creating..." : "Create Account"}</span>
                            <ArrowRight className={`h-4 w-4 transition-transform ${loading ? '' : 'group-hover:translate-x-1.5'}`} />
                        </button>
                    </form>

                    {/* CHANGE 13: Footer pt-6→pt-4 */}
                    <div className="text-center pt-4 border-t border-amber-100/50">
                        <p className="text-xs text-slate-600 mb-2">
                            By signing up, you agree to our{" "}
                            <Link href="#" className="text-amber-600 font-semibold hover:text-amber-700">Terms</Link> and{" "}
                            <Link href="#" className="text-amber-600 font-semibold hover:text-amber-700">Privacy</Link>
                        </p>
                        <p className="text-sm text-slate-700 font-medium">
                            Have account?{" "}
                            <Link href="/auth/login" className="text-orange-600 font-bold hover:text-orange-700 bg-orange-100 px-2 py-1 rounded-lg inline-flex items-center gap-1 shadow-sm">
                                Sign In
                                <ArrowRight className="h-3 w-3 group-hover:translate-x-1" />
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}





