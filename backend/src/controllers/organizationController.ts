import { Response } from "express";
import { Organization, User } from "../models";
import { AuthRequest, UserRole, UserStatus } from "../types";
import { catchAsync } from "../middleware";
import { getPaginationParams, getSkipValue, getPaginationMeta } from "../utils";
import { createAuditLog } from "../middleware/auditLogger";
import { AuditAction } from "../types";

export const createOrganization = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { name, domain, settings } = req.body;

    // Check if organization already exists
    const existingOrg = await Organization.findOne({
      $or: [{ name }, { domain }],
    });

    if (existingOrg) {
      return res.status(400).json({
        success: false,
        error: "Organization with this name or domain already exists",
      });
    }

    // Update user to CEO role
    const adminUser = await User.findById(req.user!.id);
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Create organization
    const organization = await Organization.create({
      name,
      domain,
      adminUserId: req.user!.id,
      settings: settings || {},
    });

    // Update user with organization and make them CEO
    adminUser.organizationId = organization._id.toString();
    adminUser.role = UserRole.CEO;
    await adminUser.save();

    // Log audit
    await createAuditLog({
      organizationId: organization._id.toString(),
      userId: req.user!.id,
      action: AuditAction.CREATE,
      resource: "organization",
      resourceId: organization._id.toString(),
      details: { name, domain },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: organization,
    });
  },
);

export const getOrganization = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const organization = await Organization.findById(id).populate(
      "adminUserId",
      "firstName lastName email",
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    res.json({
      success: true,
      data: organization,
    });
  },
);

export const getMyOrganization = catchAsync(
  async (req: AuthRequest, res: Response) => {
    if (!req.user!.organizationId) {
      return res.status(404).json({
        success: false,
        error: "No organization assigned",
      });
    }

    const organization = await Organization.findById(
      req.user!.organizationId,
    ).populate("adminUserId", "firstName lastName email");

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    res.json({
      success: true,
      data: organization,
    });
  },
);

export const getAllOrganizations = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);

    const skip = getSkipValue(page!, limit!);
    const sortOptions: any = {};
    sortOptions[sortBy!] = sortOrder === "asc" ? 1 : -1;

    const [organizations, total] = await Promise.all([
      Organization.find()
        .populate("adminUserId", "firstName lastName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit!),
      Organization.countDocuments(),
    ]);

    const pagination = getPaginationMeta(page!, limit!, total);

    res.json({
      success: true,
      data: organizations,
      pagination,
    });
  },
);

export const updateOrganization = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { name, domain, settings, isActive } = req.body;

    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    // Check if user is the admin of this organization or super admin
    if (
      req.user!.role !== UserRole.SUPER_ADMIN &&
      organization.adminUserId !== req.user!.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Only organization admin can update organization",
      });
    }

    if (name) organization.name = name;
    if (domain) organization.domain = domain;
    if (settings)
      organization.settings = { ...organization.settings, ...settings };
    if (typeof isActive === "boolean") organization.isActive = isActive;

    await organization.save();

    // Log audit
    await createAuditLog({
      organizationId: organization._id.toString(),
      userId: req.user!.id,
      action: AuditAction.UPDATE,
      resource: "organization",
      resourceId: organization._id.toString(),
      details: { name, domain, settings, isActive },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Organization updated successfully",
      data: organization,
    });
  },
);

export const deleteOrganization = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const organization = await Organization.findById(id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found",
      });
    }

    // Only super admin can delete organizations
    if (req.user!.role !== UserRole.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        error: "Only super admin can delete organizations",
      });
    }

    // Delete organization
    await Organization.findByIdAndDelete(id);

    // Update all users in this organization
    await User.updateMany(
      { organizationId: id },
      { $unset: { organizationId: 1 }, status: UserStatus.INACTIVE },
    );

    // Log audit
    await createAuditLog({
      organizationId: id,
      userId: req.user!.id,
      action: AuditAction.DELETE,
      resource: "organization",
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Organization deleted successfully",
    });
  },
);
