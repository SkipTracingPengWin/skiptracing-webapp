"use client";

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Trash2, Save } from 'lucide-react';
import { useAgentStore } from '@/store/agents.store';
import { useAuthStore } from '@/store/auth.store';

// Define the form data structure using TypeScript interface
interface AgentFormData {
  id?: string | number;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  password?: string;
  joinedDate: string;
}

// Custom reusable input component for consistent styling
const FormInput: React.FC<{
  label: string;
  name: keyof AgentFormData;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, placeholder, type = 'text', required = false, value, onChange }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-150"
    />
  </div>
);


const AddNewAgentModal: React.FC = () => {
  const { isAddAgentModalOpen, closeModal, addAgent, updateAgent, deleteAgent, loading, modalMode, selectedAgent } = useAgentStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [formData, setFormData] = useState<AgentFormData>({
    id: '',
    userId: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    joinedDate: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState<string | null>(null);
  console.log("Editing agent full object:", selectedAgent);


  useEffect(() => {
    if (isAddAgentModalOpen && selectedAgent && (modalMode === 'edit' || modalMode === 'delete')) {
      setFormData({
        id: selectedAgent.id,
        userId: selectedAgent.userId, // Capture userId for update payload
        name: selectedAgent.name || '',
        email: selectedAgent.email || '',
        phone: selectedAgent.phone || '',
        location: selectedAgent.location || '',
        password: '', // Clear password field for edit/delete
        joinedDate: selectedAgent.joinedDate ? selectedAgent.joinedDate.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phone: '',
        location: '',
        password: '',
        joinedDate: new Date().toISOString().split('T')[0]
      });
    }
    setError(null);
  }, [isAddAgentModalOpen, selectedAgent, modalMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  console.log("🟢 Submit button clicked");
  console.log("📌 Modal mode:", modalMode);
  console.log("🧾 Form data:", formData);
  console.log("🎯 Selected agent:", selectedAgent);

  try {
    const agentId = formData.id || selectedAgent?.id;
    const userId = formData.userId || selectedAgent?.userId;

    console.log("🆔 Resolved Agent ID:", agentId);
    console.log("👤 Resolved User ID:", userId);

    if (!agentId && modalMode !== "add") {
      throw new Error("Missing Agent ID for operation");
    }

    if (modalMode === "delete" && agentId) {
      console.log("🗑️ DELETE agent request", { agentId });

      if (!isAdmin) {
        throw new Error("Only Administrators or Managers are authorized to delete agents.");
      }

      await deleteAgent(agentId);
      console.log("✅ Agent deleted successfully");
    } 
    else if (modalMode === "edit" && agentId) {
      console.log("✏️ UPDATE agent request");
      console.log("📦 Update payload:", formData);

      await updateAgent(agentId, formData);
      console.log("✅ Agent updated successfully");
    } 
    else {
      console.log("➕ ADD agent request");
      console.log("📦 Create payload:", formData);

      await addAgent(formData);
      console.log("✅ Agent created successfully");
    }

    closeModal();
  } catch (err: any) {
    console.error("❌ Submit failed:", err);
    setError(err.message || "An unexpected error occurred.");
  }
};


  if (!isAddAgentModalOpen) return null;

  const isDeleteMode = modalMode === 'delete';
  const title = isDeleteMode ? 'Delete Agent' : modalMode === 'edit' ? 'Edit Agent' : 'Add New Agent';
  const submitButtonText = isDeleteMode ? 'Delete Agent' : modalMode === 'edit' ? 'Save Changes' : 'Add Agent';
  const submitButtonColor = isDeleteMode ? 'bg-red-600 hover:bg-red-700 shadow-red-600/50' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/50';

  return (
    // Outer container to simulate the modal/dialog appearance
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 backdrop-blur-sm bg-opacity-40 p-4">

      {/* Form Card/Content */}
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="add-agent-title">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 id="add-agent-title" className={`text-xl font-semibold ${isDeleteMode ? 'text-red-600' : 'text-slate-800'}`}>
            {title}
          </h2>
          <button
            onClick={closeModal}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {isDeleteMode ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Are you sure?</h3>
              <p className="mt-2 text-sm text-slate-500">
                Do you really want to delete <span className="font-semibold text-slate-900">{formData.name}</span>? This process cannot be undone.
              </p>
              <div className="mt-4 p-2 bg-slate-50 rounded text-xs text-slate-500 font-mono">
                ID: {selectedAgent?.id}
              </div>
            </div>
          ) : (
            <>
              {modalMode === 'edit' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-500">Agent ID</label>
                  <input
                    type="text"
                    value={selectedAgent?.id || ''}
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 cursor-not-allowed text-sm font-mono"
                  />
                </div>
              )}

              <FormInput
                label="Full Name"
                name="name"
                placeholder="Enter full name"
                required
                value={formData.name || ''}
                onChange={handleChange}
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
                value={formData.email || ''}
                onChange={handleChange}
              />

              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                required
                value={formData.phone || ''}
                onChange={handleChange}
              />

              <FormInput
                label="Location"
                name="location"
                placeholder="Enter location"
                required
                value={formData.location || ''}
                onChange={handleChange}
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                placeholder={modalMode === 'edit' ? "Leave blank to keep unchanged" : "Enter password"}
                required={modalMode === 'add'}
                value={formData.password || ''}
                onChange={handleChange}
              />

              <FormInput
                label="Joined Date"
                name="joinedDate"
                type="date"
                placeholder="Select joined date"
                required
                value={formData.joinedDate || ''}
                onChange={handleChange}
              />
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer/Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed ${submitButtonColor}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAgentModal; 
