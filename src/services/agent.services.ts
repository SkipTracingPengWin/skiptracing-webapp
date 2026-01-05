import api from "@/lib/axios";
import { Agent } from "@/types/agent.types"

export const agentServices = {
    getAll: async () => {
        try {
            const response = await api.get(`/agents`);
            console.log("📊 Fetched Agents RAW Data:", JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error("❌ Error in getAll agents:", error.message);
            throw error;
        }
    },
    _sanitizeData: (data: any) => {
        const sanitized = { ...data };

        // Remove internal IDs - backend doesn't want them in the body
        delete sanitized.id;
        delete sanitized._id;
        // NOTE: Keeping userId just in case the backend needs it for linking

        // Convert joinedDate to ISO-8601 format if present
        if (sanitized.joinedDate) {
            try {
                // Handle both date-only strings (YYYY-MM-DD) and existing ISO strings
                const dateObj = new Date(sanitized.joinedDate);
                if (!isNaN(dateObj.getTime())) {
                    sanitized.joinedDate = dateObj.toISOString();
                } else {
                    console.warn("Invalid joinedDate format, removing from payload:", sanitized.joinedDate);
                    delete sanitized.joinedDate;
                }
            } catch (error) {
                console.warn("Error converting joinedDate, removing from payload:", error);
                delete sanitized.joinedDate;
            }
        }

        // Only send password if it's not empty (during update)
        if (sanitized.password === "" || sanitized.password === undefined) {
            delete sanitized.password;
        }

        // Remove empty/null/undefined values (but keep false or 0 if they existed)
        Object.keys(sanitized).forEach(key => {
            if (sanitized[key] === undefined || sanitized[key] === null) {
                delete sanitized[key];
            }
            // Only delete empty strings if they are NOT required fields we want to pass
            // For now, let's stick to deleting truly empty values
            if (sanitized[key] === '') {
                delete sanitized[key];
            }
        });

        return sanitized;
    },

    getById: async (id: string | number) => {
        try {
            const response = await api.get(`/agents/${id}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Error in getById for Agent ID ${id}:`, error.message);
            throw error;
        }
    },
    create: async (data: Partial<Agent>) => {
        try {
            const sanitizedData = agentServices._sanitizeData(data);
            console.log("🚀 Creating Agent with payload:", JSON.stringify(sanitizedData, null, 2));
            const response = await api.post(`/agents`, sanitizedData);
            console.log("✅ Agent Create successful:", response.data);
            return response.data;
        } catch (error: any) {
            const errorData = error.response?.data;
            const errorMsg = errorData?.message || errorData?.error || error.message;
            console.error("❌ Agent Create failed. Details:", JSON.stringify({
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                url: error.config?.url,
                method: error.config?.method,
                payload: error.config?.data
            }, null, 2));
            throw new Error(errorMsg);
        }
    },
    update: async (id: string | number, data: Partial<Agent>) => {
        try {
            if (!id || id === "undefined" || id === "[object Object]") {
                throw new Error(`Invalid agent ID for update: ${id}`);
            }

            const sanitizedData = agentServices._sanitizeData(data);

            console.log(`📡 Updating Agent with Profile ID: ${id}`);
            console.log(`🚀 URL: PUT /agents/${id}`);
            console.log(`🚀 Payload (body):`, JSON.stringify(sanitizedData, null, 2));

            // CORRECT API: PUT /agents/{agentId} with body containing only updated fields
            const response = await api.put(`/agents/${id}`, sanitizedData);

            console.log(`✅ Agent ${id} Update successful:`, response.data);
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            const status = error.response?.status;
            console.error(`❌ Agent Update Error [ID: ${id}] - Status: ${status}:`, errorMsg);
            console.error(`   Full error:`, error.response?.data);
            throw new Error(errorMsg);
        }
    },
    delete: async (id: string | number) => {
        try {
            if (!id || id === "undefined" || id === "[object Object]") {
                throw new Error(`Invalid agent ID for delete: ${id}`);
            }
            console.log(`🗑️ DELETE Request for Agent: /agents/${id}`);
            const response = await api.delete(`/agents/${id}`);
            console.log("✅ Agent Delete successful");
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`❌ Agent Delete Error [ID: ${id}] on /agents/${id}:`, errorMsg);
            throw new Error(errorMsg);
        }
    }
}
