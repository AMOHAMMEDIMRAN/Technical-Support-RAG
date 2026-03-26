const getCurrentHostname = () => {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }
  return "localhost";
};

const defaultApiBaseUrl = () => {
  const host = getCurrentHostname();
  return `http://${host}:5000/api`;
};

const defaultRagBaseUrl = () => {
  const host = getCurrentHostname();
  return `http://${host}:8000`;
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl(),
  TIMEOUT: 180000,
};

// RAG API Configuration
export const RAG_API_CONFIG = {
  BASE_URL: import.meta.env.VITE_RAG_API_BASE_URL || defaultRagBaseUrl(),
  TIMEOUT: 180000, // 3 minutes for RAG processing
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

  // Firewall
  FIREWALL_CONFIG: "/firewall/config",
  FIREWALL_STATS: "/firewall/stats",
  FIREWALL_USERS: "/firewall/users",
  FIREWALL_BLOCKED_IPS: "/firewall/blocked-ips",
  FIREWALL_UNBLOCK_IP: (ip: string) =>
    `/firewall/blocked-ips/${encodeURIComponent(ip)}`,
  FIREWALL_BLOCKED_USERS: "/firewall/blocked-users",
  FIREWALL_UNBLOCK_USER: (userId: string) =>
    `/firewall/blocked-users/${encodeURIComponent(userId)}`,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_DATA: "user_data",
};
