// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  TIMEOUT: 10000,
};

// RAG API Configuration
export const RAG_API_CONFIG = {
  BASE_URL: import.meta.env.VITE_RAG_API_BASE_URL || "http://127.0.0.1:8000",
  TIMEOUT: 120000, // 2 minutes for RAG processing
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",

  // Organizations
  ORGANIZATIONS: "/organizations",
  MY_ORGANIZATION: "/organizations/my-organization",

  // Users
  USERS: "/users",

  // Chats
  CHATS: "/chats",
  CHAT_MESSAGES: (id: string) => `/chats/${id}/messages`,

  // Documents
  DOCUMENTS: "/documents",
  DOCUMENT_DOWNLOAD: (id: string) => `/documents/${id}/download`,

  // Audit Logs
  AUDIT_LOGS: "/audit-logs",
  MY_AUDIT_LOGS: "/audit-logs/my-logs",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
};
