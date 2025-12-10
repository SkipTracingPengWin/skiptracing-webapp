"use client";

import { useState } from "react";
import { X, Shield } from "lucide-react";
import { useBorrowerStore } from "@/store/borrowers.store";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        title: string;
        icon: any;
        color: string;
    } | null;
    onSubmit: (data: any) => void;
}

export default function VerificationModal({ isOpen, onClose, service, onSubmit }: VerificationModalProps) {
    const { borrowers } = useBorrowerStore();
    const [selectedBorrowerId, setSelectedBorrowerId] = useState<string>("");
    const [inputValue, setInputValue] = useState("");

    if (!isOpen || !service) return null;

    const handleSubmit = () => {
        onSubmit({
            service: service.title,
            borrowerId: selectedBorrowerId,
            value: inputValue
        });
        onClose();
        // Reset form
        setSelectedBorrowerId("");
        setInputValue("");
    };

    // Determine input label based on service title
    const getInputLabel = () => {
        if (service.title.includes("Aadhaar")) return "Aadhaar Number";
        if (service.title.includes("PAN")) return "PAN Number";
        if (service.title.includes("Mobile")) return "Mobile Number";
        if (service.title.includes("Bank")) return "Account Number";
        return "Document Number"; // Default
    };

    const getInputPlaceholder = () => {
        if (service.title.includes("Aadhaar")) return "Enter 12-digit Aadhaar";
        if (service.title.includes("PAN")) return "Enter 10-character PAN";
        return `Enter ${getInputLabel().toLowerCase()}`;
    };

    const Icon = service.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${service.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">{service.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Borrower Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900">Select Borrower</label>
                        <select
                            value={selectedBorrowerId}
                            onChange={(e) => setSelectedBorrowerId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-600 text-sm appearance-none"
                            style={{ backgroundImage: 'none' }} // Remove default arrow if needed, or keep it
                        >
                            <option value="" disabled>Select a borrower</option>
                            {borrowers.map((borrower) => (
                                <option key={borrower.id} value={borrower.id}>
                                    {borrower.name} - {borrower.loanId}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dynamic Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900">{getInputLabel()}</label>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={getInputPlaceholder()}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 text-sm placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedBorrowerId || !inputValue}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Shield className="h-4 w-4" />
                        Run Verification
                    </button>
                </div>
            </div>
        </div>
    );
}
