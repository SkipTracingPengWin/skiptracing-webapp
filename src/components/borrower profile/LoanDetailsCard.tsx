import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/borrower profile/cards.modal";

const LoanItem = ({ label, value, highlight = false }: any) => (
    <div>
        <p className="text-sm text-slate-500 mb-1">{label}</p>
        <p className={`font-bold text-lg ${highlight ? "text-orange-600" : "text-slate-900"}`}>{value}</p>
    </div>
);

const LoanStatus = ({ borrower }: any) => {
    const status = String(borrower.status || "UNKNOWN").toUpperCase();
    const getStatusStyles = (s: string) => {
        switch (s) {
            case "ACTIVE": return "bg-green-100 text-green-800 border-green-200";
            case "SKIPPED": return "bg-purple-100 text-purple-800 border-purple-200";
            case "CLOSED": return "bg-rose-100 text-rose-800 border-rose-200";
            case "INACTIVE": return "bg-slate-100 text-slate-800 border-slate-200";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <div>
            <p className="text-sm text-slate-500 mb-2">Status</p>
            <Badge className={`${getStatusStyles(status)} border`}>
                {status}
            </Badge>
        </div>
    );
};

export default function LoanDetailsCard({ borrower }: { borrower: any }) {
    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <LoanItem label="Loan Type" value={borrower.loanType} />
                    <LoanItem label="Loan Amount" value={borrower.amount} />
                    <LoanItem label="Overdue" value={borrower.overdue} highlight />
                    <LoanStatus borrower={borrower} />
                </div>
            </CardContent>
        </Card>
    );
}
