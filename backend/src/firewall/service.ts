import fs from "fs/promises";
import path from "path";
import {
  BlockedUserRule,
  FirewallConfig,
  FirewallDecision,
  FirewallStats,
} from "./types";

const FIREWALL_DIR = path.resolve(__dirname, "../../../firewall");
const FIREWALL_CONFIG_PATH = path.resolve(FIREWALL_DIR, "config.json");

const DEFAULT_FIREWALL_CONFIG: FirewallConfig = {
  enabled: true,
  mode: "laptop",
  blockedIps: [],
  allowedIps: [],
  blockedUserAgents: [],
  blockedPaths: [],
  bypassPaths: ["/api/health", "/api/auth/login"],
  blockedUsers: [],
  customBlockMessage: "Access denied by firewall policy",
  updatedAt: new Date().toISOString(),
};

const normalizeIp = (ip: string): string => {
  if (!ip) return "";
  return ip.replace("::ffff:", "").trim();
};

const sanitizeList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
    .filter((entry) => entry.length > 0);
};

const sanitizeBlockedUsers = (value: unknown): BlockedUserRule[] => {
  if (!Array.isArray(value)) return [];

  const sanitized: BlockedUserRule[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const candidate = entry as Partial<BlockedUserRule>;

    if (!candidate.userId || !candidate.email) {
      continue;
    }

    sanitized.push({
      userId: String(candidate.userId).trim(),
      email: String(candidate.email).trim().toLowerCase(),
      firstName: String(candidate.firstName || "").trim(),
      lastName: String(candidate.lastName || "").trim(),
      blockedAt: candidate.blockedAt || new Date().toISOString(),
      blockedBy: candidate.blockedBy,
    });
  }

  return sanitized;
};

export const ensureFirewallConfig = async (): Promise<void> => {
  await fs.mkdir(FIREWALL_DIR, { recursive: true });

  try {
    await fs.access(FIREWALL_CONFIG_PATH);
  } catch {
    await fs.writeFile(
      FIREWALL_CONFIG_PATH,
      JSON.stringify(DEFAULT_FIREWALL_CONFIG, null, 2),
      "utf-8",
    );
  }
};

export const getFirewallConfig = async (): Promise<FirewallConfig> => {
  await ensureFirewallConfig();

  try {
    const raw = await fs.readFile(FIREWALL_CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<FirewallConfig>;

    return {
      enabled: typeof parsed.enabled === "boolean" ? parsed.enabled : true,
      mode: parsed.mode === "server" ? "server" : "laptop",
      blockedIps: sanitizeList(parsed.blockedIps),
      allowedIps: sanitizeList(parsed.allowedIps),
      blockedUserAgents: sanitizeList(parsed.blockedUserAgents),
      blockedPaths: sanitizeList(parsed.blockedPaths),
      bypassPaths: parsed.bypassPaths
        ? sanitizeList(parsed.bypassPaths)
        : DEFAULT_FIREWALL_CONFIG.bypassPaths,
      blockedUsers: sanitizeBlockedUsers(parsed.blockedUsers),
      customBlockMessage:
        typeof parsed.customBlockMessage === "string"
          ? parsed.customBlockMessage.trim()
          : DEFAULT_FIREWALL_CONFIG.customBlockMessage,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      updatedBy: parsed.updatedBy,
    };
  } catch {
    return DEFAULT_FIREWALL_CONFIG;
  }
};

export const updateFirewallConfig = async (
  patch: Partial<FirewallConfig>,
  updatedBy?: { id: string; email: string },
): Promise<FirewallConfig> => {
  const current = await getFirewallConfig();

  const nextConfig: FirewallConfig = {
    ...current,
    enabled:
      typeof patch.enabled === "boolean" ? patch.enabled : current.enabled,
    mode:
      patch.mode === "server"
        ? "server"
        : patch.mode === "laptop"
          ? "laptop"
          : current.mode,
    blockedIps: patch.blockedIps
      ? sanitizeList(patch.blockedIps)
      : current.blockedIps,
    allowedIps: patch.allowedIps
      ? sanitizeList(patch.allowedIps)
      : current.allowedIps,
    blockedUserAgents: patch.blockedUserAgents
      ? sanitizeList(patch.blockedUserAgents)
      : current.blockedUserAgents,
    blockedPaths: patch.blockedPaths
      ? sanitizeList(patch.blockedPaths)
      : current.blockedPaths,
    bypassPaths: patch.bypassPaths
      ? sanitizeList(patch.bypassPaths)
      : current.bypassPaths,
    blockedUsers: patch.blockedUsers
      ? sanitizeBlockedUsers(patch.blockedUsers)
      : current.blockedUsers,
    customBlockMessage:
      typeof patch.customBlockMessage === "string"
        ? patch.customBlockMessage.trim()
        : current.customBlockMessage,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedBy || current.updatedBy,
  };

  await fs.writeFile(
    FIREWALL_CONFIG_PATH,
    JSON.stringify(nextConfig, null, 2),
    "utf-8",
  );

  return nextConfig;
};

export const addBlockedIp = async (
  ip: string,
  updatedBy?: { id: string; email: string },
): Promise<FirewallConfig> => {
  const current = await getFirewallConfig();
  const normalized = normalizeIp(ip);

  if (!normalized) {
    return current;
  }

  if (!current.blockedIps.includes(normalized)) {
    current.blockedIps.push(normalized);
  }

  return updateFirewallConfig({ blockedIps: current.blockedIps }, updatedBy);
};

export const addBlockedUser = async (
  rule: Omit<BlockedUserRule, "blockedAt" | "blockedBy">,
  updatedBy?: { id: string; email: string },
): Promise<FirewallConfig> => {
  const current = await getFirewallConfig();

  const existing = current.blockedUsers.find(
    (entry) => entry.userId === rule.userId,
  );

  if (!existing) {
    current.blockedUsers.push({
      ...rule,
      email: rule.email.toLowerCase(),
      blockedAt: new Date().toISOString(),
      blockedBy: updatedBy,
    });
  }

  return updateFirewallConfig(
    { blockedUsers: current.blockedUsers },
    updatedBy,
  );
};

export const removeBlockedUser = async (
  userId: string,
  updatedBy?: { id: string; email: string },
): Promise<FirewallConfig> => {
  const current = await getFirewallConfig();

  const blockedUsers = current.blockedUsers.filter(
    (entry) => entry.userId !== userId,
  );

  return updateFirewallConfig({ blockedUsers }, updatedBy);
};

export const removeBlockedIp = async (
  ip: string,
  updatedBy?: { id: string; email: string },
): Promise<FirewallConfig> => {
  const current = await getFirewallConfig();
  const normalized = normalizeIp(ip);

  const blockedIps = current.blockedIps.filter((entry) => entry !== normalized);

  return updateFirewallConfig({ blockedIps }, updatedBy);
};

export const evaluateFirewallRequest = (
  config: FirewallConfig,
  input: {
    ip: string;
    path: string;
    userAgent?: string;
    userId?: string;
    userEmail?: string;
  },
): FirewallDecision => {
  if (!config.enabled) {
    return { blocked: false };
  }

  const normalizedIp = normalizeIp(input.ip);
  const requestPath = input.path || "/";
  const userAgent = (input.userAgent || "").toLowerCase();
  const normalizedEmail = (input.userEmail || "").trim().toLowerCase();

  const isBypassedPath = config.bypassPaths.some((bypassPath) =>
    requestPath.startsWith(bypassPath),
  );

  if (isBypassedPath) {
    return { blocked: false };
  }

  const blockedUserMatch = config.blockedUsers.find(
    (entry) =>
      (input.userId && entry.userId === input.userId) ||
      (normalizedEmail && entry.email === normalizedEmail),
  );

  if (blockedUserMatch) {
    return {
      blocked: true,
      reason: `User ${blockedUserMatch.email} is blocked by firewall`,
    };
  }

  if (
    config.allowedIps.length > 0 &&
    !config.allowedIps.includes(normalizedIp)
  ) {
    return { blocked: true, reason: "IP is not in the allow list" };
  }

  if (config.blockedIps.includes(normalizedIp)) {
    return { blocked: true, reason: "IP is blocked by firewall" };
  }

  const matchedPath = config.blockedPaths.find((blockedPath) =>
    requestPath.startsWith(blockedPath),
  );

  if (matchedPath) {
    return { blocked: true, reason: `Path ${matchedPath} is blocked` };
  }

  const matchedUserAgent = config.blockedUserAgents.find((entry) =>
    userAgent.includes(entry.toLowerCase()),
  );

  if (matchedUserAgent) {
    return {
      blocked: true,
      reason: `User-Agent rule matched: ${matchedUserAgent}`,
    };
  }

  return { blocked: false };
};

export const getFirewallStats = (config: FirewallConfig): FirewallStats => {
  return {
    blockedIpsCount: config.blockedIps.length,
    blockedUsersCount: config.blockedUsers.length,
    blockedPathsCount: config.blockedPaths.length,
    blockedUserAgentsCount: config.blockedUserAgents.length,
    allowedIpsCount: config.allowedIps.length,
    bypassPathsCount: config.bypassPaths.length,
    enabled: config.enabled,
    mode: config.mode,
  };
};
