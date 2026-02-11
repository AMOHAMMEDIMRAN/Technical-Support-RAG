import { useState } from "react";
import { useAuthStore } from "@/presentation/stores/authStore";
import { authService } from "@/infrastructure/api/auth.service";

const SettingsPage = () => {
  const { user, setUser } = useAuthStore();

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const updated = await authService.updateProfile(profileData);
      setUser(updated);
      setProfileSuccess("Profile updated successfully");
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err: any) {
      setProfileError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      setPasswordLoading(false);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      setPasswordLoading(false);
      return;
    }

    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordSuccess("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(null), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background p-3 md:p-3">

      {/* Page header */}
      <div className="mb-10 flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Account
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        </div>
        {/* Avatar */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide">
          {initials || "U"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Profile card ── left 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div aria-hidden className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/8 blur-2xl pointer-events-none" />

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* Person icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">Profile</p>
          <h2 className="text-base font-semibold mb-6">Personal Information</h2>

          {profileError && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
              </svg>
              {profileError}
            </div>
          )}

          {profileSuccess && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
              </svg>
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-muted-foreground">
                  First Name
                </label>
                <input
                  id="firstName" name="firstName"
                  value={profileData.firstName} onChange={handleProfileChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-muted-foreground">
                  Last Name
                </label>
                <input
                  id="lastName" name="lastName"
                  value={profileData.lastName} onChange={handleProfileChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email" name="email" type="email"
                  value={profileData.email} onChange={handleProfileChange}
                  required
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit" disabled={profileLoading}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {profileLoading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Saving…
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right col: account info snapshot ── */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div aria-hidden className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* ID card icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <circle cx="8" cy="12" r="2" />
              <path d="M14 9h4" /><path d="M14 12h4" /><path d="M14 15h1" />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">Current Account</p>
          <h2 className="text-base font-semibold mb-4">Your Details</h2>

          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Name</span>
              <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Email</span>
              <span className="text-sm font-medium truncate max-w-[140px]">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize">{user?.role}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-background px-4 py-3 border border-border">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className="flex items-center gap-1.5 text-sm font-medium capitalize">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_1px_rgba(16,185,129,0.5)]" />
                {user?.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Password card ── full width below */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 relative overflow-hidden">
          <div aria-hidden className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* Lock icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">Security</p>
          <h2 className="text-base font-semibold mb-6">Change Password</h2>

          {passwordError && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
              </svg>
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
              </svg>
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 relative z-10">
            <div className="space-y-1.5">
              <label htmlFor="currentPassword" className="text-xs uppercase tracking-widest text-muted-foreground">
                Current Password
              </label>
              <input
                id="currentPassword" name="currentPassword" type="password"
                value={passwordData.currentPassword} onChange={handlePasswordChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="newPassword" className="text-xs uppercase tracking-widest text-muted-foreground">
                  New Password
                </label>
                <input
                  id="newPassword" name="newPassword" type="password"
                  value={passwordData.newPassword} onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
                <p className="text-xs text-muted-foreground">Min. 6 characters</p>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-xs uppercase tracking-widest text-muted-foreground">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword" name="confirmPassword" type="password"
                  value={passwordData.confirmPassword} onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit" disabled={passwordLoading}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {passwordLoading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Changing…
                  </>
                ) : "Change Password"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Security tips card ── right col bottom */}
        <div className="lg:col-span-1 rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* Shield icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-0.5">Tips</p>
          <h2 className="text-base font-semibold mb-4">Keep It Secure</h2>

          <div className="space-y-3">
            {[
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "Use a unique password not used elsewhere" },
              { icon: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83", text: "Mix letters, numbers and symbols" },
              { icon: "M12 8v4M12 16h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z", text: "Never share your password with anyone" },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-background border border-border px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary/60">
                  <path d={icon} />
                </svg>
                <span className="text-xs text-muted-foreground leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;