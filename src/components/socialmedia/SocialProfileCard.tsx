import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Search, Users, Phone, Mail, MapPin } from "lucide-react";

interface SocialProfileCardProps {
    profile: any;
    openMenuId: string | null;
    setOpenMenuId: (id: string | null) => void;
    onViewResults: (id: any) => void;
    onDelete: (id: string) => void;
}

export default function SocialProfileCard({ profile, openMenuId, setOpenMenuId, onViewResults, onDelete }: SocialProfileCardProps) {
    return (
        <Card className="border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group">
            <CardContent className="p-6">
                {/* Card Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-bold ${profile.avatarColor}`}>
                            {profile.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-base">{profile.name}</h3>
                            <p className="text-xs font-medium text-slate-400 mt-0.5">{profile.loanId}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === String(profile.id) ? null : String(profile.id));
                            }}
                            className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <MoreHorizontal className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        </button>

                        {openMenuId === String(profile.id) && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => onViewResults(profile.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Search className="h-4 w-4 text-slate-400" />
                                    View Search Results
                                </button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button
                                    onClick={() => {
                                        onDelete(String(profile.id));
                                        setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                    <Users className="h-4 w-4 text-rose-400" />
                                    Delete Borrower
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Risk Badge - Moved below header to match visual flow */}
                <div className="mb-6">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${profile.risk.style}`}>
                        {profile.risk.label}
                    </span>
                </div>

                {/* Contact Details */}
                <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                        <Phone className="h-4 w-4 text-slate-300" />
                        <span>{profile.phone}</span>
                    </div>
                    {profile.email && (
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <Mail className="h-4 w-4 text-slate-300" />
                            <span className="truncate">{profile.email}</span>
                        </div>
                    )}
                    {profile.location && (
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <MapPin className="h-4 w-4 text-slate-300" />
                            <span className="truncate">{profile.location}</span>
                        </div>
                    )}
                </div>

                {/* Amount */}
                <div className="mb-6">
                    <span className="text-2xl font-bold text-slate-800">$ {Number(profile.amount).toLocaleString()}</span>
                </div>

                {/* Social Buttons Footer */}
                <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Social Accounts</p>
                    <div className="flex flex-wrap gap-2">
                        {profile.socials.map((social: any, idx: number) => (
                            <a
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${social.bg} text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-opacity hover:opacity-90`}
                            >
                                <social.icon className="h-3.5 w-3.5" />
                                {social.name}
                                <span className="ml-1 opacity-60 text-[10px]">↗</span>
                            </a>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
