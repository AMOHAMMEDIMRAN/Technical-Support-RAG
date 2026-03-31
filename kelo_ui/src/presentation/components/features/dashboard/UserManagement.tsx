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
import {
  UserPlus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Trash2,
} from "lucide-react";

const roleColors: Record<string, string> = {
  [UserRole.SUPER_ADMIN]:
    "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  [UserRole.CEO]: "bg-primary/10 text-primary border-primary/20",
  [UserRole.MANAGER]:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  [UserRole.DEVELOPER]:
    "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  [UserRole.SUPPORT]:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  [UserRole.HR]:
    "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  [UserRole.FINANCE]:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
};

const RolePill = ({ role }: { role: string }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${roleColors[role] ?? "bg-muted text-muted-foreground border-border"}`}
  >
    {role.replace("_", " ")}
  </span>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
    {children}
  </label>
);

const PremiumInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 disabled:opacity-50"
  />
);

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
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
      // Map _id to id for MongoDB compatibility
      const mappedUsers = (data.users || []).map((user: any) => ({
        ...user,
        id: user.id || user._id,
      }));
      setUsers(mappedUsers);
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
      setFormData({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        role: UserRole.SUPPORT,
      });
      await fetchUsers();
      setTimeout(() => {
        setDialogOpen(false);
        setCreateSuccess(false);
      }, 1500);
    } catch (err: any) {
      setCreateError(err.response?.data?.error || "Failed to create user.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(userId);
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete user");
    }
  };

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-1">
            Management
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} member{users.length !== 1 ? "s" : ""} in your
            organization
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all btn-glow shadow-lg shadow-primary/20">
              <UserPlus className="w-4 h-4" /> Add User
            </button>
          </DialogTrigger>

          <DialogContent className="rounded-2xl border-border/70 shadow-2xl sm:max-w-md">
            <div className="h-[3px] w-full bg-gradient-to-r from-primary via-primary/50 to-transparent -mt-6 mb-4 -mx-6 rounded-t-2xl" />
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Create New User
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add a new member to your organization
              </DialogDescription>
            </DialogHeader>

            {createSuccess && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-400/30 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> User created
                successfully!
              </div>
            )}
            {createError && (
              <div className="flex items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {createError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <FieldLabel>First Name *</FieldLabel>
                  <PremiumInput
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={createLoading}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-1.5">
                  <FieldLabel>Last Name *</FieldLabel>
                  <PremiumInput
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={createLoading}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Email *</FieldLabel>
                <PremiumInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={createLoading}
                  placeholder="john@company.com"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Password *</FieldLabel>
                <PremiumInput
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={createLoading}
                  placeholder="Min. 6 characters"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Role *</FieldLabel>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as UserRole })
                  }
                  disabled={createLoading}
                >
                  <SelectTrigger className="rounded-xl border-border/60 h-11">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/70">
                    {Object.values(UserRole)
                      .filter((r) => r !== UserRole.SUPER_ADMIN)
                      .map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="text-sm font-medium rounded-lg"
                        >
                          {role.replace("_", " ")}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                type="submit"
                disabled={createLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all btn-glow mt-2"
              >
                {createLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create User"
                )}
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/8 px-4 py-3.5 text-destructive text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Table card */}
      <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users…"
                className="w-full rounded-xl border border-border/60 bg-background/60 pl-9 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span>
              {filtered.length}{" "}
              {filtered.length !== users.length ? `of ${users.length}` : ""}{" "}
              users
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground text-sm">
            <RefreshCw className="w-5 h-5 animate-spin" /> Loading users…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
            <Users className="w-10 h-10 opacity-20" />
            <p className="text-sm">
              {search ? "No users match your search" : "No users yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20">
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Member
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`group border-b border-border/40 last:border-0 hover:bg-accent/30 transition-colors ${i % 2 !== 0 ? "bg-muted/10" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <span className="text-sm font-semibold">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-5 py-4">
                      <RolePill role={user.role} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-semibold">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${user.status === UserStatus.ACTIVE ? "bg-emerald-500 shadow-[0_0_5px_1px_rgba(16,185,129,0.5)]" : "bg-muted-foreground"}`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.role !== UserRole.SUPER_ADMIN && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive hover:text-white transition-all ml-auto"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
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
