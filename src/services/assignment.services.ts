import api from "@/lib/axios";
import { Assignment } from "@/types/assignment.types";

export const assignmentService = {
    getAll: async () => {
        try {
            const response = await api.get("/assignments");
            return response.data;
        } catch (error: any) {
            console.error("❌ /assignments crashed:", error);
            const diag = {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                endpoint: error.config?.url,
            };
            console.error("❌ Detailed GetAll Error:", JSON.stringify(diag, null, 2));
            throw error;
        }
    },

    getById: async (id: string | number) => {
        const response = await api.get(`/assignments/${id}`);
        return response.data;
    },

    getByAgentId: async (agentId: string | number) => {
        const response = await api.get(`/agents/${agentId}`);
        // The assignments are nested in the agent object
        return response.data.assignedCases || [];
    },

    _sanitizeData: (data: any) => {
        const sanitized = { ...data };
        delete sanitized.id; // Backend handles ID
        Object.keys(sanitized).forEach(key => {
            if (sanitized[key] === undefined || sanitized[key] === null || sanitized[key] === '') {
                delete sanitized[key];
            }
        });

        // Ensure dates are in ISO format if they exist
        ['assignedAt', 'dueDate', 'lastUpdate'].forEach(dateKey => {
            if (sanitized[dateKey]) {
                try {
                    const dateObj = new Date(sanitized[dateKey]);
                    if (!isNaN(dateObj.getTime())) {
                        sanitized[dateKey] = dateObj.toISOString();
                    }
                } catch (e) {
                    console.warn(`Failed to sanitize date for ${dateKey}:`, sanitized[dateKey]);
                }
            }
        });

        return sanitized;
    },

    create: async (data: Partial<Assignment>) => {
        try {
            const sanitizedData = assignmentService._sanitizeData(data);
            const payloadString = JSON.stringify(sanitizedData, null, 2);
            console.log("🚀 Creating Assignment with payload:", payloadString);
            const response = await api.post("/assignments/", sanitizedData);
            return response.data;
        } catch (error: any) {
            const diag = {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                endpoint: error.config?.url,
            };
            console.error("❌ Detailed Create Error:", JSON.stringify(diag, null, 2));
            throw error;
        }
    },

    update: async (id: string | number, data: Partial<Assignment>) => {
        const sanitizedData = assignmentService._sanitizeData(data);
        const response = await api.put(`/assignments/${id}`, sanitizedData);
        return response.data;
    },

    delete: async (id: string | number) => {
        const response = await api.delete(`/assignments/${id}`);
        return response.data;
    }
};
