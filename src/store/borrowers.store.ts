import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Borrower } from '@/types';

const borrowersData: Borrower[] = [
    {
        id: 1,
        name: "Rahul Sharma",
        phone: "98-XXXX-6012",
        email: "rahul.sharma@example.com",
        loanId: "LN-2024-001",
        loanType: "Personal",
        amount: "₹125,000",
        amountNumeric: 125000,
        overdue: "42 days overdue",
        overdueDays: 42,
        status: "in recovery",
        risk: "high",
        verified: true,
        location: "Mumbai",
        address: "Andheri West, Mumbai, Maharashtra",
        assignedAgent: "Suresh Kumar",
        lastContact: "2025-11-25",
        notes: "Borrower promised partial payment by month end",
        createdAt: "2024-01-15",
        updatedAt: "2025-11-25"
    },
    {
        id: 2,
        name: "Priya Patel",
        phone: "98-XXXX-2432",
        email: "priya.patel@example.com",
        loanId: "LN-2024-002",
        loanType: "Vehicle",
        amount: "₹78,000",
        amountNumeric: 78000,
        overdue: "28 days overdue",
        overdueDays: 28,
        status: "in recovery",
        risk: "medium",
        verified: true,
        location: "Mumbai",
        address: "Bandra East, Mumbai, Maharashtra",
        assignedAgent: "Priya Sharma",
        lastContact: "2025-11-26",
        notes: "Vehicle located, negotiating repayment plan",
        createdAt: "2024-02-10",
        updatedAt: "2025-11-26"
    },
    {
        id: 3,
        name: "Amit Kumar",
        phone: "97-XXXX-5109",
        email: "amit.kumar@example.com",
        loanId: "LN-2024-003",
        loanType: "Home",
        amount: "₹320,000",
        amountNumeric: 320000,
        overdue: "110 days overdue",
        overdueDays: 110,
        status: "legal",
        risk: "critical",
        verified: false,
        location: "Delhi",
        address: "Rohini, Delhi, NCR",
        assignedAgent: "Mohan Raj",
        lastContact: "2025-10-15",
        notes: "Case escalated to legal team, borrower unresponsive",
        createdAt: "2024-03-05",
        updatedAt: "2025-11-20"
    },
    {
        id: 4,
        name: "Sunita Devi",
        phone: "95-XXXX-1008",
        email: "sunita.devi@example.com",
        loanId: "LN-2024-004",
        loanType: "Gold",
        amount: "₹32,000",
        amountNumeric: 32000,
        overdue: "15 days overdue",
        overdueDays: 15,
        status: "active",
        risk: "low",
        verified: true,
        location: "Bangalore",
        address: "Whitefield, Bangalore, Karnataka",
        assignedAgent: "Suresh Kumar",
        lastContact: "2025-11-27",
        notes: "Regular communication, expects to clear dues soon",
        createdAt: "2024-04-20",
        updatedAt: "2025-11-27"
    },
    {
        id: 5,
        name: "Vikram Singh",
        phone: "94-XXXX-5647",
        email: "vikram.singh@example.com",
        loanId: "LN-2024-005",
        loanType: "Business",
        amount: "₹180,000",
        amountNumeric: 180000,
        overdue: "60 days overdue",
        overdueDays: 60,
        status: "in recovery",
        risk: "high",
        verified: false,
        location: "Hyderabad",
        address: "Madhapur, Hyderabad, Telangana",
        assignedAgent: "Priya Sharma",
        lastContact: "2025-11-22",
        notes: "Business facing cash flow issues, payment plan under discussion",
        createdAt: "2024-05-12",
        updatedAt: "2025-11-22"
    },
    {
        id: 6,
        name: "Anjali Reddy",
        phone: "91-XXXX-8765",
        email: "anjali.reddy@example.com",
        loanId: "LN-2024-006",
        loanType: "Personal",
        amount: "₹95,000",
        amountNumeric: 95000,
        overdue: "35 days overdue",
        overdueDays: 35,
        status: "in recovery",
        risk: "medium",
        verified: true,
        location: "Chennai",
        address: "T Nagar, Chennai, Tamil Nadu",
        assignedAgent: "Mohan Raj",
        lastContact: "2025-11-24",
        notes: "Partial payment received, follow-up scheduled",
        createdAt: "2024-06-08",
        updatedAt: "2025-11-24"
    },
    {
        id: 7,
        name: "Rajesh Gupta",
        phone: "93-XXXX-4321",
        email: "rajesh.gupta@example.com",
        loanId: "LN-2024-007",
        loanType: "Vehicle",
        amount: "₹150,000",
        amountNumeric: 150000,
        overdue: "5 days overdue",
        overdueDays: 5,
        status: "active",
        risk: "low",
        verified: true,
        location: "Pune",
        address: "Kothrud, Pune, Maharashtra",
        assignedAgent: "Suresh Kumar",
        lastContact: "2025-11-28",
        notes: "Payment expected within this week",
        createdAt: "2024-07-15",
        updatedAt: "2025-11-28"
    },
    {
        id: 8,
        name: "Meena Iyer",
        phone: "92-XXXX-9876",
        email: "meena.iyer@example.com",
        loanId: "LN-2024-008",
        loanType: "Gold",
        amount: "₹45,000",
        amountNumeric: 45000,
        overdue: "20 days overdue",
        overdueDays: 20,
        status: "active",
        risk: "low",
        verified: true,
        location: "Bangalore",
        address: "Koramangala, Bangalore, Karnataka",
        assignedAgent: "Priya Sharma",
        lastContact: "2025-11-27",
        notes: "Cooperative borrower, payment plan in place",
        createdAt: "2024-08-22",
        updatedAt: "2025-11-27"
    }
];

interface BorrowerState {
    borrowers: Borrower[];
    addBorrower: (borrower: Borrower) => void;
    updateBorrower: (id: number, updates: Partial<Borrower>) => void;
    deleteBorrower: (id: number) => void;
}

export const useBorrowerStore = create<BorrowerState>()(
    devtools(
        (set) => ({
            borrowers: borrowersData,
            addBorrower: (borrower) =>
                set((state) => ({
                    borrowers: [...state.borrowers, borrower],
                })),
            updateBorrower: (id, updates) =>
                set((state) => ({
                    borrowers: state.borrowers.map((b) =>
                        b.id === id ? { ...b, ...updates } : b
                    ),
                })),
            deleteBorrower: (id) =>
                set((state) => ({
                    borrowers: state.borrowers.filter((b) => b.id !== id),
                })),
        }),
        { name: 'BorrowerStore' }
    )
);
