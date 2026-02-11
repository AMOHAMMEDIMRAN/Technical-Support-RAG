import { useState, useEffect } from "react";
import {
  userService,
  type CreateUserRequest,
} from "@/infrastructure/api/user.service";
import type { User } from "@/core/domain/types";
import { UserRole, UserStatus } from "@/core/domain/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/presentation/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

const roleColors: Record<string, string> = {
  [UserRole.SUPER_ADMIN]:
    "bg-destructive/10 text-destructive border-destructive/20",
  [UserRole.CEO]: "bg-primary/10 text-primary border-primary/20",
  [UserRole.MANAGER]: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  [UserRole.DEVELOPER]: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  [UserRole.SUPPORT]: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  [UserRole.HR]: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  [UserRole.FINANCE]: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const RolePill = ({ role }: { role: string }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
      roleColors[role] ?? "bg-muted text-muted-foreground border-border"
    }`}
  >
    {role.replace("_", " ")}
  </span>
);

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: UserRole.SUPPORT,
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data.users || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    setCreateSuccess(false);
    try {
      await userService.createUser(formData);
      setCreateSuccess(true);
      setFormData({ email: "", password: "", firstName: "", lastName: "", role: UserRole.SUPPORT });
      await fetchUsers();
      setTimeout(() => {
        setDialogOpen(false);
        setCreateSuccess(false);
      }, 1500);
    } catch (err: any) {
      setCreateError(err.response?.data?.error || "Failed to create user. Please try again.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(userId);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  // Initials avatar
  const getInitials = (first: string, last: string) =>
    `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background p-6 md:p-3">

      {/* Page header */}
      <div className="mb-10 flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Management
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200">
              {/* UserPlus icon */}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Add User
            </button>
          </DialogTrigger>

          <DialogContent className="rounded-2xl border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Create New User</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add a new user to your organization
              </DialogDescription>
            </DialogHeader>

            {createSuccess && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/20 dark:text-emerald-400">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                User created successfully!
              </div>
            )}

            {createError && (
              <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4" /><path d="M12 16h.01" />
                </svg>
                {createError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-muted-foreground">
                    First Name *
                  </label>
                  <input
                    id="firstName" name="firstName"
                    value={formData.firstName} onChange={handleChange}
                    required disabled={createLoading}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Last Name *
                  </label>
                  <input
                    id="lastName" name="lastName"
                    value={formData.lastName} onChange={handleChange}
                    required disabled={createLoading}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                  Email *
                </label>
                <input
                  id="email" name="email" type="email"
                  value={formData.email} onChange={handleChange}
                  required disabled={createLoading}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground">
                  Password *
                </label>
                <input
                  id="password" name="password" type="password"
                  value={formData.password} onChange={handleChange}
                  required disabled={createLoading} minLength={6}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-50 transition-all"
                />
                <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Role *
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as (typeof UserRole)[keyof typeof UserRole] })
                  }
                  disabled={createLoading}
                >
                  <SelectTrigger className="rounded-xl border-border">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value={UserRole.CEO}>CEO</SelectItem>
                    <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                    <SelectItem value={UserRole.DEVELOPER}>Developer</SelectItem>
                    <SelectItem value={UserRole.SUPPORT}>Support</SelectItem>
                    <SelectItem value={UserRole.HR}>HR</SelectItem>
                    <SelectItem value={UserRole.FINANCE}>Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="submit" disabled={createLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {createLoading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating…
                  </>
                ) : "Create User"}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      {/* Users table card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden relative">
        <div aria-hidden className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/6 blur-3xl pointer-events-none" />

        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {/* Users icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="flex-1 mx-4">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">All Users</p>
            <p className="text-sm font-medium">
              {users?.length || 0} member{users?.length !== 1 ? "s" : ""} in your organization
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground gap-3">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p className="text-sm">No users yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Member</th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Role</th>
                  <th className="px-6 py-3 text-left text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`group border-b border-border last:border-0 hover:bg-accent/40 transition-colors ${
                      i % 2 === 0 ? "" : "bg-muted/20"
                    }`}
                  >
                    {/* Avatar + name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>

                    <td className="px-6 py-4">
                      <RolePill role={user.role} />
                    </td>

                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm font-medium capitalize">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === UserStatus.ACTIVE
                              ? "bg-emerald-500 shadow-[0_0_5px_1px_rgba(16,185,129,0.5)]"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {user.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {user.role !== UserRole.SUPER_ADMIN && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive hover:text-primary-foreground transition-all duration-200 ml-auto"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;