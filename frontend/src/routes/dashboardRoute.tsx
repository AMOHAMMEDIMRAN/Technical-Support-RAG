import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./root";
import { authService } from "@/infrastructure/api/auth.service";
import { UserRole } from "@/core/domain/types";
import DashboardPage from "@/presentation/views/dashboard/DashboardPage";
import DashboardOverview from "@/presentation/views/dashboard/DashboardOverview";
import OrganizationView from "@/presentation/views/dashboard/OrganizationView";
import SettingsPage from "@/presentation/views/dashboard/SettingsPage";
import UserManagement from "@/presentation/components/features/dashboard/UserManagement";
import { organizationService } from "@/infrastructure/api/organization.service";

// Main dashboard layout route with organization loader
export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
  beforeLoad: ({ context }) => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  loader: async () => {
    try {
      const organization = await organizationService.getOrganization();
      return { organization };
    } catch (error) {
      return { organization: null };
    }
  },
});

// Dashboard index (overview)
export const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: () => {
    const { organization } = dashboardRoute.useLoaderData();
    return <DashboardOverview organization={organization} />;
  },
});

// Users route
export const dashboardUsersRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/users",
  component: UserManagement,
});

// Organization route
export const dashboardOrganizationRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/organization",
  component: () => {
    const { organization } = dashboardRoute.useLoaderData();
    return <OrganizationView organization={organization} />;
  },
});

// Settings route
export const dashboardSettingsRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/settings",
  component: SettingsPage,
});
