import { useState } from "react";
import type { FormEvent } from "react";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { useAuthStore } from "@/presentation/stores/authStore";
import { UserRole } from "@/core/domain/types";
import { Loader2, X, Mail, Lock, Sparkles } from "lucide-react";

const Login = ({
  onClose,
  redirectTo,
}: {
  onClose: () => void;
  redirectTo?: string;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      onClose();
      let destination = redirectTo;
      if (!destination) {
        const user = useAuthStore.getState().user;
        destination =
          user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.CEO
            ? "/dashboard"
            : "/chat";
      }
      window.location.href = destination;
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/20 overflow-hidden animate-fade-in-up"
      >
        {/* Top accent bar */}
        <div className="h-0.75 w-full bg-linear-to-r from-primary via-primary/60 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-8 pt-8 pb-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary tracking-wide">Kelo</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sign in to access your workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-destructive/8 border border-destructive/20 text-destructive text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11 rounded-xl border-border/70 bg-background/60 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11 rounded-xl border-border/70 bg-background/60 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide btn-glow transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in to Kelo"
              )}
            </button>
          </form>

          {/* Default creds hint */}
          <div className="mt-6 p-3.5 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Demo Credentials
            </p>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Email</span>
                <code className="text-xs font-mono text-foreground/80 bg-background/60 px-1.5 py-0.5 rounded">admin123@gmail.com</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Password</span>
                <code className="text-xs font-mono text-foreground/80 bg-background/60 px-1.5 py-0.5 rounded">admin123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
