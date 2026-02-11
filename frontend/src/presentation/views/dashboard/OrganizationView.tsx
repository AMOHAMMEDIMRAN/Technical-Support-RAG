import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";
import { organizationService } from "@/infrastructure/api/organization.service";
import { useAuthStore } from "@/presentation/stores/authStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/presentation/components/ui/alert-dialog";

interface OrganizationViewProps {
  organization: Organization | null;
}

const OrganizationView = ({
  organization: initialOrganization,
}: OrganizationViewProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [organization, setOrganization] = useState(initialOrganization);

  if (!organization) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    domain: organization.domain,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ name: organization.name, domain: organization.domain });
    setError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await organizationService.updateOrganization(
        organization._id,
        formData
      );
      setOrganization(updated);
      setIsEditing(false);
      setSuccess("Organization updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await organizationService.deleteOrganization(organization._id);
      logout();
      navigate({ to: "/" });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete organization");
      setShowDeleteDialog(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background p-3 md:p-3">

      {/* Page header */}
      <div className="mb-10 flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Settings
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Organization</h1>
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
            >
              {/* Pencil icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                <path d="m15 5 4 4" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
            >
              {/* Trash icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Toast-style feedback */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          {success}
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Details card — left 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/8 blur-2xl pointer-events-none"
          />

          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* Grid / org icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <path d="M3 17.5A3.5 3.5 0 0 0 6.5 21H10v-7H6.5A3.5 3.5 0 0 0 3 17.5z" />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">
            {isEditing ? "Editing" : "Organization Details"}
          </p>
          <h2 className="text-base font-semibold mb-6">
            {isEditing ? "Update your organization information" : "Information about your organization"}
          </h2>

          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Organization Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="domain"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Domain
                </label>
                <input
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="acme.com"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  className="rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
                <span className="text-xs text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{organization.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
                <span className="text-xs text-muted-foreground">Domain</span>
                <span className="text-sm font-medium">{organization.domain}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
                <span className="text-xs text-muted-foreground">Organization ID</span>
                <span className="text-xs font-mono text-muted-foreground">{organization._id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Status card — right col */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/6 blur-3xl pointer-events-none"
            />

            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {/* Activity / pulse icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>

            <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">
              Status
            </p>
            <h2 className="text-base font-semibold mb-4">Account Health</h2>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
                <span className="text-xs text-muted-foreground">State</span>
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  {organization.isActive ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_1px_rgba(16,185,129,0.5)]" />
                      Active
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Danger zone card */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              {/* Warning triangle icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-destructive/70 mb-0.5">
              Danger Zone
            </p>
            <h2 className="text-base font-semibold mb-1">Delete Organization</h2>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Permanently removes this organization and all associated data. This cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full rounded-xl border border-destructive/30 bg-background px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive hover:text-primary-foreground transition-all duration-200"
            >
              Delete Organization
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this organization? This action cannot be undone.
              All users associated with this organization will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizationView;