import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useBorrowerStore } from '@/store/borrowers.store';
import { useAuthStore } from '@/store/auth.store';
import { borrowerService } from '@/services/borrowers.services';
import { Borrower } from '@/types/borrower.types';
import toast from 'react-hot-toast';

interface AddBorrowerModalProps {
    isOpen: boolean;
    onClose: () => void;
    borrowerId?: string | number; // Optional: if provided, modal is in edit mode
}

export default function AddBorrowerModal({ isOpen, onClose, borrowerId }: AddBorrowerModalProps) {
    const { addBorrower, updateBorrower, deleteBorrower } = useBorrowerStore();
    const { user } = useAuthStore();
    const isEditMode = !!borrowerId;

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        location: '',
        loanId: '',
        outstandingAmount: '',
        loanType: 'Personal Loan',
        overdueDays: '',
        risk: 'Low',
        status: 'ACTIVE',
        lastContact: '',
        notes: '',
        verified: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch borrower data when in edit mode
    useEffect(() => {
        const loadBorrowerData = async () => {
            if (isEditMode && borrowerId && isOpen) {
                setIsLoading(true);
                try {
                    const borrower = await borrowerService.getById(borrowerId);
                    // Pre-fill form with existing data
                    setFormData({
                        fullName: borrower.name || '',
                        phoneNumber: borrower.phone || '',
                        email: borrower.email || '',
                        address: borrower.address || '',
                        location: borrower.location || '',
                        loanId: borrower.loanId || '',
                        outstandingAmount: borrower.amount?.toString() || '',
                        loanType: borrower.loanType || 'Personal Loan',
                        overdueDays: borrower.overdueDays?.toString() || '',
                        risk: borrower.risk || 'Low',
                        status: borrower.status || 'ACTIVE',
                        lastContact: borrower.lastContact ? new Date(borrower.lastContact).toISOString().slice(0, 16) : '',
                        notes: borrower.notes || '',
                        verified: borrower.verified || false
                    });
                } catch (error) {
                    console.error('Failed to fetch borrower data:', error);
                    alert('Failed to load borrower data');
                    onClose();
                } finally {
                    setIsLoading(false);
                }
            } else if (!isEditMode && isOpen) {
                // Reset form when opening in add mode
                setFormData({
                    fullName: '',
                    phoneNumber: '',
                    email: '',
                    address: '',
                    location: '',
                    loanId: '',
                    outstandingAmount: '',
                    loanType: 'Personal Loan',
                    overdueDays: '',
                    risk: 'Low',
                    status: 'ACTIVE',
                    lastContact: '',
                    notes: '',
                    verified: false
                });
            }
        };

        loadBorrowerData();
    }, [isEditMode, borrowerId, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phoneNumber || !formData.loanId || !formData.location) {
            alert('Please fill required fields: Name, Phone, Loan ID, Location');
            return;
        }

        setIsSubmitting(true);
        try {
            // Prepare the payload to match the exact API structure
            const borrowerData: Partial<Borrower> = {
                name: formData.fullName,
                phone: formData.phoneNumber,
                email: formData.email || undefined,
                address: formData.address || undefined,
                location: formData.location,
                loanId: formData.loanId,
                loanType: formData.loanType as Borrower["loanType"],
                amount: Number(formData.outstandingAmount) || 0,
                amountNumeric: Number(formData.outstandingAmount) || 0,
                overdue: Number(formData.overdueDays) > 0 ? "Yes" : "No",
                overdueDays: Number(formData.overdueDays) || 0,
                status: formData.status as Borrower["status"],
                risk: formData.risk as Borrower["risk"],
                lastContact: formData.lastContact || undefined,
                notes: formData.notes || undefined,
                verified: formData.verified
            };

            console.log(isEditMode ? "UPDATE PAYLOAD:" : "CREATE PAYLOAD:", borrowerData);

            if (isEditMode && borrowerId) {
                // Update existing borrower
                await updateBorrower(borrowerId, borrowerData);
                toast.success("Borrower updated successfully");
            } else {
                // Create new borrower
                await addBorrower(borrowerData);
                toast.success("Borrower added successfully");
            }

            // Only close and reset on success
            onClose();
            setFormData({
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                location: '',
                loanId: '',
                outstandingAmount: '',
                loanType: 'Personal Loan',
                overdueDays: '',
                risk: 'Low',
                status: 'ACTIVE',
                lastContact: '',
                notes: '',
                verified: false
            });
        } catch (error) {
            console.error(isEditMode ? "Failed to update borrower:" : "Failed to add borrower:", error);
            const message = isEditMode ? "Failed to update borrower. Please try again." : "Failed to add borrower. Please try again.";
            alert(message);
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (borrowerId && confirm("Are you sure you want to delete this borrower? This action cannot be undone.")) {
            setIsSubmitting(true);
            try {
                await deleteBorrower(borrowerId);
                toast.success("Borrower deleted successfully");
                onClose();
            } catch (error) {
                console.error("Failed to delete borrower:", error);
                alert("Failed to delete borrower. Please try again.");
                toast.error("Failed to delete borrower");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-indigo-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto border border-slate-100/20 animate-in slide-in-from-bottom-4 duration-300">
                {/* Premium Header with Gradient */}
                <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-b border-blue-500/20">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{isEditMode ? 'Edit Borrower' : 'Add New Borrower'}</h2>
                            <p className="text-xs text-blue-100">{isEditMode ? 'Update borrower information' : 'Complete the form to register a new borrower'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 group"
                    >
                        <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                </div>

                {/* Premium Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-gradient-to-br from-slate-50 to-white">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="ml-3 text-slate-600">Loading borrower data...</span>
                        </div>
                    ) : (
                        <>
                            {/* Essential Fields Row 1 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">
                                        Name
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">
                                        Phone
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Phone number"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Essential Fields Row 2 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">
                                        Loan ID
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="loanId"
                                        value={formData.loanId}
                                        onChange={handleChange}
                                        placeholder="LN-XXXX-XXX"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400 font-mono"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">
                                        Amount ₹
                                    </label>
                                    <input
                                        type="number"
                                        name="outstandingAmount"
                                        value={formData.outstandingAmount}
                                        onChange={handleChange}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Secondary Fields - Compact */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 group-focus-within:text-blue-600 transition-colors">Loan Type</label>
                                    <select
                                        name="loanType"
                                        value={formData.loanType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 cursor-pointer"
                                    >
                                        <option value="Personal Loan">Personal</option>
                                        <option value="Vehicle Loan">Vehicle</option>
                                        <option value="Home Loan">Home</option>
                                        <option value="Gold Loan">Gold</option>
                                        <option value="Business Loan">Business</option>
                                    </select>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 group-focus-within:text-blue-600 transition-colors">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 cursor-pointer"
                                    >
                                        <option value="ACTIVE">Active</option>
                                        <option value="INACTIVE">Inactive</option>
                                        <option value="SKIPPED">Skipped</option>
                                        <option value="CLOSED">Closed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Risk and Overdue Days */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 group-focus-within:text-blue-600 transition-colors">Risk Level</label>
                                    <select
                                        name="risk"
                                        value={formData.risk}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 cursor-pointer"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-slate-600 group-focus-within:text-blue-600 transition-colors">Overdue Days</label>
                                    <input
                                        type="number"
                                        name="overdueDays"
                                        value={formData.overdueDays}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Email - Full Width */}
                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-slate-600 group-focus-within:text-blue-600 transition-colors">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="borrower@example.com"
                                    className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                />
                            </div>

                            {/* Location and Address */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">
                                        Location/City
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-sm font-medium text-slate-600 group-focus-within:text-blue-600 transition-colors">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Street address"
                                        className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                    />
                                </div>
                            </div>

                            {/* Last Contact - Full Width */}
                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-slate-600 group-focus-within:text-blue-600 transition-colors">Last Contact</label>
                                <input
                                    type="datetime-local"
                                    name="lastContact"
                                    value={formData.lastContact}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-200 bg-white hover:border-slate-300"
                                />
                            </div>

                            {/* Verified Status - Full Width Select or Toggle */}
                            <div className="space-y-2 group">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">
                                    Verification Status
                                </label>
                                <div className="flex items-center gap-4 p-4 bg-white border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${formData.verified ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 font-semibold text-slate-700 flex items-center gap-1.5 group-focus-within:text-blue-600 transition-colors">Mark as Verified</p>
                                            <p className="text-xs text-slate-500">Toggle if the borrower documentation is verified</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="verified"
                                            checked={formData.verified}
                                            onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>

                            {/* Notes - Full Width */}
                            <div className="space-y-2 group">
                                <label className="text-sm font-medium text-slate-600 group-focus-within:text-blue-600 transition-colors">Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add any additional notes or comments about this borrower..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all duration-200 bg-white hover:border-slate-300 placeholder:text-slate-400"
                                />
                            </div>

                            {/* Premium Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-slate-100 mt-6">
                                {isEditMode && user?.role === "ADMIN" && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isSubmitting}
                                        className="mr-auto px-4 py-2.5 text-sm font-semibold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border-2 border-red-100 hover:border-red-600 rounded-xl transition-all duration-200 flex items-center gap-2 group"
                                    >
                                        <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        Delete
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {isEditMode ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                                            </svg>
                                            {isEditMode ? 'Update Borrower' : 'Add Borrower'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
