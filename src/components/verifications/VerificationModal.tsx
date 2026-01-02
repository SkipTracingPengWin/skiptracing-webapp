"use client";

import { useState, useEffect } from "react";
import { X, Shield, AlertCircle, Loader2 } from "lucide-react"; // Removed unused imports
import { useBorrowerStore } from "@/store/borrowers.store";
import { VerificationType } from "@/types/verification.types";
import { cn } from "@/lib/utils";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        title: string;
        type: VerificationType;
        icon: any;
        color: string;
    } | null;
    onSubmit: (data: any) => Promise<void>; // Ensure return type is Promise<void>
}

export default function VerificationModal({ isOpen, onClose, service, onSubmit }: VerificationModalProps) {
    const { borrowers } = useBorrowerStore();

    // Unified state
    const [borrowerId, setBorrowerId] = useState<string>("");
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setBorrowerId("");
            setFormData({});
            setError(null);
            setIsLoading(false);
        }
    }, [isOpen]);

    if (!isOpen || !service) return null;

    const Icon = service.icon;

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const isFormValid = () => {
        if (!borrowerId) return false; // Check correct state variable

        switch (service.type) {
            case VerificationType.PAN:
                return formData.pan?.length === 10;
            case VerificationType.AADHAAR:
                return formData.aadhaar?.length === 12;
            case VerificationType.BANK:
                return formData.accountNumber?.length > 8 && formData.ifsc?.length === 11;
            case VerificationType.PHONE:
                return formData.mobile?.length === 10;
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        if (!isFormValid()) return;

        setIsLoading(true);
        setError(null);

        try {
            // Construct payload based on type
            let payload: any = {
                borrowerId: borrowerId, // Use correct state
                type: service.type,
                provider: "MOCK",
                data: {}
            };

            // Map form data to payload
            switch (service.type) {
                case VerificationType.PAN:
                    payload.data = { panNumber: formData.pan };
                    break;
                case VerificationType.AADHAAR:
                    payload.data = { aadhaarNumber: formData.aadhaar };
                    break;
                case VerificationType.BANK:
                    payload.data = {
                        accountNumber: formData.accountNumber,
                        ifsc: formData.ifsc
                    };
                    break;
                case VerificationType.PHONE:
                    payload.data = { mobileNumber: formData.mobile };
                    break;
                default:
                    payload.data = { ...formData };
            }

            await onSubmit(payload);
            onClose();
        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.message || "Failed to submit verification request");
        } finally {
            setIsLoading(false);
        }
    };

    // Render dynamic fields based on type
    const renderFields = () => {
        switch (service.type) {
            case VerificationType.PAN:
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">PAN Number</label>
                        <input
                            type="text"
                            value={formData.pan || ""}
                            onChange={(e) => handleInputChange("pan", e.target.value.toUpperCase())}
                            maxLength={10}
                            placeholder="ABCDE1234F"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                        />
                        <p className="text-xs text-slate-500">Enter 10-character alphanumeric PAN</p>
                    </div>
                );
            case VerificationType.AADHAAR:
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Aadhaar Number</label>
                        <input
                            type="text"
                            value={formData.aadhaar || ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                handleInputChange("aadhaar", val);
                            }}
                            maxLength={12}
                            placeholder="1234 5678 9012"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                        />
                        <p className="text-xs text-slate-500">Enter 12-digit Aadhaar number</p>
                    </div>
                );
            case VerificationType.BANK:
                return (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Account Number</label>
                            <input
                                type="text"
                                value={formData.accountNumber || ""}
                                onChange={(e) => handleInputChange("accountNumber", e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter Account Number"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">IFSC Code</label>
                            <input
                                type="text"
                                value={formData.ifsc || ""}
                                onChange={(e) => handleInputChange("ifsc", e.target.value.toUpperCase())}
                                maxLength={11}
                                placeholder="SBIN0001234"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                            />
                        </div>
                    </div>
                );
            case VerificationType.PHONE:
                return (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                        <input
                            type="text"
                            value={formData.mobile || ""}
                            onChange={(e) => handleInputChange("mobile", e.target.value.replace(/\D/g, '').slice(0, 10))}
                            maxLength={10}
                            placeholder="9876543210"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-slate-900 font-medium placeholder:text-slate-400 transition-all"
                        />
                        <p className="text-xs text-slate-500">Enter 10-digit mobile number</p>
                    </div>
                );
            default:
                return (
                    <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
                        Form for <strong>{service.title}</strong> is under development.
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${service.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{service.title}</h2>
                            <p className="text-xs text-slate-500 font-medium mt-0.5 uppercase tracking-wider">{service.type} VERIFICATION</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-9 w-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Borrower Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            Select Borrower <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50 appearance-none cursor-pointer"
                                value={borrowerId}
                                onChange={(e) => setBorrowerId(e.target.value)}
                                disabled={isLoading}
                            >
                                <option value="">Choose a borrower...</option>
                                {borrowers.map((b) => (
                                    <option key={b.id} value={String(b.id)}>
                                        {b.name} ({b.loanId})
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Form Fields */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification Details</h3>
                        {renderFields()}
                    </div>

                    {/* Info/Note */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl text-sm">
                        <Shield className="h-5 w-5 shrink-0 mt-0.5" />
                        <p className="leading-relaxed opacity-90">
                            This verification request will be processed immediately via our partner APIs. Results typically take 30-60 seconds.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 sticky bottom-0 z-10 backdrop-blur-sm">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900 rounded-xl transition-all border border-transparent hover:border-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid() || isLoading}
                        className={cn(
                            "px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95",
                            !isFormValid() || isLoading
                                ? "bg-slate-300 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30"
                        )}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Shield className="h-4 w-4" />
                                Initialize Verification
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
