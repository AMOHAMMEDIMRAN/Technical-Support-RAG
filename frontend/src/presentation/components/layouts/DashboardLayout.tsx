import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/presentation/stores/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/presentation/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  LogOut,
  Bot,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { Avatar, AvatarFallback } from "@/presentation/components/ui/avatar";
import { Badge } from "@/presentation/components/ui/badge";
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
    if (onViewChange) {
      onViewChange(view);
    }
    if (path) {
      navigate({ to: path });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      onClick: () => handleNavigation("overview"),
    },
    {
      id: "organization",
      label: "Organization",
      icon: Building2,
      onClick: () => handleNavigation("organization"),
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      onClick: () => handleNavigation("users"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => handleNavigation("settings"),
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Kelo Admin</h2>
                <p className="text-xs text-muted-foreground">Control Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={item.onClick}
                        isActive={activeView === item.id}
                        tooltip={item.label}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate({ to: "/chat" })}
                      tooltip="Open Chat"
                    >
                      <Bot className="h-4 w-4" />
                      <span>Open Chat</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <Badge variant="outline" className="text-xs">
                  {user?.role}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-xl font-semibold capitalize">{activeView}</h1>
            </div>
            <ModeToggle />
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
