"use client";

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Facebook, Instagram, Twitter, Linkedin, Youtube, CheckCircle2, Check } from 'lucide-react';
import type { Borrower } from '@/types';
import type { SocialMediaSearchResult } from '@/types/socialmedia.type';
import { useSocialProfilesStore } from '@/store/socialmedia.store';

interface SocialMediaResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    borrower: Borrower | null;
}

// Helper to get platform icon and styling
const getPlatformConfig = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();

    if (normalizedPlatform.includes('instagram')) {
        return { icon: Instagram, bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400', name: 'Instagram' };
    } else if (normalizedPlatform.includes('facebook')) {
        return { icon: Facebook, bg: 'bg-blue-600', name: 'Facebook' };
    } else if (normalizedPlatform.includes('twitter') || normalizedPlatform.includes('x.com')) {
        return { icon: Twitter, bg: 'bg-sky-500', name: 'Twitter' };
    } else if (normalizedPlatform.includes('linkedin')) {
        return { icon: Linkedin, bg: 'bg-blue-700', name: 'LinkedIn' };
    } else if (normalizedPlatform.includes('youtube')) {
        return { icon: Youtube, bg: 'bg-red-600', name: 'YouTube' };
    }
    return { icon: ExternalLink, bg: 'bg-slate-500', name: platform };
};

const SocialMediaResultsModal: React.FC<SocialMediaResultsModalProps> = ({ isOpen, onClose, borrower }) => {
    const { searchResults, setSelectedAccounts, addSelectedBorrower } = useSocialProfilesStore();
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

    // Get search results for this borrower
    const results: SocialMediaSearchResult[] = borrower ? searchResults[String(borrower.id)] || [] : [];

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedIndices(new Set());
        }
    }, [isOpen]);

    const toggleSelection = (index: number) => {
        setSelectedIndices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const handleDone = () => {
        if (borrower) {
            // Get selected accounts
            const selectedAccountsList = results.filter((_, index) => selectedIndices.has(index));

            // Save selected accounts to store
            setSelectedAccounts(String(borrower.id), selectedAccountsList);

            // Add borrower to selected list if not already there
            addSelectedBorrower(String(borrower.id));

            onClose();
        }
    };

    if (!isOpen || !borrower) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="bg-purple-600 p-6 text-white text-center relative flex-shrink-0">
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
                <div className="p-6 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-slate-700">
                            {results.length > 0
                                ? `Found ${results.length} Profile${results.length === 1 ? '' : 's'}`
                                : 'No profiles found'}
                        </span>
                    </div>

                    {results.length > 0 && (
                        <p className="text-sm text-slate-500 mb-4 text-center">
                            Select the accounts you want to add to this borrower's profile
                        </p>
                    )}

                    {results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((result, index) => {
                                const config = getPlatformConfig(result.platform || result.source || 'Social Media');
                                const isSelected = selectedIndices.has(index);
                                const IconComponent = config.icon;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => toggleSelection(index)}
                                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer group ${isSelected
                                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                                : 'border-slate-100 hover:border-purple-200 hover:bg-purple-50/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={`p-2 rounded-lg ${config.bg} text-white flex-shrink-0`}>
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-900 truncate">
                                                    {result.title}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate">{result.displayed_link || result.url}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                            <a
                                                href={result.link || result.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                            >
                                                <ExternalLink className="h-4 w-4 text-slate-400 hover:text-purple-600" />
                                            </a>
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'border-purple-500 bg-purple-500'
                                                    : 'border-slate-300'
                                                }`}>
                                                {isSelected && <Check className="h-4 w-4 text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-sm">
                                We couldn't find any direct matches on major platforms.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-slate-500">
                            {selectedIndices.size} account{selectedIndices.size !== 1 ? 's' : ''} selected
                        </span>
                        {selectedIndices.size > 0 && (
                            <button
                                onClick={() => setSelectedIndices(new Set())}
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Clear Selection
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleDone}
                        className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                        Done - Add to Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialMediaResultsModal;
