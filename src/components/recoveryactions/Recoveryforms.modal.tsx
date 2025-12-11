

// "use client";

// import { useState } from "react";
// // We no longer need the separate Calendar icon import for the date field since we use native 'datetime-local'
// import { X } from "lucide-react"; 

// // --- Helper component for the dropdown/select field (Enhanced UI) ---
// function SelectField({ label, options, isRequired = false, ...props }: any) {
//     return (
//         <div className="mb-4">
//             <label className="block text-sm font-semibold text-slate-800 mb-1">
//                 {label} {isRequired && <span className="text-red-500">*</span>}
//             </label>
//             <div className="relative">
//                 <select
//                     // Enhanced styling for attractiveness
//                     className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150"
//                     {...props}
//                 >
//                     <option value="">{`Select a ${label.toLowerCase().replace(' *', '')}`}</option>
//                     {options.map((option: any) => (
//                         // Ensure options are handled correctly, checking for 'text' or 'name' property
//                         <option key={option.id} value={option.id}>
//                             {option.name || option.text}
//                         </option>
//                     ))}
//                 </select>
//                 {/* Custom chevron icon for visual appeal on the select field */}
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // --- Helper component for the date/time field (Using native datetime-local for calendar picker) ---
// function DateTimeField({ label, isRequired = false, ...props }: any) {
//     return (
//         <div className="mb-4">
//             <label className="block text-sm font-semibold text-slate-800 mb-1">
//                 {label} {isRequired && <span className="text-red-500">*</span>}
//             </label>
//             <div className="relative">
//                 <input
//                     // Change type to 'datetime-local' to get a native calendar/time picker UI
//                     type="datetime-local" 
//                     // Remove placeholder, as it interferes with datetime-local format
//                     // Enhanced styling
//                     className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-700"
//                     {...props}
//                 />
//                  {/* The browser will typically show a native calendar icon here. 
//                      We add a light visual cue for modern appeal. */}
//                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
//                     {/* Icon serves as a hint that a picker is available */}
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                 </div>
//             </div>
//         </div>
//     );
// }


// export default function ActionModal({
//     isOpen,
//     onClose,
//     actionId,
//     title,
//     icon,
//     borrowers,
//     agents,
//     // smsTemplates is not used in the form itself, but keep it in the props for completeness if needed later
//     // smsTemplates,
//     onSubmit,
// }: any) {
//     if (!isOpen) return null;

//     // Use a simpler date format initially, 'datetime-local' requires YYYY-MM-DDTHH:mm format.
//     // We'll reset the state structure to match the new datetime-local input
//     const [formData, setFormData] = useState({
//         borrowerId: "",
//         scheduledDate: "", // This will be YYYY-MM-DDTHH:mm
//         agentId: "",
//         priority: "medium", 
//         notes: "",
//     });

//     const handleChange = (e: any) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e: any) => {
//         e.preventDefault();

//         if (!formData.borrowerId || !formData.scheduledDate || !formData.priority) {
//             alert("Please fill in all required fields (*).");
//             return;
//         }

//         // Format the scheduled date for display/storage
//         const dateString = formData.scheduledDate.replace('T', ' '); // YYYY-MM-DD HH:mm

//         // Prepare data for submission 
//         const submittedData = {
//             id: Date.now(),
//             type: title,
//             actionId: actionId,
//             icon: icon.type,
//             borrower: borrowers.find((b: any) => b.id === formData.borrowerId)?.name || "Unassigned Borrower",
//             scheduled: dateString, // Submit the formatted date
//             status: "scheduled",
//             priority: formData.priority,
//             agent: agents.find((a: any) => a.id === formData.agentId)?.name || "Unassigned",
//             outcome: "-",
//             notes: formData.notes,
//         };
        
//         onSubmit(submittedData);
//     };

//     const priorityOptions = [
//         { id: "high", name: "High" },
//         { id: "medium", name: "Medium" },
//         { id: "low", name: "Low" },
//         { id: "urgent", name: "Urgent" },
//     ];
    
//     // Customize the header based on the action clicked
//     let headerColor = "bg-blue-600";
//     if (actionId === 'manual_call') headerColor = "bg-green-600";
//     else if (actionId === 'ivr') headerColor = "bg-purple-600";
//     else if (actionId === 'visit') headerColor = "bg-orange-600";
//     else if (actionId === 'legal') headerColor = "bg-red-600";
//     else if (actionId === 'whatsapp') headerColor = "bg-teal-600"; // Changed green shade for distinction
    
//     return (
//         // Enhanced backdrop and modal animation styling
//         <div className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 opacity-100">
                
//                 {/* Modal Header (More Attractive UI) */}
//                 <div className="flex items-center p-5 border-b border-slate-100">
//                     <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${headerColor} shadow-lg shadow-black/20`}>
//                         <span className="text-white h-5 w-5">{icon}</span>
//                     </div>
//                     <h2 className="text-xl font-extrabold text-slate-900 flex-1">{title} Action</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="p-2 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors"
//                         aria-label="Close"
//                     >
//                         <X className="h-5 w-5" />
//                     </button>
//                 </div>

//                 {/* Modal Body (Unified Form) */}
//                 <form onSubmit={handleSubmit} className="p-6">

//                     {/* Select Borrower * (Required) */}
//                     <SelectField
//                         label="Select Borrower"
//                         name="borrowerId"
//                         options={borrowers}
//                         value={formData.borrowerId}
//                         onChange={handleChange}
//                         isRequired
//                     />

//                     {/* Schedule Date & Time * (Required) */}
//                     <DateTimeField
//                         label="Schedule Date & Time"
//                         name="scheduledDate"
//                         value={formData.scheduledDate}
//                         onChange={handleChange}
//                         isRequired
//                     />

//                     {/* Assign Agent (Optional) */}
//                     <SelectField
//                         label="Assign Agent (optional)"
//                         name="agentId"
//                         options={agents}
//                         value={formData.agentId}
//                         onChange={handleChange}
//                     />
                    
//                     {/* Priority * (Required) */}
//                     <div className="mb-4">
//                         <label className="block text-sm font-semibold text-slate-800 mb-1">
//                             Priority <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="priority"
//                             value={formData.priority}
//                             onChange={handleChange}
//                             // Enhanced styling for attractiveness
//                             className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150"
//                         >
//                             {priorityOptions.map((p) => (
//                                 <option key={p.id} value={p.id}>
//                                     {p.name}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     {/* Notes */}
//                     <div className="mb-6">
//                         <label className="block text-sm font-semibold text-slate-800 mb-1">
//                             Notes
//                         </label>
//                         <textarea
//                             name="notes"
//                             placeholder="Add any notes or instructions..."
//                             rows={3}
//                             value={formData.notes}
//                             onChange={handleChange}
//                             // Enhanced styling
//                             className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-150"
//                         ></textarea>
//                     </div>

//                     {/* Action Buttons (Styled) */}
//                     <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-[1.01]"
//                         >
//                             Create Action
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { X } from "lucide-react";

// --- Generic text input field (simple) ---
function TextField({ label, isRequired = false, ...props }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-800 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-700"
        {...props}
      />
    </div>
  );
}

// --- Helper component for the dropdown/select field (Enhanced UI) ---
function SelectField({ label, options, isRequired = false, ...props }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-800 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-whiteshadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150"
          {...props}
        >
          <option value="">
            {`Select a ${label.toLowerCase().replace(" *", "")}`}
          </option>
          {options.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.name || option.text}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function ActionModal({
  isOpen,
  onClose,
  actionId,
  title,
  icon,
  borrowers,
  agents,
  onSubmit,
}: any) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    borrowerId: "",
    scheduledDate: "", // treat as plain text now
    agentId: "",
    priority: "medium",
    notes: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!formData.borrowerId || !formData.scheduledDate || !formData.priority) {
      alert("Please fill in all required fields (*).");
      return;
    }

    const submittedData = {
      id: Date.now(),
      type: title,
      actionId: actionId,
      icon: icon.type,
      borrower:
        borrowers.find((b: any) => b.id === formData.borrowerId)?.name ||
        "Unassigned Borrower",
      scheduled: formData.scheduledDate, // plain string from input
      status: "scheduled",
      priority: formData.priority,
      agent:
        agents.find((a: any) => a.id === formData.agentId)?.name ||
        "Unassigned",
      outcome: "-",
      notes: formData.notes,
    };

    onSubmit(submittedData);
  };

  const priorityOptions = [
    { id: "high", name: "High" },
    { id: "medium", name: "Medium" },
    { id: "low", name: "Low" },
    { id: "urgent", name: "Urgent" },
  ];

  let headerColor = "bg-blue-600";
  if (actionId === "manual_call") headerColor = "bg-green-600";
  else if (actionId === "ivr") headerColor = "bg-purple-600";
  else if (actionId === "visit") headerColor = "bg-orange-600";
  else if (actionId === "legal") headerColor = "bg-red-600";
  else if (actionId === "whatsapp") headerColor = "bg-teal-600";

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex items-center p-5 border-b border-slate-100">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${headerColor} shadow-lg shadow-black/20`}
          >
            <span className="text-white h-5 w-5">{icon}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 flex-1">
            {title} Action
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <SelectField
            label="Select Borrower"
            name="borrowerId"
            options={borrowers}
            value={formData.borrowerId}
            onChange={handleChange}
            isRequired
          />

          {/* Schedule Date & Time as plain text, like previous forms */}
          <TextField
            label="Schedule Date & Time"
            name="scheduledDate"
            placeholder="YYYY-MM-DD HH:mm"
            value={formData.scheduledDate}
            onChange={handleChange}
            isRequired
          />

          <SelectField
            label="Assign Agent (optional)"
            name="agentId"
            options={agents}
            value={formData.agentId}
            onChange={handleChange}
          />

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150"
            >
              {priorityOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-800 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              placeholder="Add any notes or instructions..."
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition duration-150"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-[1.01]"
            >
              Create Action
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
