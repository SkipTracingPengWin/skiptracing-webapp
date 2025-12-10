import { useState } from 'react';
import { X } from 'lucide-react';
import { useBorrowerStore } from '@/store/borrowers.store';
import { Borrower } from '@/types/borrower.types';

interface AddBorrowerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddBorrowerModal({ isOpen, onClose }: AddBorrowerModalProps) {
    const { addBorrower } = useBorrowerStore();

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        loanId: '',
        outstandingAmount: '',
        loanType: 'Personal',
        status: 'Active',
        city: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phoneNumber || !formData.loanId) {
            alert('Please fill required fields: Name, Phone, Loan ID');
            return;
        }

        const newBorrower: Borrower = {
            id: Date.now(),
            name: formData.fullName,
            phone: formData.phoneNumber,
            email: formData.email,
            loanId: formData.loanId,
            loanType: formData.loanType as any,
            amount: `₹${formData.outstandingAmount}`,
            amountNumeric: Number(formData.outstandingAmount) || 0,
            overdue: '0 days overdue',
            overdueDays: 0,
            status: formData.status.toLowerCase() as any,
            risk: 'low',
            verified: false,
            location: formData.city,
            address: formData.city, // Simplified address
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };

        addBorrower(newBorrower);
        onClose();
        setFormData({
            fullName: '',
            phoneNumber: '',
            email: '',
            loanId: '',
            outstandingAmount: '',
            loanType: 'Personal',
            status: 'Active',
            city: ''
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Compact Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-900">Quick Add Borrower</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="h-4 w-4 text-slate-500" />
                    </button>
                </div>

                {/* Compact Form - 2-column tight layout */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Essential Fields Row 1 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 block">Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Full name"
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 block">Phone *</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone"
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Essential Fields Row 2 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 block">Loan ID *</label>
                            <input
                                type="text"
                                name="loanId"
                                value={formData.loanId}
                                onChange={handleChange}
                                placeholder="Loan ID"
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 block">Amount ₹</label>
                            <input
                                type="number"
                                name="outstandingAmount"
                                value={formData.outstandingAmount}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Secondary Fields - Compact */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 block">Type</label>
                            <select
                                name="loanType"
                                value={formData.loanType}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="Personal">Personal</option>
                                <option value="Vehicle">Vehicle</option>
                                <option value="Home">Home</option>
                                <option value="Gold">Gold</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-700 block">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="In Recovery">In Recovery</option>
                                <option value="Legal">Legal</option>
                                <option value="Settled">Settled</option>
                            </select>
                        </div>
                    </div>

                    {/* Single-line secondary fields */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-slate-600 block">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <label className="text-xs text-slate-600 block">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Compact Actions */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1"
                        >
                            Add Borrower
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
