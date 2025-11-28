import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Agent } from '@/types';

const agentsData: Agent[] = [
    {
        id: 1,
        name: "Suresh Kumar",
        email: "suresh.k@example.com",
        phone: "9876543210",
        location: "Mumbai",
        cases: 15,
        status: "Active",
        joinedDate: "2023-01-15",
        successRate: 85,
        totalRecovered: "₹25,00,000"
    },
    {
        id: 2,
        name: "Priya Sharma",
        email: "priya.s@example.com",
        phone: "9876543211",
        location: "Delhi",
        cases: 12,
        status: "Busy",
        joinedDate: "2023-03-10",
        successRate: 92,
        totalRecovered: "₹18,50,000"
    },
    {
        id: 3,
        name: "Mohan Raj",
        email: "mohan.r@example.com",
        phone: "9876543212",
        location: "Bangalore",
        cases: 8,
        status: "Offline",
        joinedDate: "2023-06-20",
        successRate: 78,
        totalRecovered: "₹12,00,000"
    }
];

interface AgentState {
    agents: Agent[];
    addAgent: (agent: Agent) => void;
    updateAgent: (id: number, updates: Partial<Agent>) => void;
    deleteAgent: (id: number) => void;
}

export const useAgentStore = create<AgentState>()(
    devtools(
        (set) => ({
            agents: agentsData,
            addAgent: (agent) =>
                set((state) => ({
                    agents: [...state.agents, agent],
                })),
            updateAgent: (id, updates) =>
                set((state) => ({
                    agents: state.agents.map((a) =>
                        a.id === id ? { ...a, ...updates } : a
                    ),
                })),
            deleteAgent: (id) =>
                set((state) => ({
                    agents: state.agents.filter((a) => a.id !== id),
                })),
        }),
        { name: 'AgentStore' }
    )
);
