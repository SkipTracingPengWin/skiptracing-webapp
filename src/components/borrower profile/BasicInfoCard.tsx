import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/borrower profile/cards.modal";
import { Phone, Mail, MapPin, CreditCard, Briefcase, Landmark } from "lucide-react";
import { InfoItem } from "./InfoItem";

interface BasicInfoCardProps {
    borrower: any;
    assignedAgentName: string;
}

export default function BasicInfoCard({ borrower, assignedAgentName }: BasicInfoCardProps) {
    return (
        <Card className="shadow-lg border-0 bg- from-slate-50 to-white">
            <CardHeader className="pb-4">
                <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem icon={<Phone className="w-6 h-6 text-blue-600" />} label="Phone" value={borrower.phone} />
                    <InfoItem icon={<Mail className="w-6 h-6 text-blue-600" />} label="Email" value={borrower.email} />
                    <InfoItem icon={<MapPin className="w-6 h-6 text-blue-600" />} label="Location" value={borrower.location} />
                    <InfoItem icon={<CreditCard className="w-6 h-6 text-blue-600" />} label="Loan ID" value={borrower.loanId} />
                    <InfoItem icon={<Briefcase className="w-6 h-6 text-blue-600" />} label="Assigned Agent" value={assignedAgentName} />
                    <InfoItem icon={<Landmark className="w-6 h-6 text-blue-600" />} label="Last Contact" value={borrower.lastContact} />
                </div>
            </CardContent>
        </Card>
    );
}
