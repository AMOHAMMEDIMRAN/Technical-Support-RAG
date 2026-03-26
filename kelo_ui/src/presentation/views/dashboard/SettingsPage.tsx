import { useState } from "react";
import { useAuthStore } from "@/presentation/stores/authStore";
import { authService } from "@/infrastructure/api/auth.service";
import { User, Lock, CheckCircle2, AlertTriangle, Save, RefreshCw, Shield } from "lucide-react";

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{children}</label>
);

const PremiumInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 disabled:opacity-50"
  />
);

const SectionCard = ({ icon, title, desc, children }: {
  icon: React.ReactNode; title: string; desc: string; children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
    <div className="px-6 py-5 border-b border-border/50 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">{icon}</div>
      <div>
        <h2 className="text-sm font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Alert = ({ type, msg }: { type: "success" | "error"; msg: string }) => (
  <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm mb-4 ${
    type === "success"
      ? "border-emerald-400/30 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400"
      : "border-destructive/25 bg-destructive/8 text-destructive"
  }`}>
    {type === "success"
      ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
      : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
    }
    {msg}
  </div>
);

const SettingsPage = () => {
  const { user, setUser } = useAuthStore();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true); setProfileError(null); setProfileSuccess(null);
    try {
      const updated = await authService.updateProfile(profileData);
      setUser(updated); setProfileSuccess("Profile updated successfully");
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) { setProfileError(err.response?.data?.error || "Failed to update profile"); }
    finally { setProfileLoading(false); }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true); setPasswordError(null); setPasswordSuccess(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match"); setPasswordLoading(false); return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters"); setPasswordLoading(false); return;
    }
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: any) { setPasswordError(err.response?.data?.error || "Failed to change password"); }
    finally { setPasswordLoading(false); }
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in-up">
      {/* Page header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-1">Account</p>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and account security.</p>
      </div>

      {/* Profile snapshot */}
      <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/70 bg-card">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold shadow-[0_0_16px_2px_color-mix(in_srgb,var(--primary)_25%,transparent)]">
          {initials || "U"}
        </div>
        <div>
          <p className="text-base font-bold">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {user?.status || "Active"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile form */}
        <SectionCard
          icon={<User className="w-4 h-4" />}
          title="Profile Information"
          desc="Update your name and email address."
        >
          {profileError && <Alert type="error" msg={profileError} />}
          {profileSuccess && <Alert type="success" msg={profileSuccess} />}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel>First Name</FieldLabel>
                <PremiumInput name="firstName" value={profileData.firstName} onChange={handleProfileChange} required disabled={profileLoading} placeholder="John" />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Last Name</FieldLabel>
                <PremiumInput name="lastName" value={profileData.lastName} onChange={handleProfileChange} required disabled={profileLoading} placeholder="Doe" />
              </div>
            </div>

            <div className="space-y-1.5">
              <FieldLabel>Email Address</FieldLabel>
              <PremiumInput name="email" type="email" value={profileData.email} onChange={handleProfileChange} required disabled={profileLoading} placeholder="you@company.com" />
            </div>

            <button
              type="submit" disabled={profileLoading}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all btn-glow"
            >
              {profileLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />Saving…</> : <><Save className="w-4 h-4" />Save Changes</>}
            </button>
          </form>
        </SectionCard>

        {/* Password form */}
        <SectionCard
          icon={<Lock className="w-4 h-4" />}
          title="Change Password"
          desc="Keep your account secure with a strong password."
        >
          {passwordError && <Alert type="error" msg={passwordError} />}
          {passwordSuccess && <Alert type="success" msg={passwordSuccess} />}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <FieldLabel>Current Password</FieldLabel>
              <PremiumInput name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required disabled={passwordLoading} placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <FieldLabel>New Password</FieldLabel>
                <PremiumInput name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required disabled={passwordLoading} placeholder="••••••••" />
                <p className="text-[10px] text-muted-foreground">Min. 6 characters</p>
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Confirm Password</FieldLabel>
                <PremiumInput name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required disabled={passwordLoading} placeholder="••••••••" />
              </div>
            </div>
            <button
              type="submit" disabled={passwordLoading}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all btn-glow"
            >
              {passwordLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />Updating…</> : <><Lock className="w-4 h-4" />Change Password</>}
            </button>
          </form>
        </SectionCard>

        {/* Security tips */}
        <SectionCard
          icon={<Shield className="w-4 h-4" />}
          title="Security Tips"
          desc="Best practices to keep your account safe."
        >
          <div className="space-y-3">
            {[
              "Use a unique password not used on other sites.",
              "Mix uppercase, lowercase, numbers, and symbols.",
              "Never share your password with anyone.",
              "Log out when using shared or public devices.",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Account info */}
        <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
          <div className="px-6 py-5 border-b border-border/50">
            <h2 className="text-sm font-bold">Account Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Read-only account metadata</p>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: "User ID", value: user?.id || "—" },
              { label: "Role", value: user?.role?.toLowerCase().replace("_", " ") || "—" },
              { label: "Member since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—" },
              { label: "Last login", value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="text-xs font-semibold font-mono text-foreground truncate max-w-[180px]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
