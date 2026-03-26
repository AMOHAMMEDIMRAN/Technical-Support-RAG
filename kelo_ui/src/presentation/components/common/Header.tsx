import { useState, useEffect } from "react"
import { ModeToggle } from "../theme/mode-toggle"
import { Button } from "../ui/button"
import Login from "../features/login/Login"
import { useAuthStore } from "@/presentation/stores/authStore";
import { LogOut, LayoutDashboard, MessageSquare } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { UserRole } from "@/core/domain/types";

const Header = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_24px_-4px_rgba(0,0,0,0.08)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-primary shadow-[0_0_12px_2px_color-mix(in_srgb,var(--primary)_40%,transparent)]">
              <img src="/kelo.svg" className="w-4 h-4 brightness-200" alt="Kelo" />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Kelo</span>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <AuthButton onLoginOpen={() => setShowLogin(true)} />
          </div>
        </div>
      </header>
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default Header

export const AuthButton = ({ onLoginOpen }: { onLoginOpen: () => void }) => {
  const { isAuthenticated, logout, isLoading, user } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Button
        onClick={onLoginOpen}
        className="h-9 px-5 text-sm font-semibold rounded-xl btn-glow"
      >
        Sign in
      </Button>
    )
  }

  const isAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.CEO

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" className="h-9 gap-2 text-sm font-medium rounded-xl"
        onClick={() => navigate({ to: "/chat" })}>
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Chat</span>
      </Button>
      {isAdmin && (
        <Button variant="ghost" size="sm" className="h-9 gap-2 text-sm font-medium rounded-xl"
          onClick={() => navigate({ to: "/dashboard" })}>
          <LayoutDashboard className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Button>
      )}
      <Button
        variant="outline" size="sm" onClick={logout} disabled={isLoading}
        className="h-9 gap-2 text-sm border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors rounded-xl"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  )
};
