"use client";

import CreateAlertForm from '@/components/alerts/CreateAlertForm';

export default function AdminAlertsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Admin Alert Center</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="order-1 lg:order-1">
                    <CreateAlertForm />
                </div>
                <div className="bg-slate-50 p-4 md:p-6 rounded-xl border border-slate-200 order-2 lg:order-2">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Instructions</h3>
                    <ul className="list-disc pl-5 text-slate-600 space-y-3 text-sm">
                        <li>Use this form to send direct notifications to Agents.</li>
                        <li><strong>Target Agent:</strong> Select the agent who should receive this alert.</li>
                        <li><strong>Borrower Reference:</strong> Optional. Use this to link the alert to a specific borrower case.</li>
                        <li>
                            <strong className="block mb-2">Alert Types:</strong>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                    <span className="w-2 h-2 mt-1.5 rounded-full bg-blue-600 shrink-0"></span>
                                    <div>
                                        <strong className="text-blue-600 block text-xs uppercase tracking-wider">Info</strong>
                                        <span className="text-slate-500 text-xs">General updates or notes.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                    <span className="w-2 h-2 mt-1.5 rounded-full bg-orange-600 shrink-0"></span>
                                    <div>
                                        <strong className="text-orange-600 block text-xs uppercase tracking-wider">Warning</strong>
                                        <span className="text-slate-500 text-xs">Important reminders or issues.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                    <span className="w-2 h-2 mt-1.5 rounded-full bg-red-600 shrink-0"></span>
                                    <div>
                                        <strong className="text-red-600 block text-xs uppercase tracking-wider">Urgent</strong>
                                        <span className="text-slate-500 text-xs">Critical actions required.</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                    <span className="w-2 h-2 mt-1.5 rounded-full bg-green-600 shrink-0"></span>
                                    <div>
                                        <strong className="text-green-600 block text-xs uppercase tracking-wider">Success</strong>
                                        <span className="text-slate-500 text-xs">Feedback or confirmations.</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
