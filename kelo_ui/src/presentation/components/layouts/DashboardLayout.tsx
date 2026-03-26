import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/presentation/stores/authStore";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger,
} from "@/presentation/components/ui/sidebar";
import {
  LayoutDashboard, Building2, Users, Settings,
  LogOut, MessageSquare, Shield, ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/presentation/components/ui/avatar";
import { ModeToggle } from "../theme/mode-toggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

const DashboardLayout = ({
  children,
  activeView = "overview",
  onViewChange,
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleNavigation = (view: string, path?: string) => {
    if (onViewChange) onViewChange(view);
    if (path) navigate({ to: path });
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { id: "organization", label: "Organization", icon: Building2, path: "/dashboard/organization" },
    { id: "users", label: "User Management", icon: Users, path: "/dashboard/users" },
    { id: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
    { id: "firewall", label: "Firewall", icon: Shield, path: "/dashboard/firewall" },
  ];

  const viewLabels: Record<string, string> = {
    overview: "Dashboard Overview",
    organization: "Organization",
    users: "User Management",
    settings: "Settings",
    firewall: "Firewall",
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-sidebar-border bg-sidebar">
          {/* Sidebar Header */}
          <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_12px_2px_color-mix(in_srgb,var(--primary)_35%,transparent)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">Kelo Admin</p>
                <p className="text-[11px] text-muted-foreground">Control Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-3">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60 px-2 mb-1">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-0.5">
                  {menuItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          onClick={() => handleNavigation(item.id, item.path)}
                          isActive={isActive}
                          className={`h-9 rounded-xl text-sm font-medium transition-all duration-150 ${
                            isActive
                              ? "bg-primary/12 text-primary border border-primary/20 font-semibold"
                              : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                          }`}
                        >
                          <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                          <span>{item.label}</span>
                          {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-primary/60" />}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Quick Actions */}
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60 px-2 mb-1">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate({ to: "/chat" })}
                      className="h-9 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Open Chat</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer */}
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-sidebar-accent transition-colors cursor-default">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize truncate">{user?.role?.toLowerCase().replace("_", " ")}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur-xl px-5">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="w-px h-5 bg-border/60" />
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Kelo Admin</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
              <span className="text-xs font-semibold">{viewLabels[activeView] || activeView}</span>
            </div>
            <ModeToggle />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
