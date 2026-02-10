import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import DashboardPage from "@/presentation/views/dashboard/DashboardPage";


export const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/dashboard",
    component: DashboardPage
})