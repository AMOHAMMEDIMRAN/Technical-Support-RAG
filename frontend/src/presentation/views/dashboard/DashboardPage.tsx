import { useState } from "react";
import { useAuthStore } from "@/presentation/stores/authStore";
import {
  useNavigate,
  Outlet,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import type { Organization } from "@/core/domain/types";
import { UserRole } from "@/core/domain/types";
import DashboardLayout from "@/presentation/components/layouts/DashboardLayout";
import OrganizationForm from "@/presentation/components/features/dashboard/OrganizationForm";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { Building2, AlertCircle } from "lucide-react";
import { dashboardRoute } from "@/routes/dashboardRoute";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();
  const { organization: initialOrganization } = dashboardRoute.useLoaderData();
  const [organization, setOrganization] = useState<Organization | null>(
    initialOrganization,
  );

  // Get active view from current path
  const getActiveView = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/") return "overview";
    if (path.includes("/users")) return "users";
    if (path.includes("/organization")) return "organization";
    if (path.includes("/settings")) return "settings";
    return "overview";
  };

  const activeView = getActiveView();

  const handleOrganizationCreated = async (newOrg: Organization) => {
    setOrganization(newOrg);
    // Invalidate and reload the route to fetch fresh data
    await router.invalidate();
    // Navigate to overview after org creation
    navigate({ to: "/dashboard" });
  };

  const handleViewChange = (view: string) => {
    switch (view) {
      case "overview":
        navigate({ to: "/dashboard" });
        break;
      case "users":
        navigate({ to: "/dashboard/users" });
        break;
      case "organization":
        navigate({ to: "/dashboard/organization" });
        break;
      case "settings":
        navigate({ to: "/dashboard/settings" });
        break;
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({ to: "/" });
    return null;
  }

  // If no organization exists, show creation form
  if (!organization) {
    return (
      <DashboardLayout activeView={activeView} onViewChange={handleViewChange}>
        <div className="space-y-6">
          <Alert className="bg-blue-50 text-blue-900 border-blue-200">
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Welcome to Kelo Admin!</strong> To get started, please
              create your organization first.
            </AlertDescription>
          </Alert>
          <OrganizationForm onSuccess={handleOrganizationCreated} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeView={activeView} onViewChange={handleViewChange}>
      <Outlet />
    </DashboardLayout>
  );
};

export default DashboardPage;
