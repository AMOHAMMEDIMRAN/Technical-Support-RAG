// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  TIMEOUT: 10000,
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
