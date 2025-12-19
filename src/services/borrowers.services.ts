import api from "@/lib/axios";
import { Borrower } from "@/types/borrower.types";

export const borrowerService = {
    getAll: async () => {
        try {
            const response = await api.get("/borrowers");
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error in getAll:", error.response?.data || error.message || error);
            throw error;
        }
    },

    getById: async (id: string | number) => {
        try {
            const response = await api.get(`/borrowers/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Error in getById:", error.response?.data || error.message);
            throw error;
        }
    },

    create: async (data: Partial<Borrower>) => {
        try {
            console.log("📥 Received data:", data);

            // Sanitize the data before sending
            const sanitizedData: any = { ...data };

            // Remove undefined and null values
            try {
                Object.keys(sanitizedData).forEach(key => {
                    if (sanitizedData[key] === undefined || sanitizedData[key] === null || sanitizedData[key] === '') {
                        delete sanitizedData[key];
                    }
                });
            } catch (sanitizeError) {
                console.error("Error during sanitization:", sanitizeError);
                throw sanitizeError;
            }

            // Convert lastContact to ISO format if it exists
            if (sanitizedData.lastContact) {
                try {
                    // Check if it's already in ISO format
                    if (!sanitizedData.lastContact.includes('T') || !sanitizedData.lastContact.endsWith('Z')) {
                        const dateObj = new Date(sanitizedData.lastContact);
                        if (isNaN(dateObj.getTime())) {
                            console.warn("Invalid date for lastContact, removing field");
                            delete sanitizedData.lastContact;
                        } else {
                            sanitizedData.lastContact = dateObj.toISOString();
                        }
                    }
                } catch (dateError) {
                    console.error("Error converting date:", dateError);
                    delete sanitizedData.lastContact; // Remove invalid date
                }
            }

            console.log("📤 Sending to API:", sanitizedData);

            const response = await api.post("/borrowers", sanitizedData);
            console.log("✅ API Response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("❌ Error in create:", {
                message: error?.message || "Unknown error",
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                data: error?.response?.data,
                url: error?.config?.url,
                fullError: error
            });

            // Log the raw error as well
            console.error("Raw error object:", error);

            throw error;
        }
    },

    update: async (id: string | number, data: Partial<Borrower>) => {
        try {
            const response = await api.put(`/borrowers/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error("Error in update:", error.response?.data || error.message);
            throw error;
        }
    },

    delete: async (id: string | number) => {
        try {
            const response = await api.delete(`/borrowers/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Error in delete:", error.response?.data || error.message);
            throw error;
        }
    }
};
