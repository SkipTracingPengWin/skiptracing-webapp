"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Facebook, Instagram, Twitter, Linkedin, Users, TrendingUp,
  Phone, Mail, MoreHorizontal, ArrowRight, ArrowLeft, MapPin
} from "lucide-react";
import FindBySocialMediaModal from "@/components/socialmedia/findbysocialmedia.modal";
import SocialMediaResultsModal from "@/components/socialmedia/socialmediaresult.modal";
import { useBorrowerStore } from "@/store/borrowers.store";
import { useSocialProfilesStore } from "@/store/socialmedia.store";
import type { Borrower } from "@/types";

// Helper to generate social buttons based on relatedLinks and searchResults
const getSocialProfiles = (borrower: Borrower, searchResults: any[] = []) => {
  const supportedPlatforms = [
    {
      name: 'Instagram',
      icon: Instagram,
      bg: "bg-gradient-to-r from-pink-500 to-rose-500",
      urlTemplate: (handle: string) => `https://instagram.com/${handle}`,
      matchKeys: ['instagram']
    },
    {
      name: 'Facebook',
      icon: Facebook,
      bg: "bg-blue-600",
      urlTemplate: (handle: string) => `https://facebook.com/${handle}`,
      matchKeys: ['facebook']
    },
    {
      name: 'Twitter',
      icon: Twitter,
      bg: "bg-sky-500",
      urlTemplate: (handle: string) => `https://twitter.com/${handle}`,
      matchKeys: ['twitter', 'x.com']
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      bg: "bg-blue-700",
      urlTemplate: (handle: string) => `https://linkedin.com/in/${handle}`,
      matchKeys: ['linkedin']
    }
  ];

  const profiles: any[] = [];

  supportedPlatforms.forEach(platform => {
    // 1. Check Search Results First
    let linkUrl = "";

    if (searchResults && searchResults.length > 0) {
      const searchMatch = searchResults.find(r =>
        platform.matchKeys.some(key => r.platform.toLowerCase().includes(key)) ||
        platform.matchKeys.some(key => r.source?.toLowerCase().includes(key)) ||
        (r.link && platform.matchKeys.some(key => r.link.toLowerCase().includes(key)))
      );
      if (searchMatch) {
        linkUrl = searchMatch.link || searchMatch.url;
      }
    }

    // 2. Fallback to existing relatedLinks if no search result found
    if (!linkUrl && borrower.relatedLinks && borrower.relatedLinks.length > 0) {
      const relatedMatch = borrower.relatedLinks.find(l =>
        platform.matchKeys.some(key => l.platform.toLowerCase().includes(key))
      );
      if (relatedMatch) {
        linkUrl = relatedMatch.url;
      }
    }

    if (linkUrl) {
      profiles.push({
        name: platform.name,
        icon: platform.icon,
        bg: platform.bg,
        href: linkUrl
      });
    }
  });

  return profiles;
};

export default function SocialMediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultsModalOpen, setResultsModalOpen] = useState(false);
  const [resultBorrower, setResultBorrower] = useState<Borrower | null>(null);

  const { borrowers, getBorrowerById } = useBorrowerStore();
  const { selectedBorrowerIds, addSelectedBorrower, removeSelectedBorrower, searchResults } = useSocialProfilesStore();

  // Load selected borrowers data
  useEffect(() => {
    selectedBorrowerIds.forEach(async (id) => {
      const exists = borrowers.find(b => String(b.id) === String(id));
      if (!exists) {
        const result = await getBorrowerById(id);
        if (!result) {
          console.warn(`⚠️ Borrower ${id} not found, removing from selection.`);
          removeSelectedBorrower(id);
        }
      }
    });
  }, [selectedBorrowerIds, getBorrowerById, borrowers, removeSelectedBorrower]);
  // Handle borrower selection from modal
  const handleBorrowerSelect = (borrower: Borrower) => {
    addSelectedBorrower(String(borrower.id));
    setResultBorrower(borrower);
    setResultsModalOpen(true);
  };

  // Get current selected borrowers data from the store based on persisted IDs
  const activeBorrowersData = useMemo(() => {
    // Reverse the array to show the last added borrower first
    return [...selectedBorrowerIds]
      .reverse()
      .map(id => borrowers.find(b => String(b.id) === String(id)))
      .filter((b): b is Borrower => b !== undefined);
  }, [selectedBorrowerIds, borrowers]);

  // Process selected borrowers into profile format
  const profiles = useMemo(() => {
    return activeBorrowersData.map((borrower: Borrower, index: number) => {
      const getRiskStyle = (risk: string) => {
        switch (risk) {
          case "Low": return "bg-emerald-100 text-emerald-600";
          case "Medium": return "bg-amber-100 text-amber-600";
          case "High": return "bg-orange-100 text-orange-600";
          case "Critical": return "bg-rose-100 text-rose-600";
          default: return "bg-slate-100 text-slate-600";
        }
      };

      // Get search results for this specific borrower
      const borrowerSearchResults = searchResults[String(borrower.id)] || [];

      return {
        id: borrower.id,
        loanId: borrower.loanId || `LN-2024-${String(index + 1).padStart(3, '0')}`,
        name: borrower.name,
        phone: borrower.phone,
        email: borrower.email,
        location: borrower.location,
        amount: borrower.amount || 0,
        risk: {
          label: `${borrower.risk || (borrower.verified ? "Low" : "Medium")} Risk`,
          style: getRiskStyle(borrower.risk || (borrower.verified ? "Low" : "Medium"))
        },
        avatarColor: ["bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-pink-100 text-pink-600"][index % 3],
        socials: getSocialProfiles(borrower, borrowerSearchResults)
      };
    }).filter((p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.loanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeBorrowersData, searchQuery, searchResults]);

  // Top Stats Data
  const stats = useMemo(() => {
    // Calculate stats based on the processed profiles, which include search results
    const hasSocial = profiles.filter(p => p.socials.length > 0).length;

    // Helper to count profiles that have a specific social platform
    const countPlatform = (name: string) =>
      profiles.filter(p => p.socials.some((s: any) => s.name === name)).length;

    const instaCount = countPlatform('Instagram');
    const fbCount = countPlatform('Facebook');
    const twitterCount = countPlatform('Twitter');
    const linkedinCount = countPlatform('LinkedIn');

    return [
      { label: "Total", value: profiles.length, icon: Users, color: "text-gray-800", bg: "bg-white border border-slate-100" },
      { label: "With Social", value: hasSocial, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Instagram", value: instaCount, icon: Instagram, color: "text-pink-600", bg: "bg-pink-50" },
      { label: "Twitter", value: twitterCount, icon: Twitter, color: "text-sky-500", bg: "bg-sky-50" },
      { label: "Facebook", value: fbCount, icon: Facebook, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "LinkedIn", value: linkedinCount, icon: Linkedin, color: "text-indigo-600", bg: "bg-indigo-50" },
    ];
  }, [profiles]);

  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col overflow-hidden bg-slate-50/50">
        <Header />

        <main className="flex-1 overflow-y-auto p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">Social Accounts</h1>
              <p className="text-slate-500 text-sm">View and access borrower social media profiles</p>
            </div>

            <div className="flex items-end gap-4 w-full md:w-auto">
              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, loan ID, or phone..."
                    className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-slate-300 shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-2xl text-sm font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 flex items-center gap-2 whitespace-nowrap"
              >
                Find by Social Media
              </button>
            </div>
          </div>

          {/* Stats / Filter Row */}
          <div className="flex flex-wrap gap-3 mb-10">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.bg} flex-1 min-w-[120px] rounded-2xl p-4 flex flex-col justify-between items-start min-h-[100px] transition-transform hover:-translate-y-1 duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color}`} />}
                  {!stat.icon && <div className="h-4 w-4" />} {/* Spacer */}
                  <span className={`text-xs font-medium ${stat.color === 'text-gray-800' ? 'text-slate-500' : stat.color}`}>
                    {stat.label}
                  </span>
                </div>
                <span className="text-2xl font-bold text-slate-800">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Borrower Cards Grid */}
          <div className="relative">
            {/* Decorative Navigation Arrows (Visual only based on screenshot) */}
            <button className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hidden xl:block">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hidden xl:block">
              <ArrowRight className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No Borrowers Selected</h3>
                  <p className="text-slate-500 mb-6">Click "Find by Social Media" to search and select borrowers</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 inline-flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Find by Social Media
                  </button>
                </div>
              ) : (
                profiles.map((profile: any) => (
                  <Card key={profile.id} className="border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white group">
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
                        <div className="flex flex-col items-end gap-2">
                          <MoreHorizontal className="h-5 w-5 text-slate-300 cursor-pointer hover:text-slate-500" />
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
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Find by Social Media Moal */}
      <FindBySocialMediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBorrowerSelect={handleBorrowerSelect}
      />

      {/* Results Popup */}
      <SocialMediaResultsModal
        isOpen={resultsModalOpen}
        onClose={() => setResultsModalOpen(false)}
        borrower={resultBorrower}
        socials={resultBorrower ? getSocialProfiles(resultBorrower, searchResults[String(resultBorrower.id)]) : []}
      />
    </div>
  );
}