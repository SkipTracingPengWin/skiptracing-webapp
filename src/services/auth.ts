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

            // Handle case where token is present but user is missing (flat structure)
            const token = result.token || result.access_token;

            // Checks if we have user info at the root level typical of the flat response
            // e.g. { "_id": "...", "email": "...", "role": "...", "token": "..." }
            const hasRootUserInfo = result._id && result.email && result.role;

            if (token && hasRootUserInfo) {
                // Construct user object from root properties
                result.user = {
                    id: result._id,
                    email: result.email,
                    name: result.name,
                    role: result.role,
                    ...result // spread the rest just in case
                };
                result.token = token;
            } else if (token && !result.user) {
                // ONLY if we really don't have user info, try to fetch it
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
                        id: result.user.id || result.user._id, // Handle both id formats
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
