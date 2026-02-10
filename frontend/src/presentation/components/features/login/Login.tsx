import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { useAuthStore } from "@/presentation/stores/authStore";
import { UserRole } from "@/core/domain/types";
import { Loader2 } from "lucide-react";

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
      // On success, close modal
      onClose();

  
      // Determine redirect
      
let destination = redirectTo

if (!destination) {
  const user = useAuthStore.getState().user

destination =
  user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.CEO
    ? "/dashboard"
    : "/chat"

}

window.location.href = destination


    } catch (err) {
      // Error is handled by the store
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-95 rounded-2xl border bg-card p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground transition"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>

        <div className="mt-6 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Default Admin Credentials:</p>
          <p>Email: admin123@gmail.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
