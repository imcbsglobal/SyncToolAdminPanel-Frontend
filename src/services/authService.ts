// src/services/authService.ts
const API_URL = import.meta.env.VITE_API_URL || "https://synctool.imcbs.com";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  adminId?: number;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include", // Important for cookies
      });

      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error occurred" };
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        credentials: "include", // Important for cookies
      });

      return await response.json();
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "Network error occurred" };
    }
  },

  // Simplified checkAuth without timeout or AbortController
  checkAuth: async (): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/me`, {
        credentials: "include",
        // No signal parameter to prevent aborting
      });

      return await response.json();
    } catch (error: any) {
      console.error("Auth check error:", error);

      return {
        success: false,
        error:
          error.name === "AbortError"
            ? "Connection timeout"
            : "Failed to verify authentication",
      };
    }
  },
};
