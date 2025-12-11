"use client";

import { useEffect, useRef } from "react";
import { Eye, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onView: (id?: string) => void;
    onEdit: () => void;
    onDelete: () => void;
    position: { top: number; left: number };
}

export default function ActionMenu({
    isOpen,
    onClose,
    onView,
    onEdit,
    onDelete,
    position,
}: Props) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleView = () => {
        // Let the parent component handle the navigation logic
        onView();
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="absolute z-50 bg-white shadow-xl rounded-lg border w-40 py-2"
            style={{ top: position.top, left: position.left }}
        >
            <button
                onClick={handleView}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 text-sm"
            >
                <Eye className="h-4 w-4" /> View Profile
            </button>

            <button
                onClick={onEdit}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100 text-sm"
            >
                <Edit className="h-4 w-4" /> Edit
            </button>

            <button
                onClick={onDelete}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-sm text-red-600"
            >
                <Trash className="h-4 w-4" /> Delete
            </button>
        </div>
    );
}
