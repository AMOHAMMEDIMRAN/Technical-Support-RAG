import axios from "axios";
import type { AxiosInstance } from "axios";
import { RAG_API_CONFIG } from "../config/api.config";

// Create axios instance for RAG API
const ragClient: AxiosInstance = axios.create({
  baseURL: RAG_API_CONFIG.BASE_URL,
  timeout: RAG_API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface RagQuery {
  question: string;
  platform?: string | null;
}

export interface RagResponse {
  question?: string;
  answer: string;
  context: string[];
}

// RAG Service
export const ragService = {
  /**
   * Ask a question to the RAG system
   */
  async ask(query: RagQuery): Promise<RagResponse> {
    const response = await ragClient.post<RagResponse>("/ask", query);
    return response.data;
  },

  /**
   * Load project data into the RAG system
   */
  async loadProjects(): Promise<{ projects_loaded: number }> {
    const response = await ragClient.post<{ projects_loaded: number }>("/load_project");
    return response.data;
  },

  /**
   * Check if RAG service is available
   */
  async ping(): Promise<boolean> {
    try {
      const response = await ragClient.get("/");
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export default ragService;
