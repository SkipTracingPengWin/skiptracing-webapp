import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/borrower profile/cards.modal";

export default function SkipTraceCard({ borrower }: { borrower: any }) {
    return (
        <Card className="shadow-lg border-0 border-l-4 border-orange-500">
            <CardHeader>
                <CardTitle>Risk Level</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm font-medium">Risk Level</p>
                <Badge className={borrower.risk === "high" ? "bg-red-100 text-red-800" : borrower.risk === "medium" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}>
                    {String(borrower.risk || "N/A").toUpperCase()}
                </Badge>
            </CardContent>
        </Card>
    );
}
