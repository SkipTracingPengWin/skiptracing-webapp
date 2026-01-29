import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/borrower profile/cards.modal";
import { PhoneCall, MessageSquare, MapPin, FileText, Download } from "lucide-react";

export default function QuickActions() {
    return (
        <Card className="shadow-lg border-0">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                        { icon: PhoneCall, label: "Call Borrower", className: "bg-blue-600 text-white hover:bg-blue-700" },
                        { icon: MessageSquare, label: "Send SMS", className: "hover:bg-gray-50" },
                        { icon: MapPin, label: "Schedule Visit", className: "hover:bg-gray-50" },
                        { icon: FileText, label: "Legal Notice", className: "hover:bg-gray-50" },
                        { icon: Download, label: "Download", className: "text-blue-600 border-blue-200 hover:bg-blue-50" }
                    ].map(({ icon: Icon, label, className }, i) => (
                        <Button key={i} variant="outline" className={`h-14 justify-start ${className || ""}`}>
                            <Icon className="w-4 h-4 mr-2" />
                            <span className="text-sm">{label}</span>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
