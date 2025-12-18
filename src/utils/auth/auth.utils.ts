// Authentication utilities for managing tokens and user data

export const authUtils = {
  // Save authentication data after login
  saveAuth: (token: string, user: any) => {
    try {
      // Save token
      if (token) {
        localStorage.setItem("token", token);
        // Set cookie for middleware validation
        document.cookie = `token=${token};path=/;max-age=86400`; // 24 hours
      }

      // Save user info
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set role cookie for middleware
        if (user.role) {
          document.cookie = `role=${user.role};path=/;max-age=86400`; // 24 hours
        }
      }
    } catch (error) {
      console.error("Error saving authentication data:", error);
    }
  },

  // Clear authentication data on logout
  clearAuth: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("auth-store");
      
      // Clear cookies
      document.cookie = "token=;path=/;max-age=0";
      document.cookie = "role=;path=/;max-age=0";
    } catch (error) {
      console.error("Error clearing authentication data:", error);
    }
  },

  // Get user from localStorage
  getUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Get token from localStorage
  getToken: () => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  },

  // Get user role
  getUserRole: () => {
    try {
      const user = authUtils.getUser();
      return user?.role || null;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!authUtils.getToken() && !!authUtils.getUser();
  },
};
