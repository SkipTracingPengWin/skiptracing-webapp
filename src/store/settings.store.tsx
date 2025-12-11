import { create } from "zustand";

// ---------- Types ---------- //

export type Role = {
  id: string;
  name: string;
  permissions: string[];
  users: number;
};

export type ApiKey = {
  name: string;
  key: string;
  active: boolean;
};

export type Webhook = {
  url: string;
  events: string[];
  active: boolean;
};

export type NotificationTemplate = {
  id: string;
  name: string;
  type: "sms" | "email";
  template: string;
};

export type GeofencingSettings = {
  maxDistanceKm: number;
  updateIntervalMinutes: number;
  checkinRadiusMeters: number;
  offlineAlertThresholdMinutes: number;
  requirePhotoProof: boolean;
  gpsSpoofingDetection: boolean;
  autoAssignByLocation: boolean;
};

export interface SettingsState {
  activeTab: "roles" | "api" | "webhooks" | "notifications" | "geofencing";
  showApiKey: boolean;

  roles: Role[];
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  notificationTemplates: NotificationTemplate[];
  geofencing: GeofencingSettings;

  setActiveTab: (tab: SettingsState["activeTab"]) => void;
  toggleApiKeyVisibility: () => void;
  toggleApiKeyActive: (index: number) => void;
  toggleWebhookActive: (index: number) => void;
  updateGeofencingSetting: (key: keyof GeofencingSettings, value: any) => void;
}

// ---------- Initial Data ---------- //

const initialRoles: Role[] = [
  { id: "1", name: "Admin", permissions: ["all"], users: 3 },
  {
    id: "2",
    name: "Verifier",
    permissions: ["view_borrowers", "run_verification", "view_reports"],
    users: 5,
  },
  {
    id: "3",
    name: "Agent",
    permissions: ["view_assigned", "update_status", "log_visits"],
    users: 12,
  },
  {
    id: "4",
    name: "Auditor",
    permissions: ["view_logs", "export_data", "view_reports"],
    users: 2,
  },
];

const initialApiKeys: ApiKey[] = [
  { name: "Signzy Production", key: "sk_live_xxxxxxxxxxxxx", active: true },
  { name: "Signzy Sandbox", key: "sk_test_xxxxxxxxxxxxx", active: false },
];

const initialWebhooks: Webhook[] = [
  {
    url: "https://api.company.com/webhooks/verification",
    events: ["verification.complete"],
    active: true,
  },
  {
    url: "https://api.company.com/webhooks/recovery",
    events: ["recovery.action"],
    active: true,
  },
];

const initialNotificationTemplates: NotificationTemplate[] = [
  {
    id: "1",
    name: "Payment Reminder",
    type: "sms",
    template: "Dear {name}, your EMI of ₹{amount} is due...",
  },
  {
    id: "2",
    name: "Visit Scheduled",
    type: "sms",
    template: "Dear {name}, our representative will visit...",
  },
  {
    id: "3",
    name: "Legal Notice",
    type: "email",
    template: "Subject: Legal Notice for Loan Account {loan_id}...",
  },
];

const initialGeofencing: GeofencingSettings = {
  maxDistanceKm: 50,
  updateIntervalMinutes: 15,
  checkinRadiusMeters: 100,
  offlineAlertThresholdMinutes: 30,
  requirePhotoProof: true,
  gpsSpoofingDetection: true,
  autoAssignByLocation: false,
};

// ---------- Zustand Store ---------- //

export const useSettingsStore = create<SettingsState>((set) => ({
  activeTab: "roles",
  showApiKey: false,

  roles: initialRoles,
  apiKeys: initialApiKeys,
  webhooks: initialWebhooks,
  notificationTemplates: initialNotificationTemplates,
  geofencing: initialGeofencing,

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleApiKeyVisibility: () =>
    set((s) => ({ showApiKey: !s.showApiKey })),

  toggleApiKeyActive: (index) =>
    set((state) => {
      const updated = [...state.apiKeys];
      updated[index].active = !updated[index].active;
      return { apiKeys: updated };
    }),

  toggleWebhookActive: (index) =>
    set((state) => {
      const updated = [...state.webhooks];
      updated[index].active = !updated[index].active;
      return { webhooks: updated };
    }),

  updateGeofencingSetting: (key, value) =>
    set((state) => ({
      geofencing: { ...state.geofencing, [key]: value },
    })),
}));

