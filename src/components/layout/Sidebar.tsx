"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  Globe,
  MapPin,
  UserCircle,
  Activity,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import router from "next/router";

// Define all possible menu items
const allMenuItems = {
  dashboard: { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  borrowers: { icon: Users, label: "Borrowers", href: "/borrowers" },
  verifications: { icon: Shield, label: "Verifications", href: "/verifications" },
  assignments: { icon: ClipboardList, label: "Assignments", href: "/assignments" },
  map: { icon: MapPin, label: "Skip Trace Map", href: "/skip-trace-map" },
  socialmedia: { icon: Globe, label: "Social Media", href: "/socialmedia" },
  agents: { icon: UserCircle, label: "Agents", href: "/agents" },
  recovery: { icon: Activity, label: "Recovery Actions", href: "/recovery-actions" },
  logs: { icon: FileText, label: "Compliance Logs", href: "/audit-logs" },
  reports: { icon: BarChart3, label: "Reports", href: "/reports" },
  settings: { icon: Settings, label: "Settings", href: "/settings" },
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  const getDashboardLink = () => {
    if (!user?.role) return "/dashboard";
    return `/dashboard/${user.role.toLowerCase()}`;
  };

  // Filter menu items based on role
  const getRoleBasedMenu = () => {
    const role = user?.role;
    const dashboardItem = { ...allMenuItems.dashboard, href: getDashboardLink() };

    switch (role) {
      case "ADMIN":
        return [
          dashboardItem,
          allMenuItems.borrowers,
          allMenuItems.verifications,
          allMenuItems.assignments,
          allMenuItems.socialmedia,
          allMenuItems.map,
          allMenuItems.agents,
          allMenuItems.recovery,
          allMenuItems.logs,
          allMenuItems.reports,
          allMenuItems.settings,
        ];
      case "MANAGER":
        return [
          dashboardItem,
          allMenuItems.borrowers,
          allMenuItems.verifications,
          allMenuItems.socialmedia,
          allMenuItems.assignments,
          allMenuItems.agents,
          allMenuItems.recovery,
          allMenuItems.reports,
          allMenuItems.settings,
        ];
      case "AGENT":
        return [
          dashboardItem,
          allMenuItems.borrowers,
          allMenuItems.assignments,
          allMenuItems.socialmedia,
          allMenuItems.recovery,
          allMenuItems.agents,
        ];
      default:
        return [dashboardItem];
    }
  };

  const menuItems = getRoleBasedMenu();

  return (
    <>
      {/* Mobile Menu Button - Fixed at top left */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-slate-600" />
        ) : (
          <Menu className="h-6 w-6 text-slate-600" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-slate-200">
          <Link href={getDashboardLink()} className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              SkipTrace<span className="text-blue-600">AI</span>
            </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            let isActive = false;

            if (item.label === "Dashboard") {
              isActive = pathname.startsWith("/dashboard");
            } else {
              isActive = pathname.startsWith(item.href);
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
