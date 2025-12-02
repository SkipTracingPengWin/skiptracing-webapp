import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { SkipTraceLocation } from '@/types';

const locationsData: SkipTraceLocation[] = [
    {
        id: 1,
        borrowerId: 1,
        borrowerName: "Rahul Sharma",
        latitude: 19.0760,
        longitude: 72.8777,
        address: "Mumbai, Maharashtra",
        lastSeen: "2025-11-28 09:00",
        confidence: "High",
        source: "Mobile Signal"
    },
    {
        id: 2,
        borrowerId: 3,
        borrowerName: "Amit Kumar",
        latitude: 28.7041,
        longitude: 77.1025,
        address: "Delhi, NCR",
        lastSeen: "2025-11-27 18:30",
        confidence: "Medium",
        source: "Social Media"
    }
];

interface LocationState {
    locations: SkipTraceLocation[];
}

export const useLocationStore = create<LocationState>()(
    devtools(
        (set) => ({
            locations: locationsData,
        }),
        { name: 'LocationStore' }
    )
);
