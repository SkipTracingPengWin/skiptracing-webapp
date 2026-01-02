"use client";

import React, { useState, useEffect } from 'react';
import { X, Search, Filter, MapPin, Phone, Mail, User, CheckCircle2 } from 'lucide-react';
import { useBorrowerStore } from '@/store/borrowers.store';
import { useSocialProfilesStore } from '@/store/socialmedia.store';
import type { Borrower } from '@/types';

interface FindBySocialMediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBorrowerSelect?: (borrower: Borrower) => void;
}

const FindBySocialMediaModal: React.FC<FindBySocialMediaModalProps> = ({ isOpen, onClose, onBorrowerSelect }) => {
    const { borrowers, fetchBorrowers, loading: borrowersLoading } = useBorrowerStore();
    const { performSearch, loading: searchLoading } = useSocialProfilesStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
    const [filterLocation, setFilterLocation] = useState('');
    const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
    useEffect(() => {
        if (isOpen) {
            fetchBorrowers();
            setSelectedBorrower(null); // Reset selection when modal opens
        }
    }, [isOpen, fetchBorrowers]);

    // Get unique locations for filter dropdown
    const uniqueLocations = Array.from(new Set(borrowers.map(b => b.location).filter(Boolean)));

    // Filter borrowers based on search and filters
    const filteredBorrowers = borrowers.filter((borrower: Borrower) => {
        const matchesSearch =
            borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (borrower.email && borrower.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (borrower.phone && borrower.phone.includes(searchQuery));

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'verified' && borrower.verified) ||
            (filterStatus === 'unverified' && !borrower.verified);

        const matchesLocation =
            !filterLocation ||
            borrower.location === filterLocation;

        return matchesSearch && matchesStatus && matchesLocation;
    });

    const handleBorrowerClick = (borrower: Borrower) => {
        setSelectedBorrower(borrower);
    };

    const handleFindSocialMedia = async () => {
        if (selectedBorrower) {
            await performSearch(String(selectedBorrower.id), selectedBorrower.name);
            if (onBorrowerSelect) {
                onBorrowerSelect(selectedBorrower);
            }
            onClose(); // Close modal after selection
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-6xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh]" role="dialog" aria-modal="true">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Find by Social Media</h2>
                        <p className="text-sm text-slate-500 mt-1">Search and filter borrowers to find social media profiles</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                        aria-label="Close dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Side: Borrower List */}
                    <div className="flex-1 flex flex-col border-r border-slate-200">
                        {/* Search and Filters */}
                        <div className="p-6 border-b border-slate-200 space-y-4">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            {/* Filters Row */}
                            <div className="flex flex-wrap gap-3 items-center">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-500" />
                                    <span className="text-sm font-medium text-slate-700">Filters:</span>
                                </div>

                                {/* Status Filter */}
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'verified' | 'unverified')}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                >
                                    <option value="all">All Status</option>
                                    <option value="verified">Verified</option>
                                    <option value="unverified">Unverified</option>
                                </select>

                                {/* Location Filter */}
                                <select
                                    value={filterLocation}
                                    onChange={(e) => setFilterLocation(e.target.value)}
                                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                >
                                    <option value="">All Locations</option>
                                    {uniqueLocations.map((location) => (
                                        <option key={location} value={location}>
                                            {location}
                                        </option>
                                    ))}
                                </select>

                                {/* Clear Filters */}
                                {(searchQuery || filterStatus !== 'all' || filterLocation) && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilterStatus('all');
                                            setFilterLocation('');
                                        }}
                                        className="px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>

                            {/* Results Count */}
                            <div className="text-sm text-slate-500">
                                {filteredBorrowers.length} {filteredBorrowers.length === 1 ? 'result' : 'results'}
                            </div>
                        </div>

                        {/* Scrollable Borrower List */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {borrowersLoading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                                </div>
                            ) : filteredBorrowers.length === 0 ? (
                                <div className="text-center py-20">
                                    <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No borrowers found</p>
                                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredBorrowers.map((borrower: Borrower) => (
                                        <div
                                            key={borrower.id}
                                            onClick={() => handleBorrowerClick(borrower)}
                                            className={`p - 4 border rounded - lg transition - all cursor - pointer ${selectedBorrower?.id === borrower.id
                                                ? 'border-purple-500 bg-purple-50 shadow-md'
                                                : 'border-slate-200 hover:border-purple-300 hover:shadow-md bg-white'
                                                } `}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                                                        {borrower.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900">{borrower.name}</h3>
                                                        {borrower.verified && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 mt-1">
                                                                Verified
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {selectedBorrower?.id === borrower.id && (
                                                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                {borrower.location && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                        <span>{borrower.location}</span>
                                                    </div>
                                                )}
                                                {borrower.phone && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                        <span>{borrower.phone}</span>
                                                    </div>
                                                )}
                                                {borrower.email && (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="truncate">{borrower.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Selected Borrower Details Form */}
                    <div className="w-96 flex flex-col bg-slate-50">
                        {selectedBorrower ? (
                            <>
                                <div className="p-6 border-b border-slate-200 bg-white">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Selected Borrower</h3>
                                    <p className="text-sm text-slate-500">Review details before searching</p>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {/* Avatar and Name */}
                                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                                        <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-2xl">
                                            {selectedBorrower.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">{selectedBorrower.name}</h4>
                                            {selectedBorrower.verified && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 mt-1">
                                                    ✓ Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Details Form */}
                                    <div className="space-y-3">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Name</label>
                                            <p className="text-sm font-medium text-slate-900 mt-1">{selectedBorrower.name}</p>
                                        </div>

                                        {selectedBorrower.email && (
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</label>
                                                <p className="text-sm font-medium text-slate-900 mt-1">{selectedBorrower.email}</p>
                                            </div>
                                        )}

                                        {selectedBorrower.phone && (
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</label>
                                                <p className="text-sm font-medium text-slate-900 mt-1">{selectedBorrower.phone}</p>
                                            </div>
                                        )}

                                        {selectedBorrower.location && (
                                            <div className="bg-white p-4 rounded-lg border border-slate-200">
                                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Location</label>
                                                <p className="text-sm font-medium text-slate-900 mt-1">{selectedBorrower.location}</p>
                                            </div>
                                        )}

                                        <div className="bg-white p-4 rounded-lg border border-slate-200">
                                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Borrower ID</label>
                                            <p className="text-sm font-mono text-slate-900 mt-1">{selectedBorrower.id}</p>
                                        </div>
                                    </div>

                                    {/* Find Button */}
                                    <button
                                        onClick={handleFindSocialMedia}
                                        disabled={searchLoading}
                                        className={`w-full px-4 py-3 ${searchLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg font-semibold transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2`}
                                    >
                                        {searchLoading ? (
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Search className="h-5 w-5" />
                                        )}
                                        {searchLoading ? 'Searching...' : 'Find Social Media Profiles'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-6">
                                <div className="text-center">
                                    <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No borrower selected</p>
                                    <p className="text-sm text-slate-400 mt-1">Click on a borrower to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FindBySocialMediaModal;