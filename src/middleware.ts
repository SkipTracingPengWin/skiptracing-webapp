import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "@/types/role.types";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("token")?.value;
    const userRole = request.cookies.get("role")?.value as string | undefined;

    // Public routes - allow without authentication
    const publicRoutes = ["/auth/login", "/auth/register", "/forgot-password", "/verify-otp", "/landing"];
    if (publicRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // If no token, redirect to login for all protected paths
    if (!token) {
        // Defines all protected paths
        const protectedPaths = [
            "/dashboard", "/admin", "/manager", "/agent",
            "/borrowers", "/verifications", "/assignments",
            "/skip-trace-map", "/agents", "/recovery-actions",
            "/audit-logs", "/reports", "/settings", "/profile"
        ];

        if (protectedPaths.some(path => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
    }

    // Role-based access control

    // Dashboard sub-routes
    if (pathname.startsWith("/dashboard/admin") && userRole !== Role.ADMIN) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/manager") && userRole !== Role.MANAGER) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (pathname.startsWith("/dashboard/agent") && userRole !== Role.AGENT) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // New Role Restrictions
    if (pathname.startsWith("/agents")) {
        if (userRole !== Role.ADMIN && userRole !== Role.MANAGER) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    if (pathname.startsWith("/audit-logs")) {
        if (userRole !== Role.ADMIN && userRole !== Role.MANAGER) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    // Note: Reports is assumed to be restricted too, pending confirmation. 
    // Leaving open for now or could restrict to Admin/Manager.
    if (pathname.startsWith("/reports")) {
        if (userRole !== Role.ADMIN && userRole !== Role.MANAGER) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/manager/:path*",
        "/agent/:path*",
        "/auth/:path*",
        "/forgot-password",
        "/verify-otp",
        "/borrowers/:path*",
        "/verifications/:path*",
        "/assignments/:path*",
        "/skip-trace-map/:path*",
        "/agents/:path*",
        "/recovery-actions/:path*",
        "/audit-logs/:path*",
        "/reports/:path*",
        "/settings/:path*",
        "/profile/:path*"
    ],
}; 