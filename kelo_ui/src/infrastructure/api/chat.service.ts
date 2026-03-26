import apiClient from "./client";
import { API_ENDPOINTS } from "../config/api.config";
import type { ApiResponse, Chat } from "@/core/domain/types";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ListParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const chatService = {
  async listChats(
    params: ListParams = {},
  ): Promise<{ data: Chat[]; pagination?: Pagination }> {
    const response = await apiClient.get<ApiResponse<Chat[]>>(
      API_ENDPOINTS.CHATS,
      { params },
    );

    return {
      data: response.data.data ?? [],
      
    };
  },

  async getChat(id: string): Promise<Chat> {
    const response = await apiClient.get<ApiResponse<Chat>>(
      `${API_ENDPOINTS.CHATS}/${id}`,
    );
    return response.data.data!;
  },

  async createChat(payload: {
    title?: string;
    message: string;
  }): Promise<Chat> {
    const response = await apiClient.post<ApiResponse<Chat>>(
      API_ENDPOINTS.CHATS,
      payload,
    );
    return response.data.data!;
  },

  async sendMessage(id: string, message: string): Promise<Chat> {
    const response = await apiClient.post<ApiResponse<Chat>>(
      API_ENDPOINTS.CHAT_MESSAGES(id),
      { message },
    );
    return response.data.data!;
  },

  async updateChat(
    id: string,
    payload: Partial<Pick<Chat, "title" | "status" | "metadata">>,
  ): Promise<Chat> {
    const response = await apiClient.put<ApiResponse<Chat>>(
      `${API_ENDPOINTS.CHATS}/${id}`,
      payload,
    );
    return response.data.data!;
  },

  async deleteChat(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.CHATS}/${id}`);
  },
};
