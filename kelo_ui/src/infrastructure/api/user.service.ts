import apiClient from "./client";
import { API_ENDPOINTS } from "../config/api.config";
import type {
  User,
  ApiResponse,
  UserRole,
  UserStatus,
} from "@/core/domain/types";

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  // Create User
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      `${API_ENDPOINTS.USERS}`,
      data,
    );
    return response.data.data!.user;
  },

  // Get All Users
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >(`${API_ENDPOINTS.USERS}`, { params });
    return response.data.data!;
  },

  // Get User by ID
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      `${API_ENDPOINTS.USERS}/${id}`,
    );
    return response.data.data!.user;
  },

  // Update User
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      `${API_ENDPOINTS.USERS}/${id}`,
      data,
    );
    return response.data.data!.user;
  },

  // Delete User
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
  },

  // Change Password
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  // Update Own Profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
  }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      API_ENDPOINTS.PROFILE,
      data,
    );
    return response.data.data!.user;
  },
};
