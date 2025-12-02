import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Alert } from '@/types';

const alertsData: Alert[] = [
    {
        id: 1,
        title: "High Risk Borrower Detected",
        description: "Borrower Amit Kumar has missed 3 consecutive payments.",
        type: "danger",
        action: "View Case",
        timestamp: "2 hours ago",
        read: false
    },
    {
        id: 2,
        title: "New Assignment",
        description: "You have been assigned a new case: Priya Patel",
        type: "info",
        action: "View Assignment",
        timestamp: "5 hours ago",
        read: true
    }
];

interface AlertState {
    alerts: Alert[];
    markAlertAsRead: (id: number) => void;
    addAlert: (alert: Alert) => void;
    deleteAlert: (id: number) => void;
}

export const useAlertStore = create<AlertState>()(
    devtools(
        (set) => ({
            alerts: alertsData,
            markAlertAsRead: (id) =>
                set((state) => ({
                    alerts: state.alerts.map((a) =>
                        a.id === id ? { ...a, read: true } : a
                    ),
                })),
            addAlert: (alert) =>
                set((state) => ({
                    alerts: [...state.alerts, alert],
                })),
            deleteAlert: (id) =>
                set((state) => ({
                    alerts: state.alerts.filter((a) => a.id !== id),
                })),
        }),
        { name: 'AlertStore' }
    )
);
