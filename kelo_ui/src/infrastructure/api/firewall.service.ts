import type {
  ApiResponse,
  FirewallConfig,
  FirewallStats,
  User,
} from "@/core/domain/types";
import { API_ENDPOINTS } from "../config/api.config";
import apiClient from "./client";

export const firewallService = {
  getConfig: async (): Promise<FirewallConfig> => {
    const response = await apiClient.get<ApiResponse<FirewallConfig>>(
      API_ENDPOINTS.FIREWALL_CONFIG,
    );

    return response.data.data!;
  },

  updateConfig: async (
    payload: Partial<FirewallConfig>,
  ): Promise<FirewallConfig> => {
    const response = await apiClient.put<ApiResponse<FirewallConfig>>(
      API_ENDPOINTS.FIREWALL_CONFIG,
      payload,
    );

    return response.data.data!;
  },

  blockIp: async (ip: string): Promise<FirewallConfig> => {
    const response = await apiClient.post<ApiResponse<FirewallConfig>>(
      API_ENDPOINTS.FIREWALL_BLOCKED_IPS,
      { ip },
    );

    return response.data.data!;
  },

  unblockIp: async (ip: string): Promise<FirewallConfig> => {
    const response = await apiClient.delete<ApiResponse<FirewallConfig>>(
      API_ENDPOINTS.FIREWALL_UNBLOCK_IP(ip),
    );

    return response.data.data!;
  },

  getStats: async (): Promise<FirewallStats> => {
    const response = await apiClient.get<ApiResponse<FirewallStats>>(
      API_ENDPOINTS.FIREWALL_STATS,
    );

    return response.data.data!;
  },

  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      API_ENDPOINTS.FIREWALL_USERS,
    );

    return response.data.data || [];
  },

  blockUser: async (userId: string): Promise<FirewallConfig> => {
    const response = await apiClient.post<ApiResponse<FirewallConfig>>(
      API_ENDPOINTS.FIREWALL_BLOCKED_USERS,
      { userId },
    );

    return response.data.data!;
  },

  unblockUser: async (userId: string): Promise<FirewallConfig> => {
    const response = await apiClient.delete<ApiResponse<FirewallConfig>>(
      API_ENDPOINTS.FIREWALL_UNBLOCK_USER(userId),
    );

    return response.data.data!;
  },
};
