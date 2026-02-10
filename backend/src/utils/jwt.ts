import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserRole } from "../types";

export const generateToken = (payload: {
  id: string;
  email: string;
  role: UserRole;
  organizationId?: string;
}): string => {
  return jwt.sign(payload, String(config.jwt.secret), {
    expiresIn: String(config.jwt.expiresIn),
  } as any);
};

export const generateRefreshToken = (payload: {
  id: string;
  email: string;
}): string => {
  return jwt.sign(payload, String(config.jwt.secret), {
    expiresIn: String(config.jwt.refreshExpiresIn),
  } as any);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, String(config.jwt.secret));
};
