"use client";

import React from 'react';
import { X, ExternalLink, User, Facebook, Instagram, Twitter, Linkedin, CheckCircle2 } from 'lucide-react';
import type { Borrower } from '@/types';

interface SocialMediaResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    borrower: Borrower | null;
    socials: any[]; // Using the processed social objects from page.tsx
}

const SocialMediaResultsModal: React.FC<SocialMediaResultsModalProps> = ({ isOpen, onClose, borrower, socials }) => {
    if (!isOpen || !borrower) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-purple-600 p-6 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>

                    <div className="mx-auto h-20 w-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-purple-600 mb-3 shadow-lg">
                        {borrower.name.charAt(0).toUpperCase()}
                    </div>

                    <h2 className="text-xl font-bold">{borrower.name}</h2>
                    <p className="text-purple-100 text-sm mt-1">Search Complete</p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-slate-700">
                            {socials.length > 0
                                ? `Found ${socials.length} Profile${socials.length === 1 ? '' : 's'}`
                                : 'No profiles found'}
                        </span>
                    </div>

                    {socials.length > 0 ? (
                        <div className="space-y-3">
                            {socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${social.bg} text-white`}>
                                            <social.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 group-hover:text-purple-700 transition-colors">
                                                {social.name}
                                            </p>
                                            <p className="text-xs text-slate-500">View Profile</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-purple-600" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-sm">
                                We couldn't find any direct matches on major platforms.
                            </p>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
export default SocialMediaResultsModal;