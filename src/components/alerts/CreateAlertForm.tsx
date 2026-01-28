"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAlertStore } from '@/store/alerts.store';
import { useAgentStore } from '@/store/agents.store';
import { useBorrowerStore } from '@/store/borrowers.store';
import { AlertCircle, CheckCircle, Info, XCircle, Send } from 'lucide-react';

const alertSchema = z.object({
    agentId: z.string().min(1, "Agent is required"),
    borrowerId: z.string().optional(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    message: z.string().min(5, "Message must be at least 5 characters"),
    type: z.enum(["info", "warning", "danger", "success"]),
});

type AlertFormData = z.infer<typeof alertSchema>;

export default function CreateAlertForm() {
    const { addAlert } = useAlertStore();
    const { agents, fetchAgents } = useAgentStore();
    const { borrowers, fetchBorrowers } = useBorrowerStore();

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<AlertFormData>({
        resolver: zodResolver(alertSchema),
        defaultValues: {
            type: 'info'
        }
    });

    const selectedBorrowerId = watch('borrowerId');
    const currentMessage = watch('message');

    useEffect(() => {
        fetchAgents();
        fetchBorrowers();
    }, [fetchAgents, fetchBorrowers]);

    // Effect to append borrower name to message when borrower is selected
    useEffect(() => {
        if (selectedBorrowerId) {
            const borrower = borrowers.find(b => String(b.id) === String(selectedBorrowerId));
            if (borrower) {
                const nameString = `Borrower: ${borrower.name}`;
                // Avoid duplicating if already present
                if (currentMessage && !currentMessage.includes(nameString)) {
                    // If message is empty, just set the name. If not, append it.
                    const newMessage = currentMessage ? `${currentMessage}\n${nameString}` : nameString;
                    setValue('message', newMessage);
                } else if (!currentMessage) {
                    setValue('message', nameString);
                }
            }
        }
    }, [selectedBorrowerId, borrowers, setValue]); // careful with currentMessage dependency loop

    const onSubmit = async (data: AlertFormData) => {
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        try {
            await addAlert(data);
            setSuccess("Alert sent successfully!");
            reset();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError("Failed to send alert. Please try again.");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                Send Alert to Agent
            </h3>

            {success && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4" /> {success}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4" /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Agent Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Agent</label>
                    <select
                        {...register('agentId')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        <option value="">Select an Agent</option>
                        {agents.map(agent => (
                            <option key={agent.id} value={agent.userId || agent.id}>
                                {agent.name} ({agent.email})
                            </option>
                        ))}
                    </select>
                    {errors.agentId && <p className="text-red-500 text-xs mt-1">{errors.agentId.message}</p>}
                </div>

                {/* Borrower Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Borrower (Optional)</label>
                    <select
                        {...register('borrowerId')}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        <option value="">Select a Borrower</option>
                        {borrowers.map(borrower => (
                            <option key={borrower.id} value={borrower.id}>
                                {borrower.name} (Loan: {borrower.loanId})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">Selecting a borrower will auto-append their name to the message.</p>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="Alert Title"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                        {...register('message')}
                        rows={3}
                        placeholder="Detailed message for the agent..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    ></textarea>
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Alert Type</label>
                    <div className="flex flex-wrap gap-x-4 gap-y-3">
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none border border-slate-100 md:border-none">
                            <input {...register('type')} type="radio" value="info" className="text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-slate-600 flex items-center gap-1"><Info className="h-4 w-4 text-blue-500" /> Info</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none border border-slate-100 md:border-none">
                            <input {...register('type')} type="radio" value="warning" className="text-orange-600 focus:ring-orange-500" />
                            <span className="text-sm text-slate-600 flex items-center gap-1"><AlertCircle className="h-4 w-4 text-orange-500" /> Warning</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none border border-slate-100 md:border-none">
                            <input {...register('type')} type="radio" value="danger" className="text-red-600 focus:ring-red-500" />
                            <span className="text-sm text-slate-600 flex items-center gap-1"><AlertCircle className="h-4 w-4 text-red-500" /> Urgent</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 md:bg-transparent p-2 md:p-0 rounded-lg md:rounded-none border border-slate-100 md:border-none">
                            <input {...register('type')} type="radio" value="success" className="text-green-600 focus:ring-green-500" />
                            <span className="text-sm text-slate-600 flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Success</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Sending...' : 'Send Alert'}
                </button>
            </form>
        </div>
    );
}
