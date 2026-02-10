import { Request, Response } from "express";
import { User } from "../models";
import { AuthRequest, UserStatus } from "../types";
import { generateToken } from "../utils";
import { catchAsync } from "../middleware";
import { createAuditLog } from "../middleware/auditLogger";
import { AuditAction } from "../types";

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  // Check if user is active
  if (user.status !== UserStatus.ACTIVE) {
    return res.status(401).json({
      success: false,
      error: "Your account is inactive. Please contact your administrator.",
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      error: "Invalid email or password",
    });
  }

  // Generate token
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  });

  // Update last login
  user.lastLoginAt = new Date();
  await user.save();

  // Log audit
  await createAuditLog({
    organizationId: user.organizationId || "system",
    userId: user._id.toString(),
    action: AuditAction.LOGIN,
    resource: "auth",
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        organizationId: user.organizationId,
      },
    },
  });
});

export const getProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  },
);

export const updateProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { firstName, lastName, email } = req.body;

    const user = await User.findById(req.user!.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    // Log audit
    await createAuditLog({
      organizationId: user.organizationId || "system",
      userId: user._id.toString(),
      action: AuditAction.UPDATE,
      resource: "user",
      resourceId: user._id.toString(),
      details: { firstName, lastName, email },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  },
);

export const changePassword = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log audit
    await createAuditLog({
      organizationId: user.organizationId || "system",
      userId: user._id.toString(),
      action: AuditAction.UPDATE,
      resource: "auth",
      details: { action: "password_change" },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  },
);

export const logout = catchAsync(async (req: AuthRequest, res: Response) => {
  // Log audit
  if (req.user) {
    await createAuditLog({
      organizationId: req.user.organizationId || "system",
      userId: req.user.id,
      action: AuditAction.LOGOUT,
      resource: "auth",
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  res.json({
    success: true,
    message: "Logout successful",
  });
});
