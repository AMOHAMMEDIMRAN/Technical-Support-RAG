import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config as appConfig } from "../config";
import { AuthRequest } from "../types";
import { evaluateFirewallRequest, getFirewallConfig } from "./service";

interface TokenPayload {
  id: string;
  email: string;
}

export const firewallMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const firewallConfig = await getFirewallConfig();
    const authHeader = req.headers.authorization;

    let userId: string | undefined;
    let userEmail: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, appConfig.jwt.secret) as TokenPayload;
        userId = decoded.id;
        userEmail = decoded.email;
      } catch {
        // Ignore token parse errors here; auth middleware handles auth.
      }
    }

    const decision = evaluateFirewallRequest(firewallConfig, {
      ip: req.ip || req.socket.remoteAddress || "",
      path: req.path,
      userAgent: req.get("user-agent") || "",
      userId,
      userEmail,
    });

    if (!decision.blocked) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: "Request blocked by in-app firewall",
      message: decision.reason || firewallConfig.customBlockMessage,
    });
  } catch {
    return next();
  }
};
