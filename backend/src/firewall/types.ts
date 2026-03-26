export type FirewallMode = "laptop" | "server";

export interface BlockedUserRule {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  blockedAt: string;
  blockedBy?: {
    id: string;
    email: string;
  };
}

export interface FirewallConfig {
  enabled: boolean;
  mode: FirewallMode;
  blockedIps: string[];
  allowedIps: string[];
  blockedUserAgents: string[];
  blockedPaths: string[];
  bypassPaths: string[];
  blockedUsers: BlockedUserRule[];
  customBlockMessage?: string;
  updatedAt: string;
  updatedBy?: {
    id: string;
    email: string;
  };
}

export interface FirewallDecision {
  blocked: boolean;
  reason?: string;
}

export interface FirewallStats {
  blockedIpsCount: number;
  blockedUsersCount: number;
  blockedPathsCount: number;
  blockedUserAgentsCount: number;
  allowedIpsCount: number;
  bypassPathsCount: number;
  enabled: boolean;
  mode: FirewallMode;
}
