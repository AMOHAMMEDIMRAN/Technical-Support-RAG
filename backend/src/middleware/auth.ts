import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { AuthRequest, UserRole } from "../types";
import { config } from "../config";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: UserRole;
      organizationId?: string;
    };

    // Check if user exists and is active
    const user = await User.findById(decoded.id);

    if (!user || user.status !== "ACTIVE") {
      return res.status(401).json({
        success: false,
        error: "User not found or inactive",
      });
    }

    // Attach user to request - use DB values for latest data
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      organizationId: user.organizationId, // Use DB value, not JWT value
    };

    return next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Authentication failed",
    });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: UserRole;
      organizationId?: string;
    };

    req.user = decoded;
    return next();
  } catch (error) {
    return next();
  }
};
