import { Response, NextFunction } from "express";
import { AuditLog } from "../models";
import { AuthRequest, AuditAction } from "../types";

export const auditLogger = (action: AuditAction, resource: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to log after response
    res.json = function (body: any) {
      // Only log if user is authenticated and request was successful
      if (req.user && res.statusCode < 400) {
        const logData = {
          organizationId: req.user.organizationId || "system",
          userId: req.user.id,
          action,
          resource,
          resourceId: req.params.id || req.body.id,
          details: {
            method: req.method,
            path: req.path,
            body: sanitizeBody(req.body),
            query: req.query,
          },
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.get("user-agent"),
        };

        // Log asynchronously without blocking response
        AuditLog.create(logData).catch((error) => {
          console.error("Audit log error:", error);
        });
      }

      return originalJson(body);
    };

    next();
  };
};

// Remove sensitive data from logs
const sanitizeBody = (body: any): any => {
  if (!body) return body;

  const sanitized = { ...body };
  const sensitiveFields = ["password", "token", "secret", "apiKey"];

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
};

// Manual audit log creation
export const createAuditLog = async (data: {
  organizationId: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) => {
  try {
    await AuditLog.create(data);
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
};
