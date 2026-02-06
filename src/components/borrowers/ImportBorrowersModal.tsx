import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useBorrowerStore } from '@/store/borrowers.store';
import toast from 'react-hot-toast';
import { Borrower } from '@/types/borrower.types';

interface ImportBorrowersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportBorrowersModal({ isOpen, onClose }: ImportBorrowersModalProps) {
    const { addBorrower } = useBorrowerStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
            toast.error("Please upload a valid CSV file");
            return;
        }
        setFile(file);
    };

    const parseCSV = (text: string): Partial<Borrower>[] => {
        const lines = text.split(/\r\n|\n/);
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
        
        const results: Partial<Borrower>[] = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            // Simple CSV split handling quotes somewhat (imperfect but better than simple split)
            // Splitting by comma only if not inside quotes
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
            // Fallback to simple split if match fails or just handle cleanup
            const cleanRow = (lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || lines[i].split(',')).map(val => 
                val ? val.trim().replace(/^"|"$/g, '').replace(/""/g, '"') : ''
            );

            // If simpler split is needed due to regex issues with complex CSVs, we can iterate.
            // But for now, let's trust a simpler approach:
            // Let's use a robust enough regex for standard CSVs
            // Reference: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
            const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            
            // Actually, let's implement a very simple parser that assumes standard check
            const values = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(val => val.trim().replace(/^"|"$/g, ''));

            if (values.length < headers.length) continue;

            const entry: any = {};
            
            // Map known columns
            headers.forEach((header, index) => {
                const value = values[index];
                
                if (header.includes('name')) entry.name = value;
                else if (header.includes('phone')) entry.phone = value;
                else if (header.includes('loan') && header.includes('id')) entry.loanId = value;
                else if (header.includes('amount')) entry.amount = Number(value.replace(/[^0-9.-]+/g, ""));
                else if (header.includes('address')) entry.address = value;
                else if (header.includes('location') || header.includes('city')) entry.location = value;
                else if (header.includes('email')) entry.email = value;
                else if (header.includes('status')) entry.status = value;
                else if (header.includes('risk')) entry.risk = value;
            });

            // Defaults if missing
            if (!entry.status) entry.status = "ACTIVE";
            if (!entry.risk) entry.risk = "Low";
            
            if (entry.name && entry.phone) {
                results.push(entry);
            }
        }
        return results;
    };

    const handleSubmit = async () => {
        if (!file) return;

        setIsSubmitting(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const borrowers = parseCSV(text);

                if (borrowers.length === 0) {
                    toast.error("No valid borrower records found in CSV");
                    setIsSubmitting(false);
                    return;
                }

                let successCount = 0;
                let failCount = 0;

                // Sequential processing to avoid overwhelming the server or store
                for (const borrower of borrowers) {
                    try {
                        await addBorrower(borrower);
                        successCount++;
                    } catch (error) {
                        console.error("Failed to import row", borrower, error);
                        failCount++;
                    }
                }

                if (successCount > 0) {
                    toast.success(`Successfully imported ${successCount} borrowers`);
                }
                if (failCount > 0) {
                    toast.error(`Failed to import ${failCount} records`);
                }

                onClose();
                setFile(null);
            } catch (error) {
                console.error("CSV Import Error:", error);
                toast.error("Failed to process CSV file");
            } finally {
                setIsSubmitting(false);
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                        Import Borrowers
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div 
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                            dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        } ${file ? 'bg-blue-50/50 border-blue-400' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                    >
                        <input 
                            ref={inputRef}
                            type="file" 
                            accept=".csv"
                            className="hidden"
                            onChange={handleChange}
                        />

                        {file ? (
                            <div className="space-y-2">
                                <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FileSpreadsheet className="h-6 w-6" />
                                </div>
                                <p className="font-medium text-slate-900 line-clamp-1 break-all">{file.name}</p>
                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="h-12 w-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <Upload className="h-6 w-6" />
                                </div>
                                <p className="font-medium text-slate-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-slate-400">CSV files only (max 5MB)</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex gap-2 p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                        <div>
                            <p className="font-semibold mb-1">CSV Format Requirements:</p>
                            <p>Columns: Name, Phone, Loan ID, Amount, Location, Status</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!file || isSubmitting}
                            className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                'Import Borrowers'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
