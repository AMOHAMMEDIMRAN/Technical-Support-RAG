import { useAuthStore } from "@/presentation/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";
import { Users, Settings, Shield, MessageSquare, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface DashboardOverviewProps {
  organization: Organization | null;
}

const StatCard = ({
  label, value, sub, accent = false,
}: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) => (
  <div className={`relative rounded-2xl border p-5 overflow-hidden group transition-all duration-200 card-hover ${
    accent ? "bg-primary border-primary/30 text-primary-foreground" : "bg-card border-border/70"
  }`}>
    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 bg-current" />
    <p className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
      {label}
    </p>
    <p className={`text-3xl font-extrabold tracking-tight ${accent ? "text-primary-foreground" : "text-foreground"}`}>
      {value}
    </p>
    {sub && (
      <p className={`text-xs mt-1 ${accent ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{sub}</p>
    )}
  </div>
);

const QuickAction = ({
  icon, title, desc, onClick, variant = "default",
}: {
  icon: React.ReactNode; title: string; desc: string;
  onClick: () => void; variant?: "default" | "danger";
}) => (
  <button
    onClick={onClick}
    className={`group w-full flex items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 ${
      variant === "danger"
        ? "border-destructive/20 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive/30"
        : "border-border/60 bg-background hover:border-primary/30 hover:bg-primary/4 hover:shadow-md hover:shadow-primary/8"
    }`}
  >
    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
      variant === "danger"
        ? "bg-destructive/10 text-destructive group-hover:bg-destructive/15"
        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
    }`}>
      {icon}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
    <ArrowUpRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ${
      variant === "danger" ? "text-destructive" : "text-primary"
    }`} />
  </button>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <span className="text-xs font-semibold text-foreground">{value}</span>
  </div>
);

const DashboardOverview = ({ organization }: DashboardOverviewProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!organization) return null;

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in-up">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {greeting}, <span className="text-primary">{user?.firstName}</span> 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening in your workspace today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        <StatCard label="Organization" value={organization.name.split(" ")[0]} sub={organization.domain} accent />
        <StatCard label="Max Users" value={organization.settings.maxUsers} sub="Allowed seats" />
        <StatCard label="Roles" value={organization.settings.allowedRoles.length} sub="Active roles" />
        <StatCard label="Features" value={organization.settings.features.length} sub="Enabled" />
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Quick actions */}
        <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-1">
            Quick Actions
          </p>
          <h2 className="text-base font-bold mb-5">Jump right in</h2>
          <div className="space-y-3 stagger">
            <QuickAction
              icon={<MessageSquare className="w-4 h-4" />}
              title="Open Chat"
              desc="Start a new conversation with Kelo AI"
              onClick={() => navigate({ to: "/chat" })}
            />
            <QuickAction
              icon={<Users className="w-4 h-4" />}
              title="Manage Users"
              desc="Add, remove or update team members"
              onClick={() => navigate({ to: "/dashboard/users" })}
            />
            <QuickAction
              icon={<Settings className="w-4 h-4" />}
              title="Organization Settings"
              desc="Update organization details and config"
              onClick={() => navigate({ to: "/dashboard/organization" })}
            />
            <QuickAction
              icon={<Shield className="w-4 h-4" />}
              title="Firewall Config"
              desc="Manage IP rules and access controls"
              onClick={() => navigate({ to: "/dashboard/firewall" })}
              variant="danger"
            />
          </div>
        </div>

        {/* Profile + Org details */}
        <div className="space-y-5">
          {/* User profile card */}
          <div className="rounded-2xl border border-border/70 bg-card p-5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/6 blur-2xl" />
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[0_0_12px_2px_color-mix(in_srgb,var(--primary)_30%,transparent)]">
                {initials || "U"}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Account</p>
                <p className="text-sm font-bold">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <div className="space-y-0">
              <InfoRow label="Email" value={user?.email || "—"} />
              <InfoRow label="Role" value={user?.role?.toLowerCase().replace("_", " ") || "—"} />
              <InfoRow label="Status" value={user?.status || "—"} />
            </div>
          </div>

          {/* Org card */}
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Organization
            </p>
            <div className="space-y-0">
              <InfoRow label="Name" value={organization.name} />
              <InfoRow label="Domain" value={organization.domain} />
              <InfoRow
                label="Active"
                value={organization.isActive ? "Yes" : "No"}
              />
            </div>
            {organization.settings.features.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {organization.settings.features.map((f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-primary/8 text-primary border border-primary/15"
                    >
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
