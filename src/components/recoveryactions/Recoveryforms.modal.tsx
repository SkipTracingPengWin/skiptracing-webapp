"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useBorrowerStore } from "@/store/borrowers.store";
import { useRecoveryActionsStore } from "@/store/recoveryactionsStore";
import { RecoveryActionType, RecoveryActionStatus } from "@/types/recoveryction.type";

// Helper component for dropdown/select field
function SelectField({ label, options, isRequired = false, ...props }: any) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150"
                    {...props}
                >
                    <option value="">{`Select ${label.toLowerCase()}`}</option>
                    {options.map((option: any) => (
                        <option key={option.id || option.value} value={option.id || option.value}>
                            {option.name || option.text}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// Helper component for date/time field
function DateTimeField({ label, isRequired = false, ...props }: any) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    type="datetime-local"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-700"
                    {...props}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

// Helper component for text input field
function InputField({ label, isRequired = false, ...props }: any) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-700"
                {...props}
            />
        </div>
    );
}

// Helper component for textarea field
function TextAreaField({ label, isRequired = false, ...props }: any) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-700 min-h-[100px]"
                {...props}
            />
        </div>
    );
}

export default function ActionModal({
    isOpen,
    onClose,
    initialData = null,
}: {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}) {
    const { borrowers, fetchBorrowers } = useBorrowerStore();
    const { addAction, updateAction, isLoading } = useRecoveryActionsStore();

    const [formData, setFormData] = useState({
        borrowerId: "",
        type: "",
        status: "PENDING",
        priority: "MEDIUM",
        executedAt: "",
        executedBy: "",
        notes: "",
    });

    useEffect(() => {
        if (isOpen && borrowers.length === 0) {
            fetchBorrowers();
        }
    }, [isOpen, borrowers.length, fetchBorrowers]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Populate form for editing
                setFormData({
                    borrowerId: initialData.borrowerId || "",
                    type: initialData.type || "",
                    status: initialData.status || "PENDING",
                    priority: initialData.priority || "MEDIUM",
                    executedAt: initialData.executedAt ? new Date(initialData.executedAt).toISOString().slice(0, 16) : "",
                    executedBy: initialData.executedBy || "",
                    notes: initialData.notes || "",
                });
            } else {
                // Reset form for creation
                setFormData({
                    borrowerId: "",
                    type: "",
                    status: "PENDING",
                    priority: "MEDIUM",
                    executedAt: "",
                    executedBy: "",
                    notes: "",
                });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!formData.borrowerId || !formData.type || !formData.status) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            // Build payload matching the API format
            const actionData: any = {
                borrowerId: formData.borrowerId,
                type: formData.type,
                status: formData.status,
                priority: formData.priority,
                executedBy: formData.executedBy,
                notes: formData.notes,
            };

            // Only add executedAt if it has a value
            if (formData.executedAt && formData.executedAt !== "") {
                actionData.executedAt = new Date(formData.executedAt).toISOString();
            }

            console.log("🎬 Modal - Submitting action data:", JSON.stringify(actionData, null, 2));

            if (initialData && initialData.id) {
                await updateAction(initialData.id, actionData);
            } else {
                await addAction(actionData);
            }
            onClose();
        } catch (error: any) {
            console.error("❌ Modal - Failed to save action:", error);
            console.error("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert(`Failed to save action: ${error.response?.data?.message || error.message}`);
        }
    };

    const actionTypeOptions = [
        { value: RecoveryActionType.SMS, name: "SMS" },
        { value: RecoveryActionType.CALL, name: "Call" },
        { value: RecoveryActionType.VISIT, name: "Visit" },
        { value: RecoveryActionType.NOTICE_LEGAL, name: "Legal Notice" },
        { value: RecoveryActionType.OTHER, name: "Other" },
    ];

    const statusOptions = [
        { value: RecoveryActionStatus.PENDING, name: "Pending" },
        { value: RecoveryActionStatus.SENT, name: "Sent" },
        { value: RecoveryActionStatus.FAILED, name: "Failed" },
        { value: RecoveryActionStatus.COMPLETED, name: "Completed" },
    ];

    const priorityOptions = [
        { value: "HIGH", name: "High" },
        { value: "MEDIUM", name: "Medium" },
        { value: "LOW", name: "Low" },
    ];

    const isEditing = !!initialData;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 opacity-100">

                {/* Modal Header */}
                <div className="flex items-center p-5 border-b border-slate-100">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4 bg-blue-600 shadow-lg shadow-black/20">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 flex-1">
                        {isEditing ? "Edit Recovery Action" : "Create Recovery Action"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">

                    {/* Select Borrower * (Required) */}
                    <SelectField
                        label="Borrower"
                        name="borrowerId"
                        options={borrowers}
                        value={formData.borrowerId}
                        onChange={handleChange}
                        isRequired
                    />

                    {/* Action Type * (Required) */}
                    <SelectField
                        label="Action Type"
                        name="type"
                        options={actionTypeOptions}
                        value={formData.type}
                        onChange={handleChange}
                        isRequired
                    />

                    {/* Status * (Required) */}
                    <SelectField
                        label="Status"
                        name="status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={handleChange}
                        isRequired
                    />

                    {/* Priority (Required) */}
                    <SelectField
                        label="Priority"
                        name="priority"
                        options={priorityOptions}
                        value={formData.priority}
                        onChange={handleChange}
                        isRequired
                    />

                    {/* Execution Date & Time (Optional) */}
                    <DateTimeField
                        label="Execution Date & Time (optional)"
                        name="executedAt"
                        value={formData.executedAt}
                        onChange={handleChange}
                    />

                    {/* Executed By (Optional) */}
                    <InputField
                        label="Executed By (optional)"
                        name="executedBy"
                        placeholder="Name of the person who executed the action"
                        value={formData.executedBy}
                        onChange={handleChange}
                    />

                    {/* Notes (Optional) */}
                    <TextAreaField
                        label="Notes (optional)"
                        name="notes"
                        placeholder="Additional details about the action"
                        value={formData.notes}
                        onChange={handleChange}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Action" : "Create Action")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
