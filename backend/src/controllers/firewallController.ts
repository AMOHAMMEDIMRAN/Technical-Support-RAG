import { Response } from "express";
import { catchAsync } from "../middleware";
import { User } from "../models";
import { AuthRequest } from "../types";
import {
  addBlockedIp,
  addBlockedUser,
  getFirewallStats,
  getFirewallConfig,
  removeBlockedIp,
  removeBlockedUser,
  updateFirewallConfig,
} from "../firewall";

export const getConfig = catchAsync(
  async (_req: AuthRequest, res: Response) => {
    const config = await getFirewallConfig();

    res.json({
      success: true,
      data: config,
    });
  },
);

export const updateConfig = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const {
      enabled,
      mode,
      blockedIps,
      allowedIps,
      blockedPaths,
      blockedUserAgents,
      bypassPaths,
      customBlockMessage,
    } = req.body;

    const config = await updateFirewallConfig(
      {
        enabled,
        mode,
        blockedIps,
        allowedIps,
        blockedPaths,
        blockedUserAgents,
        bypassPaths,
        customBlockMessage,
      },
      req.user ? { id: req.user.id, email: req.user.email } : undefined,
    );

    res.json({
      success: true,
      message: "Firewall configuration updated",
      data: config,
    });
  },
);

export const blockIp = catchAsync(async (req: AuthRequest, res: Response) => {
  const { ip } = req.body;

  if (!ip || typeof ip !== "string") {
    return res.status(400).json({
      success: false,
      error: "IP address is required",
    });
  }

  const config = await addBlockedIp(
    ip,
    req.user ? { id: req.user.id, email: req.user.email } : undefined,
  );

  res.json({
    success: true,
    message: `IP ${ip} blocked`,
    data: config,
  });
});

export const unblockIp = catchAsync(async (req: AuthRequest, res: Response) => {
  const { ip } = req.params;

  if (!ip) {
    return res.status(400).json({
      success: false,
      error: "IP address is required",
    });
  }

  const config = await removeBlockedIp(
    ip,
    req.user ? { id: req.user.id, email: req.user.email } : undefined,
  );

  res.json({
    success: true,
    message: `IP ${ip} unblocked`,
    data: config,
  });
});

export const getFirewallUsers = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const query: Record<string, unknown> = {};

    if (req.user?.role !== "SUPER_ADMIN") {
      query.organizationId = req.user?.organizationId;
    }

    const users = await User.find(query)
      .select("_id firstName lastName email role status organizationId")
      .sort({ firstName: 1, lastName: 1 });

    res.json({
      success: true,
      data: users,
    });
  },
);

export const blockUser = catchAsync(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({
      success: false,
      error: "User ID is required",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  if (req.user?.role !== "SUPER_ADMIN") {
    if (
      !req.user?.organizationId ||
      req.user.organizationId !== user.organizationId
    ) {
      return res.status(403).json({
        success: false,
        error: "Cannot block user from another organization",
      });
    }
  }

  if (req.user?.id === user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: "You cannot block your own account",
    });
  }

  const config = await addBlockedUser(
    {
      userId: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    req.user ? { id: req.user.id, email: req.user.email } : undefined,
  );

  res.json({
    success: true,
    message: `User ${user.email} blocked`,
    data: config,
  });
});

export const unblockUser = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    const config = await removeBlockedUser(
      userId,
      req.user ? { id: req.user.id, email: req.user.email } : undefined,
    );

    res.json({
      success: true,
      message: "User unblocked",
      data: config,
    });
  },
);

export const getStats = catchAsync(async (_req: AuthRequest, res: Response) => {
  const firewallConfig = await getFirewallConfig();
  const stats = getFirewallStats(firewallConfig);

  res.json({
    success: true,
    data: stats,
  });
});
