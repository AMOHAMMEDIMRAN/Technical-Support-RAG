import { useState } from "react";
import { Button } from "@/presentation/components/ui/button";
import { useAuthStore } from "@/presentation/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { UserRole } from "@/core/domain/types";
import Login from "@/presentation/components/features/login/Login";
import { MessageSquare, LayoutDashboard, Shield, Zap, Lock, Users, ArrowRight } from "lucide-react";

const FeaturePill = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-card border border-border/70 shadow-sm hover:border-primary/30 hover:bg-accent/40 transition-all duration-200 cursor-default">
    <span className="text-primary">{icon}</span>
    <span className="text-xs font-semibold text-foreground/80">{label}</span>
  </div>
);

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center px-4 py-3">
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </div>
);

const Hero = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleOpenChat = () => {
    if (isAuthenticated) navigate({ to: "/chat" });
    else setShowLogin(true);
  };

  const isAdmin = isAuthenticated && (
    user?.role === UserRole.SUPER_ADMIN ||
    user?.role === UserRole.CEO ||
    user?.role === UserRole.MANAGER
  );
  const isSuperAdmin = isAuthenticated && (
    user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.CEO
  );

  return (
    <main className="h-[calc(100vh-4rem)] mesh-bg overflow-hidden relative">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-primary/10 blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-8">

          {/* Left: Content */}
          <div className="space-y-7 stagger">
            {/* Badge */}
            <div className="animate-fade-in-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Enterprise Knowledge AI — Always On
            </div>

            {/* Headline */}
            <div className="animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06]">
                <span className="text-foreground">Answer faster,</span>
                <br />
                <span className="animated-gradient-text">decide smarter</span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="animate-fade-in-up text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Kelo gives every person in your company instant, accurate answers from your internal knowledge — 
              with role-based access so the right people see the right information.
            </p>

            {/* Feature pills */}
            <div className="animate-fade-in-up flex flex-wrap gap-2">
              <FeaturePill icon={<Zap className="w-3.5 h-3.5" />} label="24/7 Availability" />
              <FeaturePill icon={<Lock className="w-3.5 h-3.5" />} label="Private & Secure" />
              <FeaturePill icon={<Users className="w-3.5 h-3.5" />} label="Role-Based Access" />
            </div>

            {/* CTAs */}
            <div className="animate-fade-in-up flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="group h-12 px-7 text-sm font-bold rounded-xl btn-glow gap-2.5 shadow-lg shadow-primary/20"
                onClick={handleOpenChat}
              >
                <MessageSquare className="w-4 h-4" />
                Open Chat
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>

              {isAdmin && (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-6 text-sm font-semibold rounded-xl border-border/70 gap-2 hover:bg-accent hover:border-primary/30"
                  onClick={() => navigate({ to: "/dashboard" })}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              )}

              {isSuperAdmin && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 px-6 text-sm font-semibold rounded-xl gap-2 hover:bg-destructive/8 hover:text-destructive"
                  onClick={() => navigate({ to: "/dashboard/firewall" })}
                >
                  <Shield className="w-4 h-4" />
                  Firewall
                </Button>
              )}
            </div>

            {/* Social proof */}
            <div className="animate-fade-in-up flex items-center gap-0 divide-x divide-border/60 bg-card/60 border border-border/60 rounded-2xl backdrop-blur-sm w-fit">
              <StatCard value="99.9%" label="Uptime SLA" />
              <StatCard value="< 1s" label="Response Time" />
              <StatCard value="SOC2" label="Compliant" />
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Decorative card stack */}
            <div className="relative w-full max-w-md">
              {/* Background card */}
              <div className="absolute top-4 left-4 right-4 h-64 rounded-2xl border border-border/50 bg-card/40 blur-[1px]" />
              
              {/* Main chat preview card */}
              <div className="relative rounded-2xl border border-border/70 bg-card shadow-2xl shadow-black/10 overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">K</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Kelo AI</p>
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] text-muted-foreground">Online</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-3 min-h-[220px]">
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary text-[10px] font-bold">AI</span>
                    </div>
                    <div className="bg-muted/60 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[80%] text-foreground/80">
                      Hi! I'm Kelo. Ask me anything about your company's knowledge base, policies, or processes.
                    </div>
                  </div>

                  <div className="flex gap-2.5 flex-row-reverse">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-[10px] font-bold">AB</span>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-xl rounded-tr-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[75%]">
                      What's our parental leave policy?
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary text-[10px] font-bold">AI</span>
                    </div>
                    <div className="bg-muted/60 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs leading-relaxed max-w-[80%] text-foreground/80">
                      Your company offers <strong>16 weeks</strong> of paid parental leave for primary caregivers and <strong>6 weeks</strong> for secondary caregivers. 
                      <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-primary font-medium">
                        📎 Source: HR Policy v2.3
                      </span>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-primary text-[10px] font-bold">AI</span>
                    </div>
                    <div className="bg-muted/60 rounded-xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>

                {/* Input bar */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5">
                    <span className="flex-1 text-xs text-muted-foreground/50">Ask Kelo anything…</span>
                    <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showLogin && <Login onClose={() => setShowLogin(false)} redirectTo="/chat" />}
    </main>
  );
};

export default Hero;
