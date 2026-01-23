import api from "@/lib/axios";

export const authService = {
    register: async (data: { name: string; email: string; password: string; role: string }) => {
        try {
            const response = await api.post("/auth/register", {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role.toUpperCase() // Convert to uppercase (ADMIN, MANAGER, AGENT)
            });

            let result = response.data;
            const token = result.token || result.access_token;

            // Ensure proper response structure
            if (token && result.user) {
                return {
                    token: token,
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        role: result.user.role,
                        ...result.user
                    }
                };
            }

            return result;
        } catch (error: any) {
            console.error("Registration error:", error.response?.data || error.message);
            throw error;
        }
    },

    login: async (credentials: { email: string; password: string }) => {
        try {
            const response = await api.post("/auth/login", credentials);
            let result = response.data;

            // Handle case where token is present but user is missing
            const token = result.token || result.access_token;

            if (token && !result.user) {
                try {
                    // Fetch user profile using the new token
                    const userResponse = await api.get("/auth/profile", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    result.user = userResponse.data;
                    result.token = token;
                } catch (error) {
                    console.error("Failed to fetch user profile after login:", error);
                }
            }

            // Ensure user data is properly structured
            if (result.token && result.user) {
                return {
                    token: result.token,
                    user: {
                        id: result.user.id,
                        email: result.user.email,
                        name: result.user.name,
                        role: result.user.role, // Should be ADMIN, MANAGER, or AGENT
                        ...result.user // Include any other user data
                    }
                };
            }

            return result;
        } catch (error: any) {
            const status = error.response?.status;
            const errorData = error.response?.data;
            console.error(`❌ Login error [Status: ${status}]:`, errorData || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auth-store");
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get("/auth/profile");
            return response.data;
        } catch (error) {
            console.error("Failed to get current user:", error);
            throw error;
        }
    },

    changePassword: async (data: any) => {
        try {
            const response = await api.put("/auth/change-password", data);
            return response.data;
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("Failed to change password:", errorMsg);
            throw error;
        }
    },

    resetPassword: async (data: { email: string; newPassword: string }) => {
        try {
            const response = await api.put("/auth/change-password", data);
            return response.data;
        } catch (error: any) {
            console.error("Failed to reset password:", error);
            throw error;
        }
    },

    updateProfile: async (data: { name?: string; email?: string }) => {
        try {
            const response = await api.put("/auth/profile", data);
            return response.data;
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            throw error;
        }
    }
};
