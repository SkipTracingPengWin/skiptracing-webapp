// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//     LayoutDashboard,
//     Users,
//     Shield,
//     MapPin,
//     UserCircle,
//     Activity,
//     FileText,
//     BarChart3,
//     Settings,
//     LogOut
// } from "lucide-react";

// const menuItems = [
//     { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
//     { icon: Users, label: "Borrowers", href: "/borrowers" },
//     { icon: Shield, label: "Verifications", href: "/verifications" },
//     { icon: Activity, label: "Assignments", href: "/assignments" },
//     { icon: MapPin, label: "Skip Trace Map", href: "/skip-trace-map" },
//     { icon: UserCircle, label: "Agents", href: "/agents" },
//     { icon: Activity, label: "Recovery Actions", href: "/recovery-actions" },
//     { icon: FileText, label: "Compliance Logs", href: "/audit-logs" },
//     { icon: BarChart3, label: "Reports", href: "/reports" },
//     { icon: Settings, label: "Settings", href: "/settings" },
// ];

// export default function Sidebar() {
//     const pathname = usePathname();

//     return (
//         <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0">
//             {/* Logo */}
//             <div className="p-4 border-b border-slate-200">
//                 <Link href="/dashboard" className="flex items-center gap-2">
//                     <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
//                         <Shield className="h-5 w-5 text-white" />
//                     </div>
//                     <span className="text-lg font-bold text-slate-900">SkipTrace<span className="text-blue-600">AI</span></span>
//                 </Link>
//             </div>

//             {/* Menu Items */}
//             <nav className="flex-1 overflow-y-auto py-4">
//                 {menuItems.map((item) => {
//                     const Icon = item.icon;
//                     const isActive = pathname === item.href;

//                     return (
//                         <Link
//                             key={item.href}
//                             href={item.href}
//                             className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${isActive
//                                 ? "bg-blue-50 text-blue-600"
//                                 : "text-slate-600 hover:bg-slate-50"
//                                 }`}
//                         >
//                             <Icon className="h-5 w-5" />
//                             <span className="text-sm font-medium">{item.label}</span>
//                         </Link>
//                     );
//                 })}
//             </nav>

//             {/* Logout */}
//             <div className="p-4 border-t border-slate-200">
//                 <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
//                     <LogOut className="h-5 w-5" />
//                     <span className="text-sm font-medium">Logout</span>
//                 </button>
//             </div>
//         </div>
//     );
// }



"use client";

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
  ClipboardList
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
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push('/auth/login');
  };

  const getDashboardLink = () => {
    if (!user?.role) return '/dashboard';
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
        ];
      default:
        // Guest / Fallback
        return [dashboardItem];
    }
  };

  const menuItems = getRoleBasedMenu();

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0">
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
          // Special handling for Dashboard link to match subpaths
          let isActive = false;

          if (item.label === "Dashboard") {
            isActive = pathname.startsWith('/dashboard');
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
  );
}
