// src/services/api.ts
import { User, UserFormData, UserConfig, SyncLog } from "../interfaces";

const API_URL = import.meta.env.VITE_API_URL || "https://synctool.imcbs.com";

export const api = {
  // Initialize database
  initializeDatabase: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/initialize`, {
        method: "GET",
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error initializing database:", error);
      return false;
    }
  },

  // Users
  listUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/list-users`);
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error("Error listing users:", error);
      return [];
    }
  },

  createUser: async (
    userData: UserFormData
  ): Promise<{
    success: boolean;
    clientId?: string;
    accessToken?: string;
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/add-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: "Network error" };
    }
  },

  updateUser: async (
    clientId: string,
    userData: UserFormData
  ): Promise<{ success: boolean; accessToken?: string; error?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/update-users/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: "Network error" };
    }
  },

  deleteUser: async (
    clientId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/delete-users/${clientId}`,
        {
          method: "DELETE",
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: "Network error" };
    }
  },

  getUserConfig: async (
    clientId: string
  ): Promise<{ success: boolean; config?: UserConfig; error?: string }> => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${clientId}/config`
      );
      return await response.json();
    } catch (error) {
      console.error("Error getting user config:", error);
      return { success: false, error: "Network error" };
    }
  },

  // Logs
  getSyncLogs: async (): Promise<SyncLog[]> => {
    try {
      const response = await fetch(`${API_URL}/api/admin/logs`);
      const data = await response.json();
      return data.logs || [];
    } catch (error) {
      console.error("Error getting sync logs:", error);
      return [];
    }
  },
};
