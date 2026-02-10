import { Response, NextFunction } from "express";
import { AuthRequest, UserRole } from "../types";

// Role hierarchy for permission checking
const roleHierarchy: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.CEO]: 90,
  [UserRole.MANAGER]: 70,
  [UserRole.DEVELOPER]: 50,
  [UserRole.SUPPORT]: 50,
  [UserRole.HR]: 50,
  [UserRole.FINANCE]: 50,
};

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const userRole = req.user.role;

    // Super admin can access everything
    if (userRole === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error:
          "Insufficient permissions. You do not have access to this resource.",
      });
    }

    return next();
  };
};

// Check if user has minimum role level
export const requireMinRole = (minRole: UserRole) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const userRole = req.user.role;
    const userLevel = roleHierarchy[userRole] || 0;
    const minLevel = roleHierarchy[minRole] || 0;

    if (userLevel < minLevel) {
      return res.status(403).json({
        success: false,
        error: "Insufficient permissions",
      });
    }

    return next();
  };
};

// Check if user belongs to an organization
export const requireOrganization = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  // Super admin doesn't need organization
  if (req.user.role === UserRole.SUPER_ADMIN) {
    return next();
  }

  if (!req.user.organizationId) {
    return res.status(403).json({
      success: false,
      error: "No organization assigned. Please contact your administrator.",
    });
  }

  return next();
};

// Check if user can access resource in same organization
export const requireSameOrganization = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  // Super admin can access all organizations
  if (req.user.role === UserRole.SUPER_ADMIN) {
    return next();
  }

  const targetOrgId = req.params.organizationId || req.body.organizationId;

  if (targetOrgId && targetOrgId !== req.user.organizationId) {
    return res.status(403).json({
      success: false,
      error: "Cannot access resources from other organizations",
    });
  }

  return next();
};

// Check if user is super admin
export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      error: "Super admin access required",
    });
  }

  return next();
};

// Check if user is organization admin (CEO)
export const requireOrgAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }

  if (
    req.user.role !== UserRole.SUPER_ADMIN &&
    req.user.role !== UserRole.CEO
  ) {
    return res.status(403).json({
      success: false,
      error: "Organization admin access required",
    });
  }

  return next();
};
