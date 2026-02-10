import { Response } from "express";
import { AuditLog } from "../models";
import { AuthRequest, UserRole } from "../types";
import { catchAsync } from "../middleware";
import { getPaginationParams, getSkipValue, getPaginationMeta } from "../utils";

export const getAuditLogs = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);
    const { action, resource, userId, startDate, endDate } = req.query;

    const query: any = {};

    // Non-super admin can only see logs from their organization
    if (req.user!.role !== UserRole.SUPER_ADMIN) {
      query.organizationId = req.user!.organizationId;
    }

    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (userId) query.userId = userId;

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const skip = getSkipValue(page!, limit!);
    const sortOptions: any = {};
    sortOptions[sortBy || "timestamp"] = sortOrder === "asc" ? 1 : -1;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .populate("userId", "firstName lastName email")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit!),
      AuditLog.countDocuments(query),
    ]);

    const pagination = getPaginationMeta(page!, limit!, total);

    res.json({
      success: true,
      data: logs,
      pagination,
    });
  },
);

export const getAuditLog = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const log = await AuditLog.findById(id).populate(
      "userId",
      "firstName lastName email",
    );

    if (!log) {
      return res.status(404).json({
        success: false,
        error: "Audit log not found",
      });
    }

    // Check access
    if (
      req.user!.role !== UserRole.SUPER_ADMIN &&
      log.organizationId !== req.user!.organizationId
    ) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    res.json({
      success: true,
      data: log,
    });
  },
);

export const getMyAuditLogs = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationParams(req.query);

    const query = {
      userId: req.user!.id,
    };

    const skip = getSkipValue(page!, limit!);
    const sortOptions: any = {};
    sortOptions[sortBy || "timestamp"] = sortOrder === "asc" ? 1 : -1;

    const [logs, total] = await Promise.all([
      AuditLog.find(query).sort(sortOptions).skip(skip).limit(limit!),
      AuditLog.countDocuments(query),
    ]);

    const pagination = getPaginationMeta(page!, limit!, total);

    res.json({
      success: true,
      data: logs,
      pagination,
    });
  },
);

export const getAuditStats = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const query: any = {};

    if (req.user!.role !== UserRole.SUPER_ADMIN) {
      query.organizationId = req.user!.organizationId;
    }

    const [totalLogs, actionStats, resourceStats, recentActivity] =
      await Promise.all([
        AuditLog.countDocuments(query),
        AuditLog.aggregate([
          { $match: query },
          { $group: { _id: "$action", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        AuditLog.aggregate([
          { $match: query },
          { $group: { _id: "$resource", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        AuditLog.find(query)
          .sort({ timestamp: -1 })
          .limit(10)
          .populate("userId", "firstName lastName email"),
      ]);

    res.json({
      success: true,
      data: {
        totalLogs,
        actionStats,
        resourceStats,
        recentActivity,
      },
    });
  },
);
