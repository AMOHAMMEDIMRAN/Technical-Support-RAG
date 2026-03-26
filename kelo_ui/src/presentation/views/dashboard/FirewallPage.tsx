import { useEffect, useState } from "react";
import { firewallService } from "@/infrastructure/api/firewall.service";
import type { FirewallConfig, FirewallStats, User } from "@/core/domain/types";
import { Shield, WifiOff, CheckCircle2, AlertTriangle, Plus, X, RefreshCw } from "lucide-react";

const parseLines = (value: string): string[] =>
  value.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

const StatTile = ({ label, value, warn }: { label: string; value: number; warn?: boolean }) => (
  <div className={`rounded-2xl border p-4 transition-all card-hover ${
    warn && value > 0 ? "border-amber-500/25 bg-amber-500/5" : "border-border/70 bg-card"
  }`}>
    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2">{label}</p>
    <p className={`text-3xl font-extrabold ${warn && value > 0 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>{value}</p>
  </div>
);

const SectionCard = ({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4">
    <div>
      <h2 className="text-sm font-bold">{title}</h2>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

const TextareaField = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full min-h-[120px] rounded-xl border border-border/60 bg-background/60 px-3.5 py-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all resize-none"
  />
);

const FirewallPage = () => {
  const [config, setConfig] = useState<FirewallConfig | null>(null);
  const [stats, setStats] = useState<FirewallStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [blockedPathsInput, setBlockedPathsInput] = useState("");
  const [bypassPathsInput, setBypassPathsInput] = useState("");
  const [blockedAgentsInput, setBlockedAgentsInput] = useState("");
  const [allowedIpsInput, setAllowedIpsInput] = useState("");
  const [customBlockMessage, setCustomBlockMessage] = useState("");
  const [newBlockedIp, setNewBlockedIp] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const getUserId = (user: User): string => (user as User & { _id?: string })._id || user.id;

  const refreshStats = async () => { const s = await firewallService.getStats(); setStats(s); };

  const loadConfig = async () => {
    setIsLoading(true); setError(null);
    try {
      const [response, firewallUsers, firewallStats] = await Promise.all([
        firewallService.getConfig(), firewallService.getUsers(), firewallService.getStats(),
      ]);
      setConfig(response); setUsers(firewallUsers); setStats(firewallStats);
      setBlockedPathsInput(response.blockedPaths.join("\n"));
      setBypassPathsInput(response.bypassPaths.join("\n"));
      setBlockedAgentsInput(response.blockedUserAgents.join("\n"));
      setAllowedIpsInput(response.allowedIps.join("\n"));
      setCustomBlockMessage(response.customBlockMessage || "");
    } catch (err: any) { setError(err.response?.data?.error || "Failed to load firewall settings"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { loadConfig(); }, []);

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      const updated = await firewallService.updateConfig({
        enabled: config.enabled, mode: config.mode,
        blockedPaths: parseLines(blockedPathsInput),
        bypassPaths: parseLines(bypassPathsInput),
        blockedUserAgents: parseLines(blockedAgentsInput),
        allowedIps: parseLines(allowedIpsInput),
        customBlockMessage,
      });
      setConfig(updated); await refreshStats();
      setSuccess("Firewall settings saved successfully");
    } catch (err: any) { setError(err.response?.data?.error || "Failed to save"); }
    finally { setIsSaving(false); }
  };

  const handleBlockIp = async () => {
    const ip = newBlockedIp.trim(); if (!ip) return;
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      const updated = await firewallService.blockIp(ip);
      setConfig(updated); await refreshStats(); setNewBlockedIp("");
      setSuccess(`IP ${ip} has been blocked`);
    } catch (err: any) { setError(err.response?.data?.error || "Failed to block IP"); }
    finally { setIsSaving(false); }
  };

  const handleUnblockIp = async (ip: string) => {
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      const updated = await firewallService.unblockIp(ip);
      setConfig(updated); await refreshStats(); setSuccess(`IP ${ip} unblocked`);
    } catch (err: any) { setError(err.response?.data?.error || "Failed to unblock IP"); }
    finally { setIsSaving(false); }
  };

  const handleBlockUser = async () => {
    if (!selectedUserId) return;
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      const updated = await firewallService.blockUser(selectedUserId);
      setConfig(updated); await refreshStats(); setSelectedUserId(""); setSuccess("User blocked");
    } catch (err: any) { setError(err.response?.data?.error || "Failed to block user"); }
    finally { setIsSaving(false); }
  };

  const handleUnblockUser = async (userId: string) => {
    setIsSaving(true); setError(null); setSuccess(null);
    try {
      const updated = await firewallService.unblockUser(userId);
      setConfig(updated); await refreshStats(); setSuccess("User unblocked");
    } catch (err: any) { setError(err.response?.data?.error || "Failed to unblock user"); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-muted-foreground">
      <RefreshCw className="w-5 h-5 animate-spin" /> Loading firewall settings…
    </div>
  );
  if (!config) return (
    <div className="p-8 text-center text-muted-foreground">Firewall configuration is unavailable.</div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in-up">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-destructive mb-1">Security</p>
          <h1 className="text-3xl font-extrabold tracking-tight">In-App Firewall</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Local application firewall controls for laptop/server deployments.
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold ${
          config.enabled
            ? "border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400"
            : "border-border/60 bg-muted text-muted-foreground"
        }`}>
          {config.enabled ? <><CheckCircle2 className="w-3.5 h-3.5" />Firewall Active</> : <><WifiOff className="w-3.5 h-3.5" />Firewall Disabled</>}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3.5 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/8 px-4 py-3.5 text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> {success}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 stagger">
          <StatTile label="Blocked IPs" value={stats.blockedIpsCount} warn />
          <StatTile label="Blocked Users" value={stats.blockedUsersCount} warn />
          <StatTile label="Blocked Paths" value={stats.blockedPathsCount} />
          <StatTile label="Blocked Agents" value={stats.blockedUserAgentsCount} />
          <StatTile label="Allowed IPs" value={stats.allowedIpsCount} />
          <StatTile label="Bypass Paths" value={stats.bypassPathsCount} />
        </div>
      )}

      {/* Mode + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Firewall Mode" desc="Enable/disable the firewall and choose deployment mode.">
          <label className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3.5 cursor-pointer hover:bg-muted/40 transition-colors">
            <div>
              <p className="text-sm font-semibold">Firewall enabled</p>
              <p className="text-xs text-muted-foreground mt-0.5">Toggle all firewall protection</p>
            </div>
            <div className={`relative w-11 h-6 rounded-full transition-colors ${config.enabled ? "bg-primary" : "bg-muted-foreground/20"}`}
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${config.enabled ? "translate-x-6" : "translate-x-1"}`} />
            </div>
          </label>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Deployment Mode</label>
            <select
              className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={config.mode}
              onChange={(e) => setConfig({ ...config, mode: e.target.value as FirewallConfig["mode"] })}
            >
              <option value="laptop">🖥️ Laptop</option>
              <option value="server">🖧 Server</option>
            </select>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Last updated: {new Date(config.updatedAt).toLocaleString()}
          </p>
        </SectionCard>

        {/* Blocked IPs */}
        <SectionCard title="Blocked IPs" desc="Block specific IP addresses from accessing the application.">
          <div className="flex gap-2">
            <input
              value={newBlockedIp}
              onChange={(e) => setNewBlockedIp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBlockIp()}
              placeholder="e.g. 192.168.1.44"
              className="flex-1 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
            <button
              type="button" onClick={handleBlockIp} disabled={isSaving || !newBlockedIp.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Block
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {config.blockedIps.length === 0 && (
              <p className="text-xs text-muted-foreground py-2 text-center">No blocked IPs</p>
            )}
            {config.blockedIps.map((ip) => (
              <div key={ip} className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-3.5 py-2.5">
                <code className="text-xs font-mono font-semibold">{ip}</code>
                <button type="button" onClick={() => handleUnblockIp(ip)} disabled={isSaving}
                  className="flex items-center gap-1 text-xs text-destructive hover:opacity-70 transition-opacity font-medium">
                  <X className="w-3 h-3" /> Unblock
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Blocked Users */}
        <SectionCard title="Blocked Users" desc="Block specific users from accessing the application.">
          <div className="flex gap-2">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">Select a user to block…</option>
              {users.map((user) => {
                const userId = getUserId(user);
                const blocked = config.blockedUsers.some(e => e.userId === userId);
                if (blocked) return null;
                return <option key={userId} value={userId}>{user.firstName} {user.lastName} — {user.email}</option>;
              })}
            </select>
            <button
              type="button" onClick={handleBlockUser} disabled={isSaving || !selectedUserId}
              className="flex items-center gap-1.5 rounded-xl bg-destructive px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Shield className="w-3.5 h-3.5" /> Block
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {config.blockedUsers.length === 0 && (
              <p className="text-xs text-muted-foreground py-2 text-center">No blocked users</p>
            )}
            {config.blockedUsers.map((entry) => (
              <div key={entry.userId} className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 px-3.5 py-2.5">
                <div>
                  <p className="text-xs font-semibold">{entry.firstName} {entry.lastName}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.email}</p>
                </div>
                <button type="button" onClick={() => handleUnblockUser(entry.userId)} disabled={isSaving}
                  className="flex items-center gap-1 text-xs text-destructive hover:opacity-70 transition-opacity font-medium">
                  <X className="w-3 h-3" /> Unblock
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Allowed IPs */}
        <SectionCard title="Allowed IPs" desc="If set, only these IPs can access the app. One per line.">
          <TextareaField value={allowedIpsInput} onChange={setAllowedIpsInput} placeholder={"192.168.1.1\n10.0.0.0"} />
        </SectionCard>

        {/* Blocked Paths */}
        <SectionCard title="Blocked Paths" desc="One path prefix per line, e.g. /api/documents">
          <TextareaField value={blockedPathsInput} onChange={setBlockedPathsInput} placeholder={"/api/admin\n/internal"} />
        </SectionCard>

        {/* Bypass Paths */}
        <SectionCard title="Bypass Paths" desc="Requests to these paths skip all firewall checks.">
          <TextareaField value={bypassPathsInput} onChange={setBypassPathsInput} placeholder={"/health\n/api/public"} />
        </SectionCard>

        {/* Blocked Agents + Block Message */}
        <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-5 lg:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-bold">Blocked User-Agents</h2>
                <p className="text-xs text-muted-foreground mt-0.5">One keyword per line, e.g. curl, bot, scraper</p>
              </div>
              <TextareaField value={blockedAgentsInput} onChange={setBlockedAgentsInput} placeholder={"curl\nbot\nscraper"} />
            </div>
            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-bold">Custom Block Message</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Message shown when a request is blocked</p>
              </div>
              <input
                value={customBlockMessage}
                onChange={(e) => setCustomBlockMessage(e.target.value)}
                placeholder="Access denied by firewall policy"
                className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end pt-2">
        <button
          type="button" onClick={handleSave} disabled={isSaving}
          className="flex items-center gap-2.5 rounded-xl bg-primary px-7 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all btn-glow shadow-lg shadow-primary/20"
        >
          {isSaving ? <><RefreshCw className="w-4 h-4 animate-spin" />Saving…</> : <><Shield className="w-4 h-4" />Save Firewall Settings</>}
        </button>
      </div>
    </div>
  );
};

export default FirewallPage;
