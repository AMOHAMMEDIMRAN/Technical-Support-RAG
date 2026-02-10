import { useAuthStore } from "@/presentation/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { UserRole } from "@/core/domain/types";

const DashboardPage = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "destructive";
      case UserRole.CEO:
        return "default";
      case UserRole.MANAGER:
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-lg font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant={getRoleBadgeVariant(user?.role as UserRole)}>
                  {user?.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={user?.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {user?.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>Company details</CardDescription>
            </CardHeader>
            <CardContent>
              {user?.organizationId ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Organization ID
                  </p>
                  <p className="text-sm font-mono">{user.organizationId}</p>
                  <Button className="mt-4" variant="outline" size="sm">
                    View Organization
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-4">
                    You haven't created or joined an organization yet.
                  </p>
                  <Button size="sm">Create Organization</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Start New Chat
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Upload Document
              </Button>
            </CardContent>
          </Card>

          {/* Account Details Card */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent login and activity information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="text-sm font-medium">
                    {user?.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Account Created
                  </p>
                  <p className="text-sm font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Panel - Only for Super Admin and CEO */}
        {(user?.role === UserRole.SUPER_ADMIN ||
          user?.role === UserRole.CEO) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Administrative functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline">Manage Users</Button>
                <Button variant="outline">View Audit Logs</Button>
                <Button variant="outline">Organization Settings</Button>
                <Button variant="outline">System Reports</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
