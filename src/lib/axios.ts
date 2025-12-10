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
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 403) {
            console.error("🚫 403 Forbidden - Token might be invalid or missing");
        }
        return Promise.reject(error);
    }
);

export default api;
