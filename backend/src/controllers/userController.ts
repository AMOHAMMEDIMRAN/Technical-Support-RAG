import { Response } from "express";
import { User } from "../models";
import { AuthRequest, UserRole, UserStatus } from "../types";
import { catchAsync } from "../middleware";
import { getPaginationParams, getSkipValue, getPaginationMeta } from "../utils";
import { createAuditLog } from "../middleware/auditLogger";
import { AuditAction } from "../types";

export const createUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { email, firstName, lastName, role, password } = req.body;

    // Check if user has an organization
    if (!req.user!.organizationId) {
      return res.status(400).json({
        success: false,
        error: "No organization assigned. Please create an organization first.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      password: password || "temp123456", // Temporary password
      organizationId: req.user!.organizationId,
      status: UserStatus.ACTIVE,
    });

    // Log audit
    await createAuditLog({
      organizationId: req.user!.organizationId || "system",
      userId: req.user!.id,
      action: AuditAction.CREATE,
      resource: "user",
      resourceId: user._id.toString(),
      details: { email, role },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  },
);

export const getUsers = catchAsync(async (req: AuthRequest, res: Response) => {
  const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
  const { role, status, search } = req.query;

  const query: any = {};

  // Non-super admin can only see users in their organization
  if (req.user!.role !== UserRole.SUPER_ADMIN) {
    if (!req.user!.organizationId) {
      return res.status(400).json({
        success: false,
        error: "No organization assigned. Please create an organization first.",
      });
    }
    query.organizationId = req.user!.organizationId;
  }

  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = getSkipValue(page!, limit!);
  const sortOptions: any = {};
  sortOptions[sortBy!] = sortOrder === "asc" ? 1 : -1;

  const [users, total] = await Promise.all([
    User.find(query).sort(sortOptions).skip(skip).limit(limit!),
    User.countDocuments(query),
  ]);

  const pagination = getPaginationMeta(page!, limit!, total);

  res.json({
    success: true,
    data: users,
    pagination,
  });
});

export const getUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  // Check access
  if (
    req.user!.role !== UserRole.SUPER_ADMIN &&
    req.user!.role !== UserRole.CEO &&
    user._id.toString() !== req.user!.id
  ) {
    return res.status(403).json({
      success: false,
      error: "Access denied",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

export const updateUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, email, role, status } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check access
    const isSelfUpdate = user._id.toString() === req.user!.id;
    const isAdmin =
      req.user!.role === UserRole.SUPER_ADMIN ||
      req.user!.role === UserRole.CEO;

    if (!isSelfUpdate && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    // Only admins can change role and status
    if (!isAdmin && (role || status)) {
      return res.status(403).json({
        success: false,
        error: "Only admins can change role and status",
      });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role && isAdmin) user.role = role;
    if (status && isAdmin) user.status = status;

    await user.save();

    // Log audit
    await createAuditLog({
      organizationId: user.organizationId || "system",
      userId: req.user!.id,
      action: AuditAction.UPDATE,
      resource: "user",
      resourceId: user._id.toString(),
      details: { firstName, lastName, email, role, status },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  },
);

export const deleteUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Only admins can delete users
    if (
      req.user!.role !== UserRole.SUPER_ADMIN &&
      req.user!.role !== UserRole.CEO
    ) {
      return res.status(403).json({
        success: false,
        error: "Only admins can delete users",
      });
    }

    // Cannot delete yourself
    if (user._id.toString() === req.user!.id) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(id);

    // Log audit
    await createAuditLog({
      organizationId: user.organizationId || "system",
      userId: req.user!.id,
      action: AuditAction.DELETE,
      resource: "user",
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  },
);

export const toggleUserStatus = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Only admins can toggle status
    if (
      req.user!.role !== UserRole.SUPER_ADMIN &&
      req.user!.role !== UserRole.CEO
    ) {
      return res.status(403).json({
        success: false,
        error: "Only admins can toggle user status",
      });
    }

    user.status =
      user.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;
    await user.save();

    // Log audit
    await createAuditLog({
      organizationId: user.organizationId || "system",
      userId: req.user!.id,
      action: AuditAction.UPDATE,
      resource: "user",
      resourceId: id,
      details: { status: user.status },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: `User ${user.status === UserStatus.ACTIVE ? "activated" : "deactivated"} successfully`,
      data: user,
    });
  },
);
