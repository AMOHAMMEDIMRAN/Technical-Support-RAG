import apiClient from "./client";
import { API_ENDPOINTS, STORAGE_KEYS } from "../config/api.config";
import type {
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from "@/core/domain/types";

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials,
    );

    // Store token and user data
    if (response.data.success && response.data.data) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.data.token);
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.data.data.user),
      );
    }

    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } finally {
      // Clear storage regardless of API response
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  },

  // Get Profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.PROFILE,
    );
    return response.data.data!;
  },

  // Update Profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.PROFILE,
      data,
    );

    // Update stored user data
    if (response.data.data) {
      localStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.data.data),
      );
    }

    return response.data.data!;
  },

  // Change Password
  changePassword: async (
    currentPassword: string,
    newPassword: string,
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  // Get stored token
  getStoredToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
};
