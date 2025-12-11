'use client';

import React from 'react';
import {
  Shield, Key, Bell, Users, MapPin,
  FileText, Save, Eye, EyeOff, Plus, Trash2, AlertTriangle
} from 'lucide-react';
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import {
  useSettingsStore,
  ApiKey,
  NotificationTemplate,
  Webhook,
  GeofencingSettings,
  SettingsState,
} from '@/store/settings.store';

export default function SettingsPage() {
  const {
    activeTab, setActiveTab,
    showApiKey, toggleApiKeyVisibility: toggleShowApiKey,
    roles, apiKeys, webhooks, notificationTemplates, geofencing,
    toggleApiKeyActive, updateGeofencingSetting, toggleWebhookActive
  } = useSettingsStore();

  const updateGeo = (key: keyof GeofencingSettings, value: any) =>
    updateGeofencingSetting(key, value);

  const handleNumber = (key: keyof GeofencingSettings, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) updateGeo(key, val);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Page Header */}
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">Platform Settings</h2>
              <p className="mt-1 text-gray-500 text-lg">Configure access, integrations, and operational parameters</p>
            </div>

            <hr className="border-gray-300" />

            {/* Tabs Navigation */}
            <div className="flex gap-4 border-b border-gray-200 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
              {(
                [
                  { id: "roles", icon: Users, name: "Roles & Permissions" },
                  { id: "api", icon: Key, name: "API Keys" },
                  { id: "webhooks", icon: FileText, name: "Webhooks" },
                  { id: "notifications", icon: Bell, name: "Notifications" },
                  { id: "geofencing", icon: MapPin, name: "Geofencing" },
                ] as { id: SettingsState['activeTab']; icon: any; name: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors duration-150 text-lg font-semibold whitespace-nowrap
                    ${activeTab === tab.id 
                      ? "bg-blue-100 text-blue-700 shadow-inner ring-2 ring-blue-300" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"}`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Roles Tab */}
            {activeTab === "roles" && (
              <section className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">Role-Based Access Control</h3>
                    <p className="text-gray-500">Manage user roles and permissions</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition">
                    <Plus className="w-5 h-5" />
                    Add Role
                  </button>
                </div>

                {/* Roles Table */}
                <table className="w-full divide-y divide-gray-200 text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-sm font-medium text-gray-700">Role</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-700">Permissions</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-700">Users</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-700 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roles.map(role => (
                      <tr key={role.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 flex items-center gap-3 font-medium text-gray-900">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          {role.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.slice(0, 3).map((p, i) => (
                              <span key={i} className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-mono">
                                {p.replace("_", " ")}
                              </span>
                            ))}
                            {role.permissions.length > 3 && (
                              <span className="text-xs bg-gray-300 text-gray-800 px-3 py-1 rounded-full font-mono">
                                +{role.permissions.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{role.users} users</td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-blue-600 hover:underline font-semibold transition">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* API Keys Tab */}
            {activeTab === "api" && (
              <section className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">Signzy API Keys</h3>
                    <p className="text-gray-500">Manage integration credentials</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition">
                    <Plus className="w-5 h-5" />
                    Add Key
                  </button>
                </div>

                {apiKeys.map((k, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl shadow-sm">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Key className="w-6 h-6 text-blue-600" />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">{k.name}</p>

                        <div className="flex gap-3 items-center mt-1">
                          <code className="text-gray-600 select-all font-mono text-sm">
                            {showApiKey ? k.key : "•".repeat(22)}
                          </code>

                          <button onClick={toggleShowApiKey} aria-label="Toggle API Key Visibility" className="focus:outline-none">
                            {showApiKey
                              ? <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-700 transition" />
                              : <Eye className="w-5 h-5 text-gray-500 hover:text-gray-700 transition" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${k.active ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-600"}`}>
                        {k.active ? "Active" : "Inactive"}
                      </span>

                      <input
                        type="checkbox"
                        checked={k.active}
                        onChange={() => toggleApiKeyActive(i)}
                        className="w-6 h-6 rounded cursor-pointer"
                        aria-label={`Toggle ${k.name} key active state`}
                      />
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Webhooks Tab */}
            {activeTab === "webhooks" && (
              <section className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">Webhook Endpoints</h3>
                    <p className="text-gray-500">Real-time event callbacks</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition">
                    <Plus className="w-5 h-5" />
                    Add Webhook
                  </button>
                </div>

                {webhooks.map((w, i) => (
                  <div key={i} className="p-5 border border-gray-200 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono truncate max-w-xs" title={w.url}>
                        {w.url}
                      </code>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${w.active ? "bg-green-100 text-green-700" : "bg-gray-300 text-gray-600"}`}>
                          {w.active ? "Active" : "Inactive"}
                        </span>
                        <input
                          type="checkbox"
                          checked={w.active}
                          onChange={() => toggleWebhookActive(i)}
                          className="w-6 h-6 rounded cursor-pointer"
                          aria-label={`Toggle webhook ${w.url} active state`} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {w.events.map((ev, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-200 text-xs rounded-full font-mono select-none">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <section className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">Notification Templates</h3>
                    <p className="text-gray-500">Email / SMS messages</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition">
                    <Plus className="w-5 h-5" />
                    Add Template
                  </button>
                </div>

                {notificationTemplates.map(t => (
                  <div key={t.id} className="p-5 border border-gray-200 rounded-xl shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <p className="font-semibold text-gray-900">{t.name}</p>
                        <span className="text-xs bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full uppercase font-mono">
                          {t.type}
                        </span>
                      </div>

                      <div className="flex gap-4">
                        <button className="text-blue-600 hover:underline font-semibold transition">Edit</button>
                        <button className="text-red-600 hover:text-red-800 transition" aria-label="Delete Notification Template">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <pre className="bg-gray-50 p-4 rounded font-mono text-sm whitespace-pre-wrap leading-relaxed">{t.template}</pre>
                  </div>
                ))}
              </section>
            )}

            {/* Geofencing Tab */}
            {activeTab === "geofencing" && (
              <section className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold">Agent Geofencing Rules</h3>
                  <p className="text-gray-500">Define location rules & restrictions</p>
                </div>

                <div className="flex items-center p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <AlertTriangle className="w-6 h-6 mr-4 text-yellow-600 shrink-0" />
                  <p className="text-yellow-800 font-medium">These settings impact agent tracking performance.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(
                    [
                      {label: "Maximum Distance from Office (km)", key: "maxDistanceKm"},
                      {label: "Location Update Interval (minutes)", key: "updateIntervalMinutes"},
                      {label: "Mandatory Check-in Radius (meters)", key: "checkinRadiusMeters"},
                      {label: "Offline Alert Threshold (minutes)", key: "offlineAlertThresholdMinutes"},
                    ] as { label: string; key: keyof GeofencingSettings }[]
                  ).map(({label, key}) => (
                    <div key={String(key)}>
                      <label className="block font-medium text-gray-800">{label}</label>
                      <input
                        type="number"
                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                        value={geofencing[key] as number}
                        onChange={e => handleNumber(key, e)}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-6">
                  {(
                    [
                      { key: "requirePhotoProof", title: "Require Photo Proof", desc: "Agents must upload a visit photo." },
                      { key: "gpsSpoofingDetection", title: "GPS Spoofing Detection", desc: "Detect inconsistent location activity." },
                      { key: "autoAssignByLocation", title: "Auto-assign By Location", desc: "Assign new cases to nearest agent." }
                    ] as { key: keyof GeofencingSettings; title: string; desc: string }[]
                  ).map(item => (
                    <div key={String(item.key)} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(geofencing[item.key])}
                        onChange={e => updateGeo(item.key, e.target.checked)}
                        className="w-6 h-6 rounded cursor-pointer"
                        aria-label={`${item.title} toggle`}
                      />
                    </div>
                  ))}
                </div>

                <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition">
                  <Save className="w-5 h-5" />
                  Save Geofencing Rules
                </button>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
