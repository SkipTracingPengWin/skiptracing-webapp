"use client";

import CreateAlertForm from '@/components/alerts/CreateAlertForm';

export default function AdminAlertsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Alert Center</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <CreateAlertForm />
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Instructions</h3>
                    <ul className="list-disc pl-5 text-slate-600 space-y-2 text-sm">
                        <li>Use this form to send direct notifications to Agents.</li>
                        <li><strong>Target Agent:</strong> Select the agent who should receive this alert.</li>
                        <li><strong>Borrower Reference:</strong> Optional. Use this to link the alert to a specific borrower case.</li>
                        <li><strong>Alert Type:</strong>
                            <ul className="list-circle pl-5 mt-1 space-y-1">
                                <li><strong className="text-blue-600">Info:</strong> General updates or notes.</li>
                                <li><strong className="text-orange-600">Warning:</strong> Important reminders or issues.</li>
                                <li><strong className="text-red-600">Urgent:</strong> Critical actions required immediately.</li>
                                <li><strong className="text-green-600">Success:</strong> Positive feedback or confirmations.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
