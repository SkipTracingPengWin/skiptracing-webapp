import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");

        // Try getting from auth-store if not found directly
        if (!token) {
            const authStorage = localStorage.getItem("auth-store");
            if (authStorage) {
                try {
                    const parsed = JSON.parse(authStorage);
                    token = parsed.state?.token || parsed.token;
                } catch (error) {
                    console.error("Error parsing auth storage:", error);
                }
            }
        }

        if (token) {
            // Remove any existing quotes from token if it came from JSON stringify
            const cleanToken = typeof token === 'string' ? token.replace(/['"]+/g, '') : token;
            config.headers.Authorization = `Bearer ${cleanToken}`;
            console.log(`🔑 [API Request] ${config.method?.toUpperCase()} ${config.url} - Token Attached`);
        } else {
            console.warn(`⚠️ [API Request] ${config.method?.toUpperCase()} ${config.url} - NO TOKEN FOUND`);
        }

        return config;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("🔒 Unauthorized access - redirecting to login");
            // Clear headers to prevent loops
            delete api.defaults.headers.common["Authorization"];
            // Optional: Clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("auth-store");
            // Redirect using window.location to ensure full refresh
            if (typeof window !== "undefined" && !window.location.pathname.includes("/auth/login")) {
                window.location.href = "/auth/login";
            }
        }
        return Promise.reject(error);
    }
);
export default api;





