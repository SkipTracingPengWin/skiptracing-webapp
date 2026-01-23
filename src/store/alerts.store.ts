import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Alert } from '@/types';
import { alertService } from '@/services/alert.services';

interface AlertState {
    alerts: Alert[];
    fetchAlerts: () => Promise<void>;
    markAlertAsRead: (id: string | number) => Promise<void>;
    addAlert: (alert: Partial<Alert>) => Promise<void>;
    deleteAlert: (id: string | number) => Promise<void>;
}

export const useAlertStore = create<AlertState>()(
    devtools(
        (set, get) => ({
            alerts: [],
            fetchAlerts: async () => {
                try {
                    const data = await alertService.getAll();
                    set({ alerts: data });
                } catch (error) {
                    console.error('Failed to fetch alerts:', error);
                }
            },
            markAlertAsRead: async (id) => {
                try {
                    await alertService.update(id, { read: true });
                    set((state) => ({
                        alerts: state.alerts.map((a) =>
                            a.id === id ? { ...a, read: true } : a
                        ),
                    }));
                } catch (error) {
                    console.error('Failed to mark alert as read:', error);
                }
            },
            addAlert: async (alert) => {
                try {
                    const newAlert = await alertService.create(alert);
                    set((state) => ({
                        alerts: [...state.alerts, newAlert],
                    }));
                } catch (error) {
                    console.error('Failed to add alert:', error);
                }
            },
            deleteAlert: async (id) => {
                try {
                    await alertService.delete(id);
                    set((state) => ({
                        alerts: state.alerts.filter((a) => a.id !== id),
                    }));
                } catch (error) {
                    console.error('Failed to delete alert:', error);
                }
            },
        }),
        { name: 'AlertStore' }
    )
);