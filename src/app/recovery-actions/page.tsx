
// "use client";

// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";
// import { useRecoveryActionsStore } from "@/store/recoveryactionsStore";

// import {
//     MessageSquare,
//     Phone,
//     Video,
//     MapPin,
//     FileText,
//     MessageCircle,
//     MoreVertical,
//     Calendar
// } from "lucide-react";

// import { useState } from "react";
// import ActionModal from "@/components/recoveryactions/Recoveryforms.modal";

// function ActionTypeCard({ icon: Icon, label, color, onClick }: any) {
//     return (
//         <button
//             onClick={onClick}
//             className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center"
//         >
//             <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${color} mx-auto mb-3`}>
//                 <Icon className="h-8 w-8 text-white" />
//             </div>
//             <h3 className="font-semibold text-slate-900">{label}</h3>
//         </button>
//     );
// }

// export default function RecoveryActionsPage() {

//     // ---------------- MODAL ----------------
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [selectedAction, setSelectedAction] = useState<any>(null);

//     const borrowers = [
//         { id: "b1", name: "Ramesh" },
//         { id: "b2", name: "Suresh" }
//     ];

//     const agents = [
//         { id: "a1", name: "Agent Kumar" },
//         { id: "a2", name: "Agent Raju" }
//     ];

//     const smsTemplates = [
//         { id: "t1", text: "Your EMI is pending. Please pay soon." },
//         { id: "t2", text: "Reminder: EMI due today." }
//     ];

//     const { actions, addAction } = useRecoveryActionsStore();


//     // ICON LIST
//     const actionTypes = [
//         { icon: MessageSquare, label: "Send SMS", color: "bg-blue-500", actionId: "sms" },
//         { icon: Phone, label: "Make Call", color: "bg-green-500", actionId: "manual_call" },
//         { icon: Video, label: "IVR Call", color: "bg-purple-500", actionId: "ivr" },
//         { icon: MapPin, label: "Schedule Visit", color: "bg-orange-500", actionId: "visit" },
//         { icon: FileText, label: "Legal Notice", color: "bg-red-500", actionId: "legal" },
//         { icon: MessageCircle, label: "WhatsApp", color: "bg-green-600", actionId: "whatsapp" },
//     ];


//     // STAT CARDS
//     const stats = [
//         { label: "Total Actions", value: `${actions.length}`, color: "text-slate-900" },
//         { label: "Scheduled", value: `${actions.filter(a => a.status === "scheduled").length}`, color: "text-orange-600" },
//         { label: "Completed", value: `${actions.filter(a => a.status === "completed").length}`, color: "text-green-600" },
//         { label: "Urgent", value: `${actions.filter(a => a.priority === "urgent").length}`, color: "text-red-600" },
//     ];

//     const statusColors: any = {
//         completed: "bg-green-100 text-green-700",
//         scheduled: "bg-orange-100 text-orange-700",
//         pending: "bg-slate-100 text-slate-700",
//     };

//     const priorityColors: any = {
//         high: "bg-red-100 text-red-700",
//         medium: "bg-orange-100 text-orange-700",
//         urgent: "bg-red-600 text-white",
//         low: "bg-green-100 text-green-700",
//     };


//     // OPEN MODAL
//     const openActionForm = (action: any) => {
//         setSelectedAction(action);
//         setModalOpen(true);
//     };

//     // SUBMIT
//     const handleSubmit = (data: any) => {
//         addAction(data);
//         setModalOpen(false);
//     };


//     return (
//         <div className="flex h-screen bg-slate-50">
//             <Sidebar />

//             <div className="flex-1 ml-64 flex flex-col overflow-hidden">
//                 <Header />

//                 <main className="flex-1 overflow-y-auto p-6">

//                     {/* TITLE */}
//                     <div className="mb-6">
//                         <h1 className="text-2xl font-bold text-slate-900">Recovery Actions</h1>
//                         <p className="text-sm text-slate-600 mt-1">
//                             Manage SMS, calls, visits, legal notices & WhatsApp followups
//                         </p>
//                     </div>

//                     {/* ACTION ICONS */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//                         {actionTypes.map((type, i) => (
//                             <ActionTypeCard
//                                 key={i}
//                                 {...type}
//                                 onClick={() => openActionForm(type)}
//                             />
//                         ))}
//                     </div>

//                     {/* STATS */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                         {stats.map((stat, i) => (
//                             <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
//                                 <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
//                                 <div className={`text-3xl font-bold ${stat.color}`}>
//                                     {stat.value}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* SEARCH & FILTERS */}
//                     <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
//                         <div className="flex items-center gap-4">
//                             <input
//                                 type="text"
//                                 placeholder="Search by borrower name..."
//                                 className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm"
//                             />
//                             <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
//                                 <option>All Types</option>
//                                 <option>Call</option>
//                                 <option>SMS</option>
//                                 <option>Visit</option>
//                                 <option>Legal Notice</option>
//                                 <option>WhatsApp</option>
//                             </select>
//                             <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
//                                 <option>All Status</option>
//                                 <option>Completed</option>
//                                 <option>Scheduled</option>
//                                 <option>Pending</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* TABLE */}
//                     <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-slate-50 border-b border-slate-200">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Borrower</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Scheduled</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Priority</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Agent</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Outcome</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody className="divide-y divide-slate-200">
//                                     {actions.map((action, i) => {
//                                         const Icon = action.icon;
//                                         return (
//                                             <tr key={i} className="hover:bg-slate-50">
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex items-center gap-2">
//                                                         <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                                             <Icon className="h-4 w-4 text-blue-600" />
//                                                         </div>
//                                                         <span className="text-sm font-medium">{action.type}</span>
//                                                     </div>
//                                                 </td>

//                                                 <td className="px-6 py-4 text-sm">{action.borrower}</td>

//                                                 <td className="px-6 py-4 text-sm flex items-center gap-2">
//                                                     <Calendar className="h-4 w-4" />
//                                                     {action.scheduled}
//                                                 </td>

//                                                 <td className="px-6 py-4">
//                                                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[action.status]}`}>
//                                                         {action.status}
//                                                     </span>
//                                                 </td>

//                                                 <td className="px-6 py-4">
//                                                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[action.priority]}`}>
//                                                         {action.priority}
//                                                     </span>
//                                                 </td>

//                                                 <td className="px-6 py-4 text-sm">{action.agent}</td>

//                                                 <td className="px-6 py-4 text-sm">{action.outcome}</td>

//                                                 <td className="px-6 py-4">
//                                                     <button className="p-2 hover:bg-slate-100 rounded-lg">
//                                                         <MoreVertical className="h-4 w-4" />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </main>

//                 {/* MODAL */}
//                 {isModalOpen && selectedAction && (
//                     <ActionModal
//                         isOpen={isModalOpen}
//                         onClose={() => setModalOpen(false)}
//                         actionId={selectedAction.actionId}
//                         title={selectedAction.label}
//                         icon={<selectedAction.icon />}
//                         accentColor="#3b82f6"
//                         borrowers={borrowers}
//                         agents={agents}
//                         smsTemplates={smsTemplates}
//                         onSubmit={handleSubmit}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }





// RecoveryActionsPage.jsx (Modified to work with the modal)

"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useRecoveryActionsStore } from "@/store/recoveryactionsStore";

import {
    MessageSquare,
    Phone,
    Video,
    MapPin,
    FileText,
    MessageCircle,
    MoreVertical,
    Calendar
} from "lucide-react";

import { useState } from "react";
// Import the new unified modal component
import ActionModal from "@/components/recoveryactions/Recoveryforms.modal"; 

// ... (ActionTypeCard component remains the same)
function ActionTypeCard({ icon: Icon, label, color, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center"
        >
            <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${color} mx-auto mb-3`}>
                <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">{label}</h3>
        </button>
    );
}

export default function RecoveryActionsPage() {

    // ---------------- MODAL STATE ----------------
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedAction, setSelectedAction] = useState<any>(null); // Holds the details of the action clicked

    // MOCK DATA (passed to the modal)
    const borrowers = [
        { id: "b1", name: "Ramesh" },
        { id: "b2", name: "Suresh" },
        { id: "b3", name: "Priya" },
        { id: "b4", name: "Amit" },
    ];

    const agents = [
        { id: "a1", name: "Agent Kumar" },
        { id: "a2", name: "Agent Raju" },
        { id: "a3", name: "Priya Sharma" },
        { id: "a4", name: "Suresh Kumar" },
    ];
    
    // Assuming useRecoveryActionsStore provides an actions array and addAction function
    const { actions, addAction } = useRecoveryActionsStore();


    // ICON LIST (Passes Icon component and label to the modal)
    const actionTypes = [
        { icon: MessageSquare, label: "Send SMS", color: "bg-blue-500", actionId: "sms" },
        { icon: Phone, label: "Make Call", color: "bg-green-500", actionId: "manual_call" },
        { icon: Video, label: "IVR Call", color: "bg-purple-500", actionId: "ivr" },
        { icon: MapPin, label: "Schedule Visit", color: "bg-orange-500", actionId: "visit" },
        { icon: FileText, label: "Legal Notice", color: "bg-red-500", actionId: "legal" },
        { icon: MessageCircle, label: "WhatsApp", color: "bg-green-600", actionId: "whatsapp" },
    ];


    // ... (Stats, StatusColors, PriorityColors remain the same)
    const stats = [
        { label: "Total Actions", value: `${actions.length}`, color: "text-slate-900" },
        { label: "Scheduled", value: `${actions.filter((a: any) => a.status === "scheduled").length}`, color: "text-orange-600" },
        { label: "Completed", value: `${actions.filter((a: any) => a.status === "completed").length}`, color: "text-green-600" },
        { label: "Urgent", value: `${actions.filter((a: any) => a.priority === "urgent").length}`, color: "text-red-600" },
    ];

    const statusColors: any = {
        completed: "bg-green-100 text-green-700",
        scheduled: "bg-orange-100 text-orange-700",
        pending: "bg-slate-100 text-slate-700",
    };

    const priorityColors: any = {
        high: "bg-red-100 text-red-700",
        medium: "bg-orange-100 text-orange-700",
        urgent: "bg-red-600 text-white",
        low: "bg-green-100 text-green-700",
    };


    // OPEN MODAL: Sets the selected action details and opens the modal
    const openActionForm = (action: any) => {
        setSelectedAction(action);
        setModalOpen(true);
    };

    // SUBMIT: Calls the addAction function from the store with the submitted data
    const handleSubmit = (data: any) => {
        addAction(data);
        setModalOpen(false);
    };


    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">

                    {/* TITLE */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Recovery Actions</h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Manage SMS, calls, visits, legal notices & WhatsApp followups
                        </p>
                    </div>

                    {/* ACTION ICONS - Triggers the modal with the specific action type */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {actionTypes.map((type, i) => (
                            <ActionTypeCard
                                key={i}
                                {...type}
                                onClick={() => openActionForm(type)} // Passes the type object
                            />
                        ))}
                    </div>

                    {/* ... (STATS, SEARCH, FILTERS, and TABLE sections remain the same) */}
                    {/* STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                <div className={`text-3xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEARCH & FILTERS */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by borrower name..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm"
                            />
                            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                                <option>All Types</option>
                                <option>Call</option>
                                <option>SMS</option>
                                <option>Visit</option>
                                <option>Legal Notice</option>
                                <option>WhatsApp</option>
                            </select>
                            <select className="px-4 py-2 border border-slate-200 rounded-lg text-sm">
                                <option>All Status</option>
                                <option>Completed</option>
                                <option>Scheduled</option>
                                <option>Pending</option>
                            </select>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Borrower</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Scheduled</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Agent</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Outcome</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {actions.map((action: any, i: any) => {
                                        const Icon = action.icon;
                                        return (
                                            <tr key={i} className="hover:bg-slate-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Icon className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm font-medium">{action.type}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm">{action.borrower}</td>

                                                <td className="px-6 py-4 text-sm flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {action.scheduled}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[action.status]}`}>
                                                        {action.status}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[action.priority]}`}>
                                                        {action.priority}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-sm">{action.agent}</td>

                                                <td className="px-6 py-4 text-sm">{action.outcome}</td>

                                                <td className="px-6 py-4">
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* MODAL - Renders the single component and passes dynamic props */}
                {isModalOpen && selectedAction && (
                    <ActionModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        actionId={selectedAction.actionId}
                        title={selectedAction.label}
                        // Pass the icon component as a prop
                        icon={<selectedAction.icon />} 
                        borrowers={borrowers}
                        agents={agents}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}



