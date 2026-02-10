// User Roles
export const UserRole = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CEO: "CEO",
  MANAGER: "MANAGER",
  DEVELOPER: "DEVELOPER",
  SUPPORT: "SUPPORT",
  HR: "HR",
  FINANCE: "FINANCE",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// User Status
export const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// User Interface
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Auth Interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Organization Interface
export interface Organization {
  _id: string;
  name: string;
  domain: string;
  adminUserId: string;
  settings: {
    maxUsers: number;
    allowedRoles: UserRole[];
    features: string[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Chat Interface
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    sources?: string[];
    confidence?: number;
  };
}

export interface Chat {
  _id: string;
  organizationId: string;
  userId: string;
  title: string;
  status: "ACTIVE" | "RESOLVED" | "ARCHIVED";
  messages: Message[];
  metadata: {
    tags: string[];
    category?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Document Interface
export interface Document {
  _id: string;
  organizationId: string;
  uploadedBy: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  accessLevel: "PUBLIC" | "ROLE_BASED" | "PRIVATE";
  allowedRoles: UserRole[];
  allowedUsers: string[];
  metadata: {
    description?: string;
    tags: string[];
    category?: string;
  };
  isProcessed: boolean;
  createdAt: string;
  updatedAt: string;
}
