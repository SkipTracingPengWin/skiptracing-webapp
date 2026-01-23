"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
}

const routeTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/borrowers": "Borrower Management",
  "/verifications": "Verifications",
  "/assignments": "Agent Assignments",
  "/skip-trace-map": "Skip Trace Map",
  "/agents": "Agents",
  "/recovery-actions": "Recovery Actions",
  "/audit-logs": "Compliance Logs",
  "/reports": "Reports",
  "/settings": "Settings",
};

import { useAuthStore } from "@/store/auth.store";

export default function Header({ title }: HeaderProps) {
  const [openUser, setOpenUser] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement | null>(null);
  const notifDropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const currentTitle = title || routeTitleMap[pathname] || "SkipTraceAI";

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target as Node)
      ) {
        setOpenUser(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(e.target as Node)
      ) {
        setOpenNotif(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSettings = () => {
    setOpenUser(false);
    router.push("/settings");
  };

  const handleLogout = () => {
    setOpenUser(false);
    logout(); // Clear store state
    router.push("/auth/login");
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex items-center justify-between ml-0 md:ml-0">
      {/* LEFT: Route Title - with left padding for hamburger on mobile */}
      <div className="flex-1 pl-12 md:pl-0">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{currentTitle}</h1>
      </div>

      {/* RIGHT: Search + Notifications + User */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Bar - hidden on mobile */}
        <div className="relative hidden sm:block w-40 md:w-56 lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setOpenNotif((p) => !p)}
            className="relative p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* ... keeping notification content the same ... */}
          {openNotif && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">
                  Notifications
                </div>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  2 new
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto py-2">
                {/* Item 1 */}
                <button className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="text-sm text-slate-900">
                      New verification pending
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">5m ago</div>
                  </div>
                </button>

                {/* Item 2 */}
                <button className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="text-sm text-slate-900">
                      Agent location updated
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">12m ago</div>
                  </div>
                </button>

                {/* Item 3 */}
                <button className="w-full text-left px-4 py-3 hover:bg-slate-50 flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                  <div>
                    <div className="text-sm text-slate-900">
                      SLA alert: Case #2341
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">1h ago</div>
                  </div>
                </button>
              </div>

              <div className="px-4 py-2 border-t border-slate-200">
                <button className="text-xs font-medium text-blue-600 hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setOpenUser((prev) => !prev)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg py-1"
          >
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user ? getInitials(user.name) : "G"}
              </span>
            </div>

            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-slate-900">
                {user ? user.name : "Guest User"}
              </div>
              <div className="text-xs text-slate-500">
                {user ? user.role : "Guest"}
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {openUser && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-md py-2 z-50">
              <button
                onClick={() => {
                  setOpenUser(false);
                  router.push("/profile");
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
              >
                Profile
              </button>


              <button
                onClick={handleSettings}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

