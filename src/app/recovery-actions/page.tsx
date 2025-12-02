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

// // Action Type Card Component
// function ActionTypeCard({ icon: Icon, label, color }: any) {
//     return (
//         <button className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center group">
//             <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${color} mx-auto mb-3`}>
//                 <Icon className="h-8 w-8 text-white" />
//             </div>
//             <h3 className="font-semibold text-slate-900">{label}</h3>
//         </button>
//     );
// }

// export default function RecoveryActionsPage() {
//     const actionTypes = [
//         { icon: MessageSquare, label: "Send SMS", color: "bg-blue-500" },
//         { icon: Phone, label: "Make Call", color: "bg-green-500" },
//         { icon: Video, label: "IVR Call", color: "bg-purple-500" },
//         { icon: MapPin, label: "Schedule Visit", color: "bg-orange-500" },
//         { icon: FileText, label: "Legal Notice", color: "bg-red-500" },
//         { icon: MessageCircle, label: "WhatsApp", color: "bg-green-600" },
//     ];

//     const stats = [
//         { label: "Total Actions", value: "5", color: "text-slate-900" },
//         { label: "Scheduled", value: "2", color: "text-orange-600" },
//         { label: "Completed", value: "2", color: "text-green-600" },
//         { label: "Urgent", value: "2", color: "text-red-600" },
//     ];

//     const actions = [
//         {
//             type: "Call",
//             icon: Phone,
//             borrower: "Rahul Sharma",
//             scheduled: "Jan 15, 4:30 PM",
//             status: "completed",
//             priority: "high",
//             agent: "Suresh Kumar",
//             outcome: "promise to pay",
//         },
//         {
//             type: "Sms",
//             icon: MessageSquare,
//             borrower: "Priya Patel",
//             scheduled: "Jan 14, 2:30 PM",
//             status: "completed",
//             priority: "medium",
//             agent: "Unassigned",
//             outcome: "no response",
//         },
//         {
//             type: "Visit",
//             icon: MapPin,
//             borrower: "Amit Kumar",
//             scheduled: "Jan 20, 3:30 PM",
//             status: "scheduled",
//             priority: "urgent",
//             agent: "Priya Sharma",
//             outcome: "-",
//         },
//     ];

//     const statusColors: Record<string, string> = {
//         completed: "bg-green-100 text-green-700",
//         scheduled: "bg-orange-100 text-orange-700",
//         pending: "bg-slate-100 text-slate-700",
//     };

//     const priorityColors: Record<string, string> = {
//         high: "bg-red-100 text-red-700",
//         medium: "bg-orange-100 text-orange-700",
//         urgent: "bg-red-600 text-white",
//         low: "bg-green-100 text-green-700",
//     };

//     return (
//         <div className="flex h-screen bg-slate-50">
//             <Sidebar />

//             <div className="flex-1 ml-64 flex flex-col overflow-hidden">
//                 <Header />

//                 <main className="flex-1 overflow-y-auto p-6">
//                     {/* Page Header */}
//                     <div className="mb-6">
//                         <h1 className="text-2xl font-bold text-slate-900">Recovery Actions</h1>
//                         <p className="text-sm text-slate-600 mt-1">Manage SMS, calls, visits, and legal notices</p>
//                     </div>

//                     {/* Action Type Cards */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
//                         {actionTypes.map((type, i) => (
//                             <ActionTypeCard key={i} {...type} />
//                         ))}
//                     </div>

//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                         {stats.map((stat, i) => (
//                             <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
//                                 <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
//                                 <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Filters */}
//                     <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
//                         <div className="flex items-center gap-4">
//                             <input
//                                 type="text"
//                                 placeholder="Search by borrower name..."
//                                 className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
//                             />
//                             <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
//                                 <option>All Types</option>
//                                 <option>Call</option>
//                                 <option>SMS</option>
//                                 <option>Visit</option>
//                                 <option>Legal Notice</option>
//                                 <option>WhatsApp</option>
//                             </select>
//                             <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
//                                 <option>All Status</option>
//                                 <option>Completed</option>
//                                 <option>Scheduled</option>
//                                 <option>Pending</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Actions Table */}
//                     <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//                         <div className="overflow-x-auto">
//                             <table className="w-full">
//                                 <thead className="bg-slate-50 border-b border-slate-200">
//                                     <tr>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Borrower</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Scheduled</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agent</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Outcome</th>
//                                         <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-slate-200">
//                                     {actions.map((action, i) => {
//                                         const Icon = action.icon;
//                                         return (
//                                             <tr key={i} className="hover:bg-slate-50 transition-colors">
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex items-center gap-2">
//                                                         <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                                             <Icon className="h-4 w-4 text-blue-600" />
//                                                         </div>
//                                                         <span className="text-sm font-medium text-slate-900">{action.type}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <span className="text-sm text-slate-900">{action.borrower}</span>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <div className="flex items-center gap-2 text-sm text-slate-600">
//                                                         <Calendar className="h-4 w-4" />
//                                                         {action.scheduled}
//                                                     </div>
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
//                                                 <td className="px-6 py-4">
//                                                     <span className="text-sm text-slate-900">{action.agent}</span>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <span className="text-sm text-slate-600">{action.outcome}</span>
//                                                 </td>
//                                                 <td className="px-6 py-4">
//                                                     <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
//                                                         <MoreVertical className="h-4 w-4 text-slate-600" />
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
//             </div>
//         </div>
//     );
// }




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

// Action Type Card Component
function ActionTypeCard({ icon: Icon, label, color }: any) {
    return (
        <button className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all text-center group">
            <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${color} mx-auto mb-3`}>
                <Icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900">{label}</h3>
        </button>
    );
}

export default function RecoveryActionsPage() {
    // Use Zustand store for actions state
    const actions = useRecoveryActionsStore((state) => state.actions);

    const actionTypes = [
        { icon: MessageSquare, label: "Send SMS", color: "bg-blue-500" },
        { icon: Phone, label: "Make Call", color: "bg-green-500" },
        { icon: Video, label: "IVR Call", color: "bg-purple-500" },
        { icon: MapPin, label: "Schedule Visit", color: "bg-orange-500" },
        { icon: FileText, label: "Legal Notice", color: "bg-red-500" },
        { icon: MessageCircle, label: "WhatsApp", color: "bg-green-600" },
    ];

    const stats = [
        { label: "Total Actions", value: `${actions.length}`, color: "text-slate-900" },
        { label: "Scheduled", value: `${actions.filter(a => a.status === "scheduled").length}`, color: "text-orange-600" },
        { label: "Completed", value: `${actions.filter(a => a.status === "completed").length}`, color: "text-green-600" },
        { label: "Urgent", value: `${actions.filter(a => a.priority === "urgent").length}`, color: "text-red-600" },
    ];

    const statusColors: Record<string, string> = {
        completed: "bg-green-100 text-green-700",
        scheduled: "bg-orange-100 text-orange-700",
        pending: "bg-slate-100 text-slate-700",
    };

    const priorityColors: Record<string, string> = {
        high: "bg-red-100 text-red-700",
        medium: "bg-orange-100 text-orange-700",
        urgent: "bg-red-600 text-white",
        low: "bg-green-100 text-green-700",
    };

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">Recovery Actions</h1>
                        <p className="text-sm text-slate-600 mt-1">Manage SMS, calls, visits, and legal notices</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {actionTypes.map((type, i) => (
                            <ActionTypeCard key={i} {...type} />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                                <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
                                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Search by borrower name..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                            />
                            <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                <option>All Types</option>
                                <option>Call</option>
                                <option>SMS</option>
                                <option>Visit</option>
                                <option>Legal Notice</option>
                                <option>WhatsApp</option>
                            </select>
                            <select className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm">
                                <option>All Status</option>
                                <option>Completed</option>
                                <option>Scheduled</option>
                                <option>Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Borrower</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Scheduled</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Outcome</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {actions.map((action, i) => {
                                        const Icon = action.icon;
                                        return (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Icon className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-900">{action.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-900">{action.borrower}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Calendar className="h-4 w-4" />
                                                        {action.scheduled}
                                                    </div>
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
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-900">{action.agent}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600">{action.outcome}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                        <MoreVertical className="h-4 w-4 text-slate-600" />
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
            </div>
        </div>
    );
}
