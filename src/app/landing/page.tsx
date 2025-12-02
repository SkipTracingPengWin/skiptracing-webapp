import Link from "next/link";
import { ArrowRight, Shield, MapPin, Users, FileText, BarChart, Zap, ChevronRight, Play, Lock, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900">SkipTrace</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</Link>
                        <Link href="#workflow" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">How It Works</Link>

                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">Sign In</Link>
                        <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-20 pb-32 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100">
                                <Zap className="h-4 w-4 fill-blue-700" />
                                Powered Platform
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15]">
                                Powered <span className="text-blue-600">Skip Tracing</span> <br />& <span className="text-orange-500">Loan Recovery</span> Platform
                            </h1>
                            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
                                Reduce time-to-recovery using automated verification, field agent tracking & regulatory audit trails. Built for NBFCs, Banks & Collection Agencies.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                                    Get Started Now <ArrowRight className="h-5 w-5" />
                                </Link>
                                <button className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <Play className="h-5 w-5 fill-slate-700" /> Watch Demo
                                </button>
                            </div>
                            <div className="flex items-center gap-6 pt-6">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="h-12 w-12 rounded-full bg-slate-200 border-4 border-white shadow-sm"></div>
                                    ))}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex text-orange-500 gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span key={i} className="text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">Trusted by 50+ NBFCs</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
                            <div className="bg-[#0B1121] rounded-2xl shadow-2xl border border-slate-800 p-2 relative z-10">
                                <div className="bg-[#0f172a] rounded-xl overflow-hidden">
                                    {/* Window Controls */}
                                    <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    </div>

                                    {/* Dashboard Content */}
                                    <div className="p-6 space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 font-medium">Skip Trace Analysis</span>
                                            <span className="text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full text-sm">87% Match</span>
                                        </div>

                                        {/* Map Placeholder */}
                                        <div className="h-64 bg-[#1e293b] rounded-lg relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <div className="relative">
                                                    <div className="h-16 w-16 bg-orange-500/20 rounded-full animate-ping absolute inset-0"></div>
                                                    <MapPin className="h-16 w-16 text-orange-500 relative z-10 drop-shadow-lg" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 bg-[#0B1121]/90 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    Signal Detected: Mumbai, MH
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50">
                                                <div className="text-3xl font-bold text-white mb-1">₹2.4Cr</div>
                                                <div className="text-sm text-slate-400 font-medium">Recovered MTD</div>
                                            </div>
                                            <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50">
                                                <div className="text-3xl font-bold text-green-400 mb-1">94%</div>
                                                <div className="text-sm text-slate-400 font-medium">KYC Success</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Glow Effects */}
                            <div className="absolute -top-20 -right-20 h-[500px] w-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
                            <div className="absolute -bottom-20 -left-20 h-[500px] w-[500px] bg-orange-500/20 rounded-full blur-[100px] -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gradient-to-br from-white via-white to-orange-50/60 relative">
                {/* soft top-right bubble */}
                <div className="pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-orange-100/70 blur-3xl opacity-70" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                                45%
                            </div>
                            <div className="mt-2 text-sm md:text-base text-slate-600">
                                Faster Recovery
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                                98%
                            </div>
                            <div className="mt-2 text-sm md:text-base text-slate-600">
                                Verification Accuracy
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                                3x
                            </div>
                            <div className="mt-2 text-sm md:text-base text-slate-600">
                                Agent Efficiency
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                                100%
                            </div>
                            <div className="mt-2 text-sm md:text-base text-slate-600">
                                Audit Compliance
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-orange-600 font-bold bg-orange-50 px-4 py-1.5 rounded-full text-sm uppercase tracking-wide">
                            Platform Features
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-6 mb-6">
                            Everything You Need for <span className="text-blue-600">Loan Recovery</span>
                        </h2>
                        <p className="text-xl text-slate-600">
                            End-to-end skip tracing and recovery automation built for compliance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: 'Smart KYC Verification',
                                desc: 'Automated Aadhaar, PAN, Bank & Employment verification with Signzy integration',
                                bubble: 'from-rose-200/80 via-rose-100/80 to-transparent',
                                iconBg: 'from-rose-500 to-rose-600',
                            },
                            {
                                icon: MapPin,
                                title: 'AI Skip Tracing Heatmaps',
                                desc: 'ML-powered location probability mapping with digital footprint analysis',
                                bubble: 'from-amber-200/80 via-amber-100/80 to-transparent',
                                iconBg: 'from-amber-500 to-orange-600',
                            },
                            {
                                icon: Users,
                                title: 'Agent Assignment & GPS',
                                desc: 'Real-time field agent tracking with geofencing and workload optimization',
                                bubble: 'from-emerald-200/80 via-emerald-100/80 to-transparent',
                                iconBg: 'from-emerald-500 to-emerald-600',
                            },
                            {
                                icon: BarChart,
                                title: 'Automated Recovery Actions',
                                desc: 'SMS, IVR, WhatsApp & scheduled visits with intelligent escalation',
                                bubble: 'from-sky-200/80 via-sky-100/80 to-transparent',
                                iconBg: 'from-sky-500 to-sky-600',
                            },
                            {
                                icon: FileText,
                                title: 'Compliance & Audit Trails',
                                desc: 'RBI-compliant immutable logs with complete regulatory documentation',
                                bubble: 'from-slate-200/80 via-slate-100/80 to-transparent',
                                iconBg: 'from-slate-500 to-slate-600',
                            },
                            {
                                icon: Zap,
                                title: 'Signzy Integrations',
                                desc: 'Built-in APIs for verification, fraud detection & AML screening',
                                bubble: 'from-emerald-200/80 via-emerald-100/80 to-transparent',
                                iconBg: 'from-emerald-500 to-teal-600',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="relative bg-white p-8 rounded-2xl shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_22px_55px_rgba(15,23,42,0.14)] transition-shadow border border-slate-100 overflow-hidden"
                            >
                                {/* bubble background in top-right */}
                                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40">
                                    <div
                                        className={`h-full w-full rounded-full bg-gradient-to-bl ${feature.bubble}`}
                                    />
                                </div>

                                {/* icon with solid rounded square */}
                                <div
                                    className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.iconBg} shadow-lg`}
                                >
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Workflow Section (New) */}
            <section id="workflow" className="py-24 bg-[#0B1121] text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-orange-500 font-bold bg-orange-500/10 px-4 py-1.5 rounded-full text-sm uppercase tracking-wide border border-orange-500/20">How It Works</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-6 mb-6">Streamlined Recovery <span className="text-orange-500">Workflow</span></h2>
                        <p className="text-xl text-slate-400">From borrower data input to successful recovery in 6 automated steps</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { id: "01", title: "Input Borrower", desc: "Import borrower data from your LMS" },
                            { id: "02", title: "Verification", desc: "Run KYC & identity checks automatically" },
                            { id: "03", title: "Skip Trace", desc: "Generate location probability heatmaps" },
                            { id: "04", title: "Assign Agent", desc: "Smart allocation based on jurisdiction" },
                            { id: "05", title: "Recovery Actions", desc: "Execute multi-channel outreach" },
                            { id: "06", title: "Audit Logging", desc: "Complete compliance documentation" },
                        ].map((step, i) => (
                            <div key={i} className="bg-[#151e32] p-8 rounded-2xl border border-slate-800 hover:border-blue-500/30 transition-colors relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10 font-black text-8xl text-blue-500 leading-none select-none group-hover:opacity-20 transition-opacity">
                                    {step.id}
                                </div>
                                <div className="relative z-10">
                                    <div className="text-4xl font-bold text-blue-500 mb-4">{step.id}</div>
                                    <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                                        {step.title}
                                        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
                                    </h3>
                                    <p className="text-slate-400">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section (New) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                        Ready to Transform Your <span className="text-blue-600">Recovery Operations</span>?
                    </h2>
                    <p className="text-xl text-slate-600 mb-10">
                        Join 50+ NBFCs and banks already using SkipTrace
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg hover:shadow-orange-500/25 flex items-center gap-2">
                            Start <ArrowRight className="h-5 w-5" />
                        </Link>
                        <button className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-sm">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer (New) */}
            <footer className="bg-[#0B1121] text-slate-400 py-16 border-t border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">SkipTrace</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-6">
                                Powered skip tracing and loan recovery platform for modern financial institutions.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Product</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Integrations</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">API Docs</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Careers</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Contact</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Blog</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Security</Link></li>
                                <li><Link href="#" className="hover:text-blue-500 transition-colors">Compliance</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                        <div>© 2024 SkipTraceAI. All rights reserved.</div>
                        <div className="flex items-center gap-2 text-slate-500">
                            <Lock className="h-4 w-4" /> SOC 2 Type II Certified
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}



