// components/ui/index.tsx
"use client";

import React from "react";

/* ------------------ UI TYPES ------------------ */
export type UIProps = { children?: React.ReactNode; className?: string };

/* ------------------ BUTTON ------------------ */
export const Button: React.FC<
  UIProps & { variant?: "ghost" | "outline" | "default"; size?: "icon" | "sm" | "md" }
> = ({ children, className = "", variant = "default", size = "md" }) => (
  <button
    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors
      ${
        variant === "ghost"
          ? "bg-transparent hover:bg-slate-100"
          : variant === "outline"
          ? "border border-slate-300 hover:bg-slate-50"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }
      ${
        size === "icon"
          ? "p-2"
          : size === "sm"
          ? "px-2 py-1 text-sm"
          : ""
      }
      ${className}`}
  >
    {children}
  </button>
);

/* ------------------ CARD ------------------ */
export const Card: React.FC<UIProps> = ({ children, className = "" }) => (
  <div className={`rounded-xl bg-white border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<UIProps> = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-slate-100 ${className}`}>{children}</div>
);

export const CardTitle: React.FC<UIProps> = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-slate-900 ${className}`}>{children}</h3>
);

export const CardContent: React.FC<UIProps> = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

/* ------------------ BADGE ------------------ */
export const Badge: React.FC<UIProps> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

/* ------------------ PROGRESS ------------------ */
export const Progress: React.FC<{ value: number; className?: string }> = ({
  value,
  className = "",
}) => (
  <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${className}`}>
    <div
      className="h-2 rounded-full bg-linear-to-r from-blue-500 to-sky-600 transition-all duration-300"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);
