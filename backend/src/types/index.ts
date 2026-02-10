import { Request } from "express";
import { Document } from "mongoose";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  CEO = "CEO",
  MANAGER = "MANAGER",
  DEVELOPER = "DEVELOPER",
  SUPPORT = "SUPPORT",
  HR = "HR",
  FINANCE = "FINANCE",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum ChatStatus {
  ACTIVE = "ACTIVE",
  RESOLVED = "RESOLVED",
  ARCHIVED = "ARCHIVED",
}

export enum DocumentAccessLevel {
  PUBLIC = "PUBLIC", // All users in organization
  ROLE_BASED = "ROLE_BASED", // Specific roles only
  PRIVATE = "PRIVATE", // Specific users only
}

export enum AuditAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  UPLOAD = "UPLOAD",
  DOWNLOAD = "DOWNLOAD",
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IOrganization extends Document {
  name: string;
  domain: string;
  adminUserId: string;
  settings: {
    maxUsers: number;
    allowedRoles: UserRole[];
    features: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat extends Document {
  organizationId: string;
  userId: string;
  title: string;
  status: ChatStatus;
  messages: IMessage[];
  metadata: {
    tags: string[];
    category?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    sources?: string[];
    confidence?: number;
  };
}

export interface IDocument extends Document {
  organizationId: string;
  uploadedBy: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  accessLevel: DocumentAccessLevel;
  allowedRoles: UserRole[];
  allowedUsers: string[];
  metadata: {
    description?: string;
    tags: string[];
    category?: string;
  };
  isProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog extends Document {
  organizationId: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    organizationId?: string;
  };
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
