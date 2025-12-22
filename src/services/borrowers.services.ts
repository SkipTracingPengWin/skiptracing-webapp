import api from "@/lib/axios";
import { Borrower } from "@/types/borrower.types";

export const borrowerService = {
    getAll: async () => {
        try {
            const response = await api.get("/borrowers");
            return response.data;
        } catch (error: any) {
            console.error("❌ Error in getAll:", error.message);
            throw error;
        }
    },

    getById: async (id: string | number) => {
        try {
            const response = await api.get(`/borrowers/${id}`);
            return response.data;
        } catch (error: any) {
            console.error(`❌ Error in getById for ID ${id}:`, error.message);
            throw error;
        }
    },

    _sanitizeData: (data: any) => {
        const sanitized = { ...data };
        Object.keys(sanitized).forEach(key => {
            if (sanitized[key] === undefined || sanitized[key] === null || sanitized[key] === '') {
                delete sanitized[key];
            }
        });

        if (sanitized.lastContact) {
            try {
                if (!sanitized.lastContact.includes('T') || !sanitized.lastContact.endsWith('Z')) {
                    const dateObj = new Date(sanitized.lastContact);
                    if (isNaN(dateObj.getTime())) {
                        delete sanitized.lastContact;
                    } else {
                        sanitized.lastContact = dateObj.toISOString();
                    }
                }
            } catch (dateError) {
                delete sanitized.lastContact;
            }
        }
        return sanitized;
    },

    create: async (data: Partial<Borrower>) => {
        try {
            const sanitizedData = borrowerService._sanitizeData(data);
            console.log("🚀 Creating Borrower with payload:", JSON.stringify(sanitizedData, null, 2));
            const response = await api.post("/borrowers", sanitizedData);
            console.log("✅ Create successful:", response.data);
            return response.data;
        } catch (error: any) {
            const errorData = error.response?.data;
            const errorMsg = errorData?.message || errorData?.error || error.message;
            console.error("❌ Create failed:", {
                status: error.response?.status,
                data: errorData,
                message: error.message
            });
            alert(`Create failed: ${errorMsg}`);
            throw error;
        }
    },

    update: async (id: string | number, data: Partial<Borrower>) => {
        try {
            if (!id || id === "undefined" || id === "[object Object]") {
                throw new Error(`Invalid borrower ID: ${id}`);
            }
            const sanitizedData = borrowerService._sanitizeData(data);
            const response = await api.put(`/borrowers/${id}`, sanitizedData);
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error(`❌ Update Error [ID: ${id}]:`, errorMsg);
            alert(`Update failed: ${errorMsg}`);
            throw error;
        }
    },

    delete: async (id: string | number) => {
        try {
            // Safety Check
            if (!id || id === "undefined" || id === "[object Object]" || typeof id === 'object') {
                alert(`Cannot delete: Invalid ID detected (${typeof id})`);
                return;
            }

            const fullUrl = `${api.defaults.baseURL}/borrowers/${id}`;
            console.log(`🗑️ DELETE Request to: ${fullUrl}`);

            const response = await api.delete(`/borrowers/${id}`);
            console.log("✅ Delete successful");
            return response.data;
        } catch (error: any) {
            const status = error.response?.status;
            const errorMsg = error.response?.data?.message || error.message;
            const url = error.config?.url || "unknown";

            // Build a very clear diagnostic string for the user
            const diagnosticInfo = `
❌ DELETE FAILED
Status: ${status || "Network Error"}
URL: ${url}
ID: ${id} (Type: ${typeof id})
Message: ${errorMsg}
            `.trim();

            console.error(diagnosticInfo);

            if (status === 404) {
                alert(`DEBUG INFO:\nThe server returned 404 (Not Found).\n\nAction: Please check if your backend has a route defined as DELETE /api/borrowers/:id\n\nFull URL attempted: ${api.defaults.baseURL}${url}`);
            } else if (status === 403) {
                alert("❌ ACTION DENIED\n\nOnly Administrators (ADMIN) are authorized to delete borrowers.\nManagers and Agents do not have permission for this action.");
            } else {
                alert(diagnosticInfo);
            }

            throw error;
        }
    }
};



