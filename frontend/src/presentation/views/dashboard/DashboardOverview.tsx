import { useAuthStore } from "@/presentation/stores/authStore";
import { useNavigate } from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { Building2, Users, Shield, Activity } from "lucide-react";

interface DashboardOverviewProps {
  organization: Organization | null;
}

const DashboardOverview = ({ organization }: DashboardOverviewProps) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!organization) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organization</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organization.name}</div>
            <p className="text-xs text-muted-foreground">
              {organization.domain}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="destructive" className="text-base">
              {user?.role}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Full system access
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className="text-base">Active</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              System operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => navigate({ to: "/dashboard/users" })}
              className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
            >
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">
                  Add or remove team members
                </p>
              </div>
            </button>
            <button
              onClick={() => navigate({ to: "/dashboard/organization" })}
              className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Organization Settings</p>
                <p className="text-xs text-muted-foreground">
                  Update organization details
                </p>
              </div>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{user?.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
