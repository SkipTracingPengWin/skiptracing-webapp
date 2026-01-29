import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/borrower profile/cards.modal";

export default function ScoreCard({ score }: { score: number }) {
    const getColor = (score: number) =>
        score >= 75 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

    return (
        <Card className="shadow-xl border-0 bg- from-indigo-50 to-blue-50">
            <CardHeader>
                <CardTitle>Verification Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke={getColor(score)}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${(score / 100) * 439.6} 439.6`}
                            fill="none"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900">{score}</span>
                        <span className="text-sm text-slate-500">/ 100</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
