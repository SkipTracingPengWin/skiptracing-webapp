"use client";

import { X, AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteBorrowerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    borrowerName?: string;
    isDeleting: boolean;
}

export default function DeleteBorrowerModal({
    isOpen,
    onClose,
    onConfirm,
    borrowerName,
    isDeleting
}: DeleteBorrowerModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">

                {/* Header */}
                <div className="relative flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        Confirm Deletion
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-all duration-200 text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                            <Trash2 className="h-8 w-8 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <p className="text-slate-600">
                                Are you sure you want to delete <span className="font-bold text-slate-900">{borrowerName || "this borrower"}</span>?
                            </p>
                            <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                This action cannot be undone. All associated data will be permanently removed.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-200 shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 border-2 border-red-600 hover:border-red-700 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Deleting...
                            </>
                        ) : (
                            <>
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
