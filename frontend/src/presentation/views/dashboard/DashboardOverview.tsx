import { useAuthStore } from "@/presentation/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";

interface DashboardOverviewProps {
  organization: Organization | null;
}

const DashboardOverview = ({ organization }: DashboardOverviewProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!organization) return null;

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background p-3 md:p-3">
      {/* Top greeting bar */}
      <div className="mb-10 flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Good to see you, <span className="text-primary">{user?.firstName}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]" />
          <span className="text-xs text-muted-foreground">System operational</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — Org + Role stacked */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Organization card */}
          <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/8 blur-2xl pointer-events-none"
            />
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {/* Building / org icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <path d="M3 17.5A3.5 3.5 0 0 0 6.5 21H10v-7H6.5A3.5 3.5 0 0 0 3 17.5z" />
              </svg>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">
              Organization
            </p>
            <h2 className="text-lg font-semibold">{organization.name}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{organization.domain}</p>
          </div>

          {/* Role card */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {/* Key / role icon */}
<svg
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.75"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <circle cx="12" cy="8" r="4" />
  <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
</svg>

            </div>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">
              Your Role
            </p>
            <h2 className="text-lg font-semibold capitalize">{user?.role}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Full system access</p>
          </div>
        </div>

        {/* Middle column — Quick Actions */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 flex flex-col">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
            Quick Actions
          </p>
          <h2 className="text-base font-semibold mb-5">Common tasks</h2>

          <div className="flex flex-col gap-3 flex-1">
            <button
              onClick={() => navigate({ to: "/dashboard/users" })}
              className="group flex items-center gap-4 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 p-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                {/* Users icon */}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground mt-0.5">Add or remove team members</p>
              </div>
              <svg className="ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18 15 12 9 6" />
              </svg>
            </button>

            <button
              onClick={() => navigate({ to: "/dashboard/organization" })}
              className="group flex items-center gap-4 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 p-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                {/* Settings / sliders icon */}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-medium">Organization Settings</p>
                <p className="text-xs text-muted-foreground mt-0.5">Update organization details</p>
              </div>
              <svg className="ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right column — Account card */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary/6 blur-3xl pointer-events-none"
          />

          {/* Avatar */}
          <div className="mb-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide">
              {initials || "U"}
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">
                Account
              </p>
              <h2 className="text-base font-semibold">
                {user?.firstName} {user?.lastName}
              </h2>
            </div>
          </div>

          {/* Info rows */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between rounded-lg bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-sm font-medium truncate max-w-[160px]">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium capitalize">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {user?.status}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;