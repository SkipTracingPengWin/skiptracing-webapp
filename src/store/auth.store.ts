import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/services/auth';
import { authUtils } from '@/utils/auth/auth.utils';

interface User {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "MANAGER" | "AGENT";
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    loading: boolean;
    error: string | null;

    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            loading: false,
            error: null,

            login: async (credentials) => {
                set({ loading: true, error: null });
                try {
                    const response = await authService.login(credentials);

                    if (!response.user || !response.token) {
                        throw new Error("Invalid login response");
                    }

                    // Save auth data using utility
                    authUtils.saveAuth(response.token, response.user);

                    // Update store
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        token: response.token,
                        loading: false
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
                    set({
                        error: errorMessage,
                        loading: false
                    });
                    throw error;
                }
            },

            register: async (data) => {
                set({ loading: true, error: null });
                try {
                    const response = await authService.register(data);

                    if (!response.user || !response.token) {
                        throw new Error("Invalid registration response");
                    }

                    // Save auth data using utility
                    authUtils.saveAuth(response.token, response.user);

                    // Update store
                    set({
                        user: response.user,
                        isAuthenticated: true,
                        token: response.token,
                        loading: false
                    });
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
                    set({
                        error: errorMessage,
                        loading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                authUtils.clearAuth();
                set({ user: null, isAuthenticated: false, token: null, error: null });
            },

            checkAuth: async () => {
                set({ loading: true });
                try {
                    const user = await authService.getCurrentUser();
                    set({ user, isAuthenticated: true, loading: false });
                } catch (error) {
                    set({ user: null, isAuthenticated: false, loading: false });
                }
            },

            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                token: state.token
            }),
        }
    )
);
