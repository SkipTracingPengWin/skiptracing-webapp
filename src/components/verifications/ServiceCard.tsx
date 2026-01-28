import React from 'react';
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ServiceCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    color: string;
    onClick: () => void;
}

export default function ServiceCard({ icon: Icon, title, description, color, onClick }: ServiceCardProps) {
    return (
        <button
            onClick={onClick}
            className="group bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all text-left relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0">
                <ChevronRight className="h-5 w-5 text-blue-500" />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 duration-300", color)}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
        </button>
    );
}
