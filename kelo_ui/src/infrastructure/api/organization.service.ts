import apiClient from "./client";
import { API_ENDPOINTS } from "../config/api.config";
import type { Organization, ApiResponse } from "@/core/domain/types";

export const organizationService = {
  // Create Organization
  createOrganization: async (data: {
    name: string;
    domain: string;
  }): Promise<Organization> => {
    const response = await apiClient.post<ApiResponse<Organization>>(
      API_ENDPOINTS.ORGANIZATIONS,
      data,
    );
    return response.data.data!;
  },

  // Get Current User's Organization
  getOrganization: async (): Promise<Organization> => {
    const response = await apiClient.get<ApiResponse<Organization>>(
      API_ENDPOINTS.MY_ORGANIZATION,
    );
    return response.data.data!;
  },

  // Get My Organization (alias for compatibility)
  getMyOrganization: async (): Promise<Organization> => {
    const response = await apiClient.get<ApiResponse<Organization>>(
      API_ENDPOINTS.MY_ORGANIZATION,
    );
    return response.data.data!;
  },

  // Get Organization by ID
  getOrganizationById: async (id: string): Promise<Organization> => {
    const response = await apiClient.get<ApiResponse<Organization>>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${id}`,
    );
    return response.data.data!;
  },

  // Update Organization
  updateOrganization: async (
    id: string,
    data: Partial<Organization>,
  ): Promise<Organization> => {
    const response = await apiClient.put<ApiResponse<Organization>>(
      `${API_ENDPOINTS.ORGANIZATIONS}/${id}`,
      data,
    );
    return response.data.data!;
  },

  // Delete Organization
  deleteOrganization: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.ORGANIZATIONS}/${id}`);
  },

  // Get All Organizations (SUPER_ADMIN only)
  getAllOrganizations: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    organizations: Organization[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        organizations: Organization[];
        total: number;
        page: number;
        totalPages: number;
      }>
    >(API_ENDPOINTS.ORGANIZATIONS, { params });
    return response.data.data!;
  },
};
