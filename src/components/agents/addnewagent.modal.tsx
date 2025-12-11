"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

// Define the component props (useful if this component were nested)
type AddNewAgentFormProps = {
  onClose?: () => void; // Function to close the modal/dialog
  onSubmit?: (data: AgentFormData) => void;
};

// Define the form data structure using TypeScript interface
interface AgentFormData {
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
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


const AddNewAgentForm: React.FC<AddNewAgentFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AgentFormData>({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Agent Data Submitted:', formData);
    if (onSubmit) {
      onSubmit(formData);
    }
    // Optionally close the form after submission
    if (onClose) {
      onClose();
    }
  };

  return (
    // Outer container to simulate the modal/dialog appearance
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-black/50 backdrop-blur-sm bg-opacity-40 p-4">
      
      {/* Form Card/Content */}
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            Add New Agent
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <FormInput
            label="Full Name"
            name="fullName"
            placeholder="Enter full name"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
          
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="Enter email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          
          <FormInput
            label="Employee ID"
            name="employeeId"
            placeholder="Enter employee ID"
            value={formData.employeeId}
            onChange={handleChange}
          />
          
          {/* Footer/Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-600/50 hover:bg-sky-700 transition"
            >
              Add Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Example usage in a parent component (e.g., in ReportsPage)
/*
const ParentComponent = () => {
    const [isModalOpen, setIsModalOpen] = useState(true); // Set to true for demonstration

    if (!isModalOpen) return null;

    return (
        <AddNewAgentForm
            onClose={() => setIsModalOpen(false)}
            onSubmit={(data) => console.log("Final Data:", data)}
        />
    );
};
*/

export default AddNewAgentForm;