import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        let token = null;

        const authStorage = localStorage.getItem("auth-store");
        if (authStorage) {
            try {
                const parsed = JSON.parse(authStorage);
                token = parsed.state?.token || parsed.token;
            } catch (error) {
                console.error("Error parsing auth storage:", error);
            }
        }

        if (!token) {
            token = localStorage.getItem("token");
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🔑 Token attached to request:", token?.substring(0, 20) + "...");
        } else {
            console.warn("⚠️ No token found in storage");
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





