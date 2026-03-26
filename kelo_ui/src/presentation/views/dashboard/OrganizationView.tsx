import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";
import { organizationService } from "@/infrastructure/api/organization.service";
import { useAuthStore } from "@/presentation/stores/authStore";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/presentation/components/ui/alert-dialog";
import { Building2, Pencil, Trash2, Save, X, RefreshCw, AlertTriangle, CheckCircle2, Activity } from "lucide-react";

interface OrganizationViewProps { organization: Organization | null; }

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{children}</label>
);

const PremiumInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 disabled:opacity-50"
  />
);

const InfoRow = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <span className={`text-xs font-semibold max-w-[180px] truncate ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);

const OrganizationView = ({ organization: initialOrganization }: OrganizationViewProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [organization, setOrganization] = useState(initialOrganization);
  if (!organization) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({ name: organization.name, domain: organization.domain });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = () => { setIsEditing(true); setError(null); setSuccess(null); };
  const handleCancelEdit = () => { setIsEditing(false); setFormData({ name: organization.name, domain: organization.domain }); setError(null); };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null); setSuccess(null);
    try {
      const updated = await organizationService.updateOrganization(organization._id, formData);
      setOrganization(updated); setIsEditing(false);
      setSuccess("Organization updated successfully");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) { setError(err.response?.data?.error || "Failed to update organization"); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    setLoading(true); setError(null);
    try {
      await organizationService.deleteOrganization(organization._id);
      logout(); navigate({ to: "/" });
    } catch (err: any) { setError(err.response?.data?.error || "Failed to delete organization"); setShowDeleteDialog(false); }
    finally { setLoading(false); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-1">Settings</p>
          <h1 className="text-3xl font-extrabold tracking-tight">Organization</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization's identity and settings.</p>
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <button onClick={handleEdit}
              className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
            <button onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3.5 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/8 px-4 py-3.5 text-emerald-700 dark:text-emerald-400 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details / Edit form — left 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-border/70 bg-card overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
          <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">{isEditing ? "Editing Organization" : "Organization Details"}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{isEditing ? "Update your organization information" : "Core information about your organization"}</p>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>Organization Name</FieldLabel>
                  <PremiumInput id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Acme Corporation" required disabled={loading} />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Domain</FieldLabel>
                  <PremiumInput id="domain" name="domain" value={formData.domain} onChange={handleChange} placeholder="acme.com" required disabled={loading} />
                </div>
                <div className="flex items-center gap-2.5 pt-2">
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all btn-glow">
                    {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Changes</>}
                  </button>
                  <button type="button" onClick={handleCancelEdit} disabled={loading}
                    className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted disabled:opacity-50 transition-all">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <InfoRow label="Name" value={organization.name} />
                <InfoRow label="Domain" value={organization.domain} />
                <InfoRow label="Organization ID" value={organization._id} mono />
                <InfoRow label="Max Users" value={String(organization.settings.maxUsers)} />
                <InfoRow label="Created" value={new Date(organization.createdAt).toLocaleDateString()} />
              </div>
            )}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Health */}
          <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-xs font-bold">Account Health</h2>
                <p className="text-[10px] text-muted-foreground">Status overview</p>
              </div>
            </div>
            <div className="px-5 py-4">
              <InfoRow label="State" value={organization.isActive ? "Active" : "Inactive"} />
              <InfoRow label="Allowed Roles" value={`${organization.settings.allowedRoles.length} roles`} />
              <InfoRow label="Features" value={`${organization.settings.features.length} enabled`} />
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/20 bg-destructive/4 p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-destructive">Danger Zone</p>
                <p className="text-[10px] text-muted-foreground">Irreversible actions</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Permanently deletes this organization and all associated data. This action cannot be undone.
            </p>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="w-full rounded-xl border border-destructive/30 bg-background px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive hover:text-white transition-all"
            >
              Delete Organization
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl border-border/70 shadow-2xl">
          <div className="h-[3px] w-full bg-gradient-to-r from-destructive via-destructive/50 to-transparent -mt-6 mb-4 -mx-6 rounded-t-2xl" />
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">Delete Organization?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              This will permanently delete <strong>{organization.name}</strong> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading} className="rounded-xl font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}
              className="rounded-xl bg-destructive text-white hover:bg-destructive/90 font-bold">
              {loading ? "Deleting…" : "Delete Organization"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizationView;
